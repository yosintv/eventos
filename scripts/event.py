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
IMPERSONATION = "chrome124"


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


def fetch_page(page: int, timeout: int, retries: int = 3) -> Any:
    url = BASE_URL.format(page=page)
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            response = requests.get(
                url,
                impersonate=IMPERSONATION,
                timeout=timeout,
                headers={"Accept": "application/json"},
            )
            response.raise_for_status()
            return response.json()
        except Exception as error:  # noqa: BLE001
            last_error = error
            if attempt == retries:
                break
            wait_seconds = attempt * 2
            print(
                f"page {page}: fetch failed on attempt {attempt}/{retries}, "
                f"retrying in {wait_seconds}s..."
            )
            time.sleep(wait_seconds)
    assert last_error is not None
    raise last_error


def normalize_page(data: Any, today: date) -> Any:
    if not isinstance(data, list):
        return data
    normalized: list[Any] = []
    for item in data:
        if isinstance(item, dict):
            if is_current_or_upcoming(item, today):
                normalized.append(item)
        else:
            normalized.append(item)
    return normalized


def write_page(path: Path, data: Any) -> None:
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    args = parse_args()
    output_dir: Path = args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    today = date.today()
    total = args.pages
    for page in range(args.start_page, args.start_page + args.pages):
        raw = fetch_page(page, timeout=args.timeout)
        filtered = normalize_page(raw, today=today)
        out_file = output_dir / f"page{page}.json"
        write_page(out_file, filtered)

        if isinstance(raw, list) and isinstance(filtered, list):
            removed = len(raw) - len(filtered)
            print(
                f"page {page}/{args.start_page + total - 1}: "
                f"saved {out_file} ({len(filtered)} events, removed {removed} past)"
            )
        else:
            print(f"page {page}/{args.start_page + total - 1}: saved {out_file}")


if __name__ == "__main__":
    main()
