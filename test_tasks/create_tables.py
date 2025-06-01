import sqlite3
from pathlib import Path


def create_tables(db_path: Path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    conn.execute("PRAGMA foreign_keys = ON;")

    try:
        conn.execute("BEGIN TRANSACTION")

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS podcast (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                subcategory TEXT DEFAULT 'UNKNOWN',
                update_frequency TEXT DEFAULT 'UNKNOWN',
                rating INTEGER DEFAULT 0,
                reviews INTEGER DEFAULT 0,
                url TEXT NOT NULL,
                show_id TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS ranking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                podcast_id INTEGER NOT NULL,
                country TEXT NOT NULL,
                rank INTEGER DEFAULT 0,
                chart_date TEXT NOT NULL,
                scraped_at TEXT NOT NULL,
                FOREIGN KEY(podcast_id) REFERENCES podcast(id)
            );
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS score (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                podcast_id INTEGER NOT NULL,
                rank_score INTEGER DEFAULT 0,
                date TEXT NOT NULL,
                FOREIGN KEY(podcast_id) REFERENCES podcast(id)
            );
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS download (
                id INTEGER PRIMARY KEY,
                status TEXT NOT NULL,
                scraped_at TEXT NOT NULL,
                FOREIGN KEY(id) REFERENCES podcast(id)
            );
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS episode (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                podcast_id INTEGER NOT NULL,
                episode_id TEXT NOT NULL,
                show_title TEXT NOT NULL,
                show_id INTEGER NOT NULL,
                title TEXT,
                release_date TEXT,
                duration TEXT,
                has_free_version BOOL,
                channel_name TEXT,
                show_image TEXT,
                episode_image TEXT,
                show_alt_image TEXT,
                episode_url TEXT,
                summary TEXT,
                caption TEXT,
                short_caption TEXT,
                scraped_at TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(podcast_id, episode_id),
                FOREIGN KEY (podcast_id) REFERENCES podcast(id)
            );
            """
        )
        cursor.execute(
            """
            CREATE VIRTUAL TABLE IF NOT EXISTS episode_fts USING fts5(
                show_title,
                summary,
                content='episode',
                content_rowid='id'
            );
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS frequency (
                podcast_id INTEGER PRIMARY KEY,
                frequency TEXT NOT NULL,
                next_scrape TEXT NOT NULL,
                FOREIGN KEY (podcast_id) REFERENCES podcast(id)
                UNIQUE(podcast_id)
            );
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS tag (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS episode_tag (
                episode_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                PRIMARY KEY (episode_id, tag_id),
                FOREIGN KEY (episode_id) REFERENCES episode(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
            );
            """
        )

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_show_id ON podcast (show_id);")
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_ranking_podcast_id ON ranking(podcast_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_ranking_chart_date ON ranking(chart_date);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_episode_podcast_id ON episode(podcast_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_episode_release_date ON episode(release_date);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_episode_tag_episode_id ON episode_tag(episode_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_episode_tag_tag_id ON episode_tag(tag_id);"
        )

        cursor.execute(
            """
            CREATE TRIGGER IF NOT EXISTS trg_podcast_updated
            AFTER UPDATE ON podcast
            FOR EACH ROW
            BEGIN
                UPDATE podcast SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
            END;
            """
        )
        cursor.execute(
            """
            CREATE TRIGGER IF NOT EXISTS trg_episode_updated
            AFTER UPDATE ON episode
            FOR EACH ROW
            BEGIN
                UPDATE episode SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
            END;
            """
        )
        cursor.execute(
            """
            CREATE TRIGGER IF NOT EXISTS episode_ai AFTER INSERT ON episode BEGIN
                INSERT INTO episode_fts(rowid, show_title, summary)
                VALUES (new.id, new.show_title, new.summary);
            END;
            """
        )
        cursor.execute(
            """
            CREATE TRIGGER IF NOT EXISTS episode_ad AFTER DELETE ON episode BEGIN
                DELETE FROM episode_fts WHERE rowid = old.id;
            END;
            """
        )
        cursor.execute(
            """
            CREATE TRIGGER IF NOT EXISTS episode_au AFTER UPDATE ON episode BEGIN
                UPDATE episode_fts SET show_title = new.show_title, summary = new.summary
                WHERE rowid = old.id;
            END;
            """
        )

        conn.commit()

    except sqlite3.Error as error:
        print(error)
        conn.rollback()

    finally:
        conn.close()


if __name__ == "__main__":
    create_tables(db_path=Path("db.sqlite"))
