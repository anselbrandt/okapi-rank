import os
from git import Repo, GitCommandError
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")
USER = os.getenv("GITHUB_USER")
EMAIL = os.getenv("GITHUB_EMAIL")


def push_feeds():
    if not TOKEN:
        raise ValueError("GITHUB_TOKEN not found in .env")
    if not USER or not EMAIL:
        raise ValueError("GITHUB_USER or GITHUB_EMAIL not found in .env")

    repo_path = Path(__file__).resolve().parent.parent

    repo = Repo(repo_path)
    assert not repo.bare

    with repo.config_writer() as git_config:
        git_config.set_value("user", "name", USER)
        git_config.set_value("user", "email", EMAIL)
        git_config.set_value("pull", "rebase", "false")

    origin = repo.remote(name="origin")
    original_url = origin.url
    authed_url = original_url.replace("https://", f"https://{TOKEN}@")
    origin.set_url(authed_url)

    try:
        repo.git.pull()
    except GitCommandError as e:
        print("Pull failed:", e)
        origin.set_url(original_url)
        return False

    repo.git.add(A=True)

    if repo.is_dirty(untracked_files=True):
        repo.index.commit("Update static files")

        try:
            push_result = origin.push()
            print(push_result)
            return True
        except Exception as e:
            print("Push failed:", e)
            return False
        finally:
            origin.set_url(original_url)
    else:
        print("No changes to commit.")
        origin.set_url(original_url)
        return False
