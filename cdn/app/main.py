from pathlib import Path
import json
import os
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")

STATIC_DIR = Path("../static")
STATIC_DIR.mkdir(parents=True, exist_ok=True)


class Upload(BaseModel):
    filename: str
    data: list[dict] | dict


API_TOKEN = "sample-api-token"

origins = [
    "http://localhost:3000",
    "https://air.anselbrandt.net",
    "https://okapirank.com",
    "https://www.okapirank.com",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
