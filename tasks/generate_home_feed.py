from datetime import datetime, timedelta, timezone
from pathlib import Path
import json
from storage import DataIO


def generate_home_feed(sections_dir: Path):

    all_episodes = []
    files = DataIO(path=sections_dir).list_files()
    for file in files:
        episodes = DataIO(path=file, mode="r", encoding="utf-8").read_json()
        all_episodes.extend(episodes)

    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(days=1)

    def parse_date(date_str):
        try:
            dt = datetime.fromisoformat(date_str)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            return None

    recent_episodes = [
        ep
        for ep in all_episodes
        if (dt := parse_date(ep["release_date"])) and dt >= yesterday
    ]

    seen_urls = set()
    unique_episodes = []
    for ep in recent_episodes:
        url = ep.get("url")
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_episodes.append(ep)

    top_episodes = sorted(
        unique_episodes, key=lambda ep: ep.get("score", 0), reverse=True
    )[:200]
    out_path = sections_dir / "home.json"
    out_file = DataIO(path=out_path, mode="w", encoding="utf-8")
    top_episodes.sort(key=lambda ep: ep["release_date"], reverse=True)
    out_file.write_json(top_episodes)


if __name__ == "__main__":
    generate_home_feed(
        sections_dir=Path("sections"),
    )
