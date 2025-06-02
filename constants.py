from dataclasses import dataclass
from pathlib import Path


@dataclass
class Paths:
    db_path: Path
    data_dir: Path


paths = Paths(
    db_path=Path("data/podcasts.db").resolve(), data_dir=Path("data").resolve()
)
