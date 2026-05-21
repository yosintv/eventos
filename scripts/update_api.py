BASE_URL = "https://days.to/event/json?page={page}"
IMPERSONATION = "chrome124"
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
            "https://days.to/",
            impersonate=impersonate,
            timeout=timeout,
            headers=WARMUP_HEADERS,
        )

    response = session.get(
        url,
        impersonate=impersonate,
        timeout=timeout,
        headers=API_HEADERS,
    )
    response.raise_for_status()
    return _extract_json_payload(response.text)


def fetch_page(page: int, timeout: int, retries: int = 3) -> Any:
    url = BASE_URL.format(page=page)
    direct_url = BASE_URL.format(page=page)
    fallback_urls = [template.format(page=page) for template in FALLBACK_BASE_URLS]
    last_error: Exception | None = None

    for attempt in range(1, retries + 1):
        impersonate = IMPERSONATION_TARGETS[(attempt - 1) % len(IMPERSONATION_TARGETS)]
        try:
            response = requests.get(
                url,
                impersonate=IMPERSONATION,
            return _request_json(
                direct_url,
                timeout=timeout,
                headers={"Accept": "application/json"},
                impersonate=impersonate,
                warmup=True,
            )
            response.raise_for_status()
            return response.json()
        except Exception as error:  # noqa: BLE001
            last_error = error
            if attempt == retries:
                break
            print(
                f"page {page}: direct fetch failed on attempt {attempt}/{retries} "
                f"using {impersonate}: {type(error).__name__}"
            )
            for fallback_url in fallback_urls:
                try:
                    print(f"page {page}: trying fallback source {fallback_url}")
                    return _request_json(
                        fallback_url,
                        timeout=timeout,
                        impersonate=impersonate,
                        warmup=False,
                    )
                except Exception as fallback_error:  # noqa: BLE001
                    last_error = fallback_error
                    print(
                        f"page {page}: fallback failed ({type(fallback_error).__name__})"
                    )

        if attempt < retries:
            wait_seconds = attempt * 2
            time.sleep(wait_seconds)

    assert last_error is not None
