from datetime import datetime, timezone
from pathlib import Path
from storage import DataIO


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

    def parse_date(date_str: str):
        try:
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except Exception:
            return None

    top_stories_by_file = {}
    seen_urls = set()

    for name in target_files:
        file_path = sections_dir / f"{name}.json"
        if not file_path.exists():
            continue

        episodes = DataIO(path=file_path, mode="r", encoding="utf-8").read_json()
        filtered = []

        for ep in episodes:
            url = ep.get("url")
            score = ep.get("score", 0)
            release_date = ep.get("release_date", "")

            if not url or url in seen_urls or score <= 1:
                continue

            parsed_date = parse_date(release_date)
            if not parsed_date:
                continue

            ep["_parsed_date"] = parsed_date
            seen_urls.add(url)
            filtered.append(ep)

        filtered.sort(key=lambda ep: ep["_parsed_date"], reverse=True)
        top_episodes = filtered[:20]

        for ep in top_episodes:
            ep.pop("_parsed_date", None)

        top_stories_by_file[name] = top_episodes

    out_dir = sections_dir / "top_stories"
    out_dir.mkdir(exist_ok=True, parents=True)
    output_path = out_dir / "top_stories.json"

    DataIO(path=output_path, mode="w", encoding="utf-8").write_json(top_stories_by_file)


if __name__ == "__main__":
    generate_top_stories(
        sections_dir=Path("sections"),
    )
