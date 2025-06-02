from datetime import datetime, timezone
from pathlib import Path
from storage import DataIO
import os
from dotenv import load_dotenv

import httpx

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")


def parse_date(date_str: str):
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def generate_top_stories(sections_dir: Path):
    target_files = [
        "news/news",
        "news/world",
        "news/europe",
        "news/news_commentary",
        "news/politics",
        "society_and_culture/society_and_culture",
        "arts/arts",
    ]

    top_stories_by_file = {}
    seen_urls = set()

    for name in target_files:
        url = f"https://cdn.anselbrandt.net/{name}.json"
        response = httpx.get(url)
        if response.status_code == 200:
            data = response.json()

        episodes = data

        filtered = []

        seen_podcast_names = set()

        for ep in episodes:
            url = ep.get("url")
            score = ep.get("score", 0)
            release_date = ep.get("release_date", "")
            podcast_name = ep.get("podcast_name")

            if not url or url in seen_urls or score <= 1:
                continue
            if not podcast_name or podcast_name in seen_podcast_names:
                continue

            parsed_date = parse_date(release_date)
            if not parsed_date:
                continue

            ep["_parsed_date"] = parsed_date
            seen_urls.add(url)
            seen_podcast_names.add(podcast_name)
            filtered.append(ep)

        filtered.sort(key=lambda ep: ep["_parsed_date"], reverse=True)
        top_episodes = filtered[:20]

        for ep in top_episodes:
            ep.pop("_parsed_date", None)

        top_stories_by_file[name.split("/")[1]] = top_episodes

    out_dir = sections_dir / "top_stories"
    out_dir.mkdir(exist_ok=True, parents=True)
    output_path = out_dir / "top_stories.json"

    # DataIO(path=output_path, mode="w", encoding="utf-8").write_json(top_stories_by_file)

    url = "https://cdn.anselbrandt.net/upload"
    top_stories_by_file["timestamp"] = datetime.now().isoformat()
    headers = {"Content-Type": "application/json", "X-API-Token": API_TOKEN}
    payload = {"filename": "top_stories/top_stories.json", "data": top_stories_by_file}
    response = httpx.post(url, headers=headers, json=payload)
    print(response.text)


if __name__ == "__main__":
    generate_top_stories(
        sections_dir=Path("sections"),
    )
