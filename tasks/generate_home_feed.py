from datetime import datetime, timedelta, timezone
from pathlib import Path
import json


def generate_home_feed():
    ROOT_DIR = Path(__file__).resolve().parents[1]
    out_dir = ROOT_DIR / "frontend" / "public" / "sections"

    all_episodes = []
    for file in out_dir.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            episodes = json.load(f)
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

    with open(out_dir / "home.json", "w", encoding="utf-8") as f:
        json.dump(top_episodes, f, ensure_ascii=False)


if __name__ == "__main__":
    generate_home_feed()
