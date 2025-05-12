import sqlite3
from datetime import datetime

from prefect import task


@task
def insert_downloads():
    date = datetime.now().isoformat()

    conn = sqlite3.connect("../podcasts.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT OR IGNORE INTO download (id, status, scraped_at)
        SELECT id, 'pending', ?
        FROM podcast
        """,
        (date,),
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    insert_downloads()
