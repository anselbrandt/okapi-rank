from prefect import flow

SOURCE_REPO = "https://github.com/anselbrandt/okapi-rank.git"

if __name__ == "__main__":
    flow.from_source(
        source=SOURCE_REPO,
        entrypoint="workflow.py:update_feeds",
    ).deploy(
        name="okapi-deployment",
        work_pool_name="okapi-pool",
        cron="0 */4 * * *",  # Run every 4 hours
    )
