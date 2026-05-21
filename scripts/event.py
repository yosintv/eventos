#!/usr/bin/env python3
"""Fetch and refresh local API page snapshots from days.to."""

from __future__ import annotations

import argparse
import json
import time
from datetime import date, datetime
from pathlib import Path
from typing import Any

from curl_cffi import requests

BASE_URL = "https://days.to/event/json?page={page}"
FALLBACK_BASE_URLS = (
    "https://r.jina.ai/http://days.to/event/json?page={page}",
)
IMPERSONATION_TARGETS = ("chrome", "chrome136", "chrome124", "safari17_0")
API_HEADERS = {
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Origin": "https://days.to",
    "Referer": "https://days.to/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
}
WARMUP_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update api/page1.json ... api/pageN.json from days.to."
    )
    parser.add_argument("--start-page", type=int, default=1, help="First page (default: 1)")
    parser.add_argument("--pages", type=int, default=25, help="Number of pages (default: 25)")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("api"),
        help="Output folder for page JSON files (default: api)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="HTTP timeout in seconds (default: 30)",
    )
    return parser.parse_args()


def parse_event_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    text = value.strip()
    if not text:
        return None
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        return datetime.fromisoformat(text)
    except ValueError:
        return None


def is_current_or_upcoming(event: dict[str, Any], today: date) -> bool:
    # Keep events if we cannot parse dates; only remove clearly past events.
    start_dt = parse_event_datetime(event.get("start"))
    end_dt = parse_event_datetime(event.get("end"))
    if start_dt is None and end_dt is None:
        return True

    event_end = end_dt or start_dt
    assert event_end is not None
    return event_end.date() >= today


def _extract_json_payload(text: str) -> Any:
    raw = text.lstrip("\ufeff").strip()
    if not raw:
        raise ValueError("Empty response body")
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        first_array = raw.find("[")
        first_object = raw.find("{")
        indices = [index for index in (first_array, first_object) if index >= 0]
        if not indices:
            raise
        return json.loads(raw[min(indices) :])


def _request_json(url: str, timeout: int, impersonate: str, warmup: bool) -> Any:
    session = requests.Session()
    if warmup:
        # Warm up with a regular page request so anti-bot checks are less likely to block.
        session.get(
