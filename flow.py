import os
import shutil
import subprocess
import sys

from dotenv import load_dotenv

from constants import paths
from categories import CATEGORY_MAPPINGS

from tasks import (
    create_tables,
    generate_home_feed,
    generate_section_feeds,
    insert_downloads,
    insert_episodes,
    insert_podcasts,
    insert_scores,
    push_feeds,
    scrape_shows,
)

load_dotenv()


def make_dirs():
    dirs = [paths.data_dir, paths.charts_dir, paths.shows_dir, paths.sections_dir]
    for dir in dirs:
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


def update_feeds():
    make_dirs()
    scrape_charts(charts_dir=paths.charts_dir)
    create_tables(db_path=paths.db_path)
    insert_podcasts(db_path=paths.db_path, charts_dir=paths.charts_dir)
    insert_downloads(db_path=paths.db_path, status="pending")
    scrape_shows(db_path=paths.db_path, shows_dir=paths.shows_dir)
    insert_episodes(db_path=paths.db_path, shows_dir=paths.shows_dir)
    insert_scores(db_path=paths.db_path)
    generate_section_feeds(
        db_path=paths.db_path,
        sections_dir=paths.sections_dir,
        categories=CATEGORY_MAPPINGS,
    )
    generate_home_feed(
        sections_dir=paths.sections_dir,
    )
    push_feeds()


if __name__ == "__main__":
    update_feeds()
