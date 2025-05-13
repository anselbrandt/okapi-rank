import sqlite3
from datetime import datetime


def insert_downloads(status="pending"):  # or active
    date = datetime.now().isoformat()

    conn = sqlite3.connect("/home/ansel/dev/okapi-rank/podcasts.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT OR IGNORE INTO download (id, status, scraped_at)
        SELECT id, ?, ?
        FROM podcast
        """,
        (status, date),
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    insert_downloads()
