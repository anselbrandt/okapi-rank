from pathlib import Path
import json

from fastapi import FastAPI, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

STATIC_DIR = Path("../static")
STATIC_DIR.mkdir(parents=True, exist_ok=True)


class Upload(BaseModel):
    filename: str
    data: list[dict]


API_TOKEN = "sample-api-token"

app = FastAPI()


@app.post("/upload")
async def upload_file(upload: Upload, x_api_token: Optional[str] = Header(None)):
    if x_api_token != API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing API token")

    try:
        filepath = STATIC_DIR / upload.filename
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with filepath.open("w", encoding="utf-8") as f:
            json.dump(upload.data, f, ensure_ascii=False, indent=2)

        return {
            "status": "success",
            "filename": upload.filename,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write file: {e}")


app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
