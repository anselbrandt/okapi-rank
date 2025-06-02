import sqlite3
from datetime import datetime
from typing import Literal
from pathlib import Path


def insert_downloads(db_path: Path, status: Literal["pending", "active"]):  # or active
    date = datetime.now().isoformat()

    conn = sqlite3.connect(db_path)
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
