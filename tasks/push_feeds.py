import os
from git import Repo
from dotenv import load_dotenv
from pathlib import Path


load_dotenv()
TOKEN = os.getenv("GITHUB_TOKEN")
USER = os.getenv("GITHUB_USER")
EMAIL = os.getenv("GITHUB_EMAIL")


def push_feeds():
    if not TOKEN:
        raise ValueError("GITHUB_TOKEN not found in .env")
    print(f"TOKEN: {bool(TOKEN)}, USER: {USER}, EMAIL: {EMAIL}")

    repo_path = Path(__file__).resolve().parent.parent

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
        remote_url = origin.url
        authed_url = remote_url.replace("https://", f"https://{TOKEN}@")
        origin.set_url(authed_url)
        origin.push()
        origin.set_url(remote_url)
        print("Pushed to remote.")
    else:
        print("No changes to commit.")


if __name__ == "__main__":
    push_feeds()
