from dotenv import load_dotenv


from tasks import (
    push_feeds,
)

load_dotenv()

push_feeds()
