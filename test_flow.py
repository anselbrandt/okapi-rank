import os
import shutil
import subprocess
import sys

from dotenv import load_dotenv

from constants import paths

from categories import BASE_INDEX

from tasks import (
    create_tables,
    insert_downloads,
    insert_podcasts,
    insert_episodes,
    insert_scores,
    generate_category_mappings,
    generate_section_feeds,
    generate_top_stories,
    push_feeds,
)

from sub_tasks import get_shows, group_results, scrape_shows

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
    while True:
        make_dirs()
        scrape_charts(charts_dir=paths.charts_dir)
        create_tables(db_path=paths.db_path)
        insert_podcasts(db_path=paths.db_path, charts_dir=paths.charts_dir)
        insert_downloads(db_path=paths.db_path, status="pending")
        results = get_shows(db_path=paths.db_path)
        grouped = group_results(results)
        for i, (category, shows) in enumerate(grouped.items()):
            if i == 0 or i % 4 == 0:
                scrape_shows(
                    grouped["news"], db_path=paths.db_path, shows_dir=paths.shows_dir
                )
                insert_episodes(
                    db_path=paths.db_path, shows_dir=paths.shows_dir / "news"
                )
                insert_scores(db_path=paths.db_path)
                category_mappings = generate_category_mappings(
                    db_path=paths.db_path, base_index=BASE_INDEX
                )
                generate_section_feeds(
                    db_path=paths.db_path,
                    sections_dir=paths.sections_dir,
                    categories=category_mappings,
                )
                generate_top_stories(
                    sections_dir=paths.sections_dir,
                )
                push_feeds()
            if category != "news":
                scrape_shows(shows, db_path=paths.db_path, shows_dir=paths.shows_dir)
                insert_episodes(
                    db_path=paths.db_path, shows_dir=paths.shows_dir / category
                )
                insert_scores(db_path=paths.db_path)
                category_mappings = generate_category_mappings(
                    db_path=paths.db_path, base_index=BASE_INDEX
                )
                generate_section_feeds(
                    db_path=paths.db_path,
                    sections_dir=paths.sections_dir,
                    categories=category_mappings,
                )
                generate_top_stories(
                    sections_dir=paths.sections_dir,
                )
                push_feeds()


if __name__ == "__main__":
    update_feeds()
