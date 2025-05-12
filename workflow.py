from prefect import flow, task
import subprocess
import os
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


@task
def scrape_charts():
    script_path = os.path.join("scraper", "scrape_charts.js")
    try:
        result = subprocess.run(
            ["node", script_path], check=True, text=True, capture_output=True
        )
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
    except subprocess.CalledProcessError as e:
        print("Error running script:", e)
        print("STDERR:", e.stderr)


@task
def create_tables_task():
    create_tables()


@task
def insert_podcasts_task():
    insert_podcasts()


@task
def insert_downloads_task():
    insert_downloads()


@task
def scrape_shows_task():
    scrape_shows()


@task
def insert_episodes_task():
    insert_episodes()


@task
def insert_scores_task():
    insert_scores()


@task
def generate_section_feeds_task():
    generate_section_feeds()


@task
def generate_home_feed_task():
    generate_home_feed()


@task
def push_feeds_task():
    push_feeds()


@flow(log_prints=True)
def update_feeds():
    scrape_charts()
    create_tables_task()
    insert_podcasts_task()
    insert_downloads_task()
    scrape_shows_task()
    insert_episodes_task()
    insert_scores_task()
    generate_section_feeds_task()
    generate_home_feed_task()
    push_feeds_task()


# Run the flow
if __name__ == "__main__":
    update_feeds()
