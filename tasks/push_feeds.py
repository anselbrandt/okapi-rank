import os
from git import Repo
from dotenv import load_dotenv
from pathlib import Path

import httpx

load_dotenv()
TOKEN = os.getenv("GITHUB_TOKEN")
USER = os.getenv("GITHUB_USER")
EMAIL = os.getenv("GITHUB_EMAIL")

VERCEL_DEPLOY_HOOK_URL = os.getenv("VERCEL_DEPLOY_HOOK_URL")


def push_feeds():
    if not TOKEN:
        raise ValueError("GITHUB_TOKEN not found in .env")
    if not USER or not EMAIL:
        raise ValueError("GITHUB_USER or GITHUB_EMAIL not found in .env")
    if not VERCEL_DEPLOY_HOOK_URL:
        raise ValueError("VERCEL_DEPLOY_HOOK_URL not found in .env")

    repo_path = Path(__file__).resolve().parent.parent
    print(f"Repo path: {repo_path}")

    repo = Repo(repo_path)
    assert not repo.bare

    with repo.config_writer() as git_config:
        git_config.set_value("user", "name", USER)
        git_config.set_value("user", "email", EMAIL)

    repo.git.add(A=True)

    if repo.is_dirty(untracked_files=True):
        repo.index.commit("Update static files")
        print("Committed changes.")

        origin = repo.remote(name="origin")
        original_url = origin.url

        authed_url = original_url.replace("https://", f"https://{TOKEN}@")
        print("Pushing to:", authed_url)

        try:
            origin.set_url(authed_url)
            push_result = origin.push()
            print("Push result:", push_result)
        except Exception as e:
            print("Push failed:", e)
        finally:
            origin.set_url(original_url)

    else:
        print("No changes to commit, triggering deploy hook.")
        response = httpx.get(VERCEL_DEPLOY_HOOK_URL)
        print(response.text)


if __name__ == "__main__":
    push_feeds()
