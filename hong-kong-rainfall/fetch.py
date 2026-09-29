# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Download once; keep the publisher response unchanged."""
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

HERE = Path(__file__).resolve().parent
DATA = HERE / "data" / "hong-kong-rain-2025.json"
URL = ("https://archive-api.open-meteo.com/v1/archive?latitude=22.3193"
       "&longitude=114.1694&start_date=2025-01-01&end_date=2025-12-31"
       "&daily=rain_sum&timezone=Asia%2FHong_Kong&models=era5")


def fetch_once():
    """Do not refresh or overwrite an existing snapshot."""
    if DATA.exists():
        print(f"Keeping existing snapshot: {DATA}")
        return
    with urlopen(URL, timeout=60) as response:
        raw = response.read()
    payload = json.loads(raw)
    if payload.get("error") or len(payload.get("daily", {}).get("time", [])) != 365:
        raise ValueError("Expected a complete 2025 daily series.")
    DATA.parent.mkdir(exist_ok=True)
    with DATA.open("xb") as handle:
        handle.write(raw)
    print(f"Saved {len(raw)} original bytes; SHA256 {hashlib.sha256(raw).hexdigest()}")


if __name__ == "__main__":
    fetch_once()
