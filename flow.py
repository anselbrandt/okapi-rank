from datetime import datetime, timedelta
import os
import shutil
import subprocess
import sys
import time

from dotenv import load_dotenv

from constants import paths
from categories import BASE_INDEX
from tasks import (
    create_tables,
    generate_category_mappings,
    generate_section_feeds,
    generate_top_stories,
    get_shows,
    group_results,
    insert_downloads,
    insert_episodes,
    insert_podcasts,
    insert_scores,
    push_feeds,
    scrape_shows,
)

load_dotenv()

UPDATE_INTERVAL = 15

last_push_time = None


def make_dirs():
    for dir in [paths.data_dir, paths.charts_dir, paths.shows_dir, paths.sections_dir]:
        dir.mkdir(exist_ok=True, parents=True)


def scrape_charts(charts_dir=paths.charts_dir):
    charts_dir.mkdir(exist_ok=True, parents=True)
    node_path = os.getenv("NODE_PATH") or shutil.which("node")
    if node_path is None:
        print("Node.js not found in PATH.")
        return

    script_path = os.path.join("scraper", "scrape_charts.js")

    try:
        result = subprocess.run(
            [node_path, script_path, str(charts_dir)],
            check=True,
            text=True,
            stdout=sys.stdout,
            stderr=sys.stderr,
        )
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
    except subprocess.CalledProcessError as e:
        print("Error running script:", e)
        print("STDERR:", e.stderr)


def process_category(category, shows):
    global last_push_time

    scrape_shows(shows, db_path=paths.db_path, shows_dir=paths.shows_dir)
    insert_episodes(db_path=paths.db_path, shows_dir=paths.shows_dir / category)
    insert_scores(db_path=paths.db_path)

    category_mappings = generate_category_mappings(
        db_path=paths.db_path, base_index=BASE_INDEX
    )
    filtered_mappings = {
        k: v
        for k, v in category_mappings.items()
        if k == category or category == "news" and k == "latest"
    }
    generate_section_feeds(
        db_path=paths.db_path,
        sections_dir=paths.sections_dir,
        categories=filtered_mappings,
    )
    generate_top_stories(sections_dir=paths.sections_dir)

    now = datetime.now()
    if not last_push_time or (now - last_push_time) > timedelta(
        minutes=UPDATE_INTERVAL
    ):
        push_feeds()
        last_push_time = now


def update_feeds():
    while True:
        make_dirs()
        scrape_charts()
        create_tables(db_path=paths.db_path)
        insert_podcasts(db_path=paths.db_path, charts_dir=paths.charts_dir)
        insert_downloads(db_path=paths.db_path, status="pending")

        results = get_shows(db_path=paths.db_path)
        grouped = group_results(results)

        for i, (category, shows) in enumerate(grouped.items()):
            if i == 0 or i % 4 == 0:
                process_category("news", grouped["news"])
            if category != "news":
                process_category(category, shows)


if __name__ == "__main__":
    update_feeds()
