import json
from pydantic import BaseModel
from pathlib import Path
from typing import Optional, Literal, Any
import os


class DataIO(BaseModel):
    path: Path
    mode: Literal["r", "w", "rb", "wb"] = "r"
    encoding: Optional[str] = "utf-8"

    def write(self, data: str | bytes) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, self.mode, encoding=self.encoding) as f:
            f.write(data)

    def read(self) -> str | bytes:
        with open(self.path, self.mode, encoding=self.encoding) as f:
            return f.read()

    def read_json(self) -> Any:
        with open(self.path, "r", encoding=self.encoding) as f:
            return json.load(f)

    def write_json(self, obj: Any) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, "w", encoding=self.encoding) as f:
            json.dump(obj, f, ensure_ascii=False)

    def list_files(self) -> list[Path]:
        """Recursively lists all files in a directory. Returns an empty list if the directory doesn't exist or is not a directory."""
        folder_path = self.path

        if folder_path.exists() and folder_path.is_dir():
            return [file for file in folder_path.glob("**/*") if file.is_file()]
        return []
