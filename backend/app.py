from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartGrow AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORY_TEMPLATES = {
    "Kindness": {
        "title": "The Kindness Lantern",
        "body": "In a quiet forest, a little {hero} named Maya found a glowing lantern under a fern. It was not a magical lantern at all, but it made every small act of kindness look brighter. When Maya shared the warm light with her friends, they found the courage to help others too.",
        "moral": "Kindness grows brighter when it is shared with others.",
        "quiz": [
            "The lantern made kindness brighter.",
            "The forest became noisy.",
            "Maya hid the lantern."
        ],
        "emoji": "🕯️"
    },
    "Adventure": {
        "title": "The Lost Path in the Meadow",
        "body": "One windy morning, {hero} followed a tiny trail through the meadow and discovered a stone arch covered with moss. Behind it was a hidden path leading to a bright pond and a family of ducks. Every step taught {hero} to look carefully, listen to nature, and keep moving forward.",
        "moral": "Curiosity and bravery help us uncover new adventures.",
        "quiz": [
            "The path led to a hidden pond.",
            "The meadow was empty.",
            "{hero} gave up immediately."
        ],
        "emoji": "🌿"
    },
    "Animals": {
        "title": "The Friendly Forest Parade",
        "body": "As the rain ended, the forest woke up in a joyful parade. A fox, a squirrel, and a little {hero} marched through the grass and sang a song for every animal they met. Each friend had a different sound, and together they made a perfect rhythm for the morning.",
        "moral": "Every friend brings a special gift to the group.",
        "quiz": [
            "The animals made a joyful parade together.",
            "The forest stayed silent.",
            "The squirrel left the forest."
        ],
        "emoji": "🦊"
    },
    "Nature": {
        "title": "The Singing Willow Tree",
        "body": "By the riverbank, a gentle willow tree whispered in the breeze. It told {hero} about seeds, rain, and the way every leaf grows a little stronger with sunlight. When {hero} listened carefully, the whole garden seemed to sing a soft welcome song.",
        "moral": "Nature teaches us patience, wonder, and care.",
        "quiz": [
            "The willow shared lessons about nature.",
            "The riverbank was empty.",
            "{hero} ignored the tree."
        ],
        "emoji": "🌳"
    },
    "Courage": {
        "title": "The Brave Little Kite",
        "body": "When the sky turned dark, a tiny kite almost gave up before it rose above the trees. {hero} held the string tight and whispered, 'I can try again.' Soon the kite danced high in the wind, bright and fearless, as everyone in the park cheered.",
        "moral": "Bravery grows when we try again, even when we feel nervous.",
        "quiz": [
            "The kite rose high after trying again.",
            "The kite stayed on the ground forever.",
            "{hero} was afraid to hold the string."
        ],
        "emoji": "🪁"
    },
    "Learning": {
        "title": "The Curious Star Map",
        "body": "On a moonlit evening, {hero} found a dusty map covered in shining stars. It showed how to measure the sky, count constellations, and notice the small shapes hidden above the houses. The journey taught {hero} that learning is like a treasure hunt with endless discoveries.",
        "moral": "Learning helps us discover the world in new and exciting ways.",
        "quiz": [
            "The star map led to a lesson about learning.",
            "The map was lost forever.",
            "{hero} ignored the stars."
        ],
        "emoji": "⭐"
    }
}

POEM_TEMPLATES = {
    "Kindness": {
        "title": "Little Hands, Big Hearts",
        "body": "Share a smile, share a toy,\nHelp a friend and bring joy.\nA warm hello, a gentle day,\nMakes the world bright in every way.",
        "moral": "Small acts of kindness can make the world feel happier.",
        "emoji": "🌼"
    },
    "Adventure": {
        "title": "Hop to the Rainbow Trail",
        "body": "Skip along the rainbow trail,\nPast the clouds and morning dew.\nFind a pebble, find a rhyme,\nAnd bright new songs for you.",
        "moral": "Adventure begins with curiosity and a brave step forward.",
        "emoji": "🌈"
    },
    "Animals": {
        "title": "The Forest Song",
        "body": "The squirrel taps, the owl says hi,\nThe duckling wiggles by the sky.\nThe deer steps softly, slow and sweet,\nAnd every animal dances in the street.",
        "moral": "Friends with different voices can still make beautiful music together.",
        "emoji": "🐾"
    },
    "Nature": {
        "title": "Rainy-Day Rhymes",
        "body": "Rain on leaves, rain on grass,\nRain on flowers in a glass.\nPitter-patter, soft and slow,\nGrowing gardens begin to glow.",
        "moral": "Nature has a rhythm that helps everything grow.",
        "emoji": "🌧️"
    },
    "Courage": {
        "title": "Try Again, Little One",
        "body": "If the day feels hard to climb,\nTake a breath and try one more time.\nA brave heart learns to soar,\nAnd grow strong at every door.",
        "moral": "Confidence grows each time we keep trying.",
        "emoji": "🦅"
    },
    "Learning": {
        "title": "Count the Sunshine",
        "body": "One bright star, two shining rays,\nThree happy giggles, four kind ways.\nFive little steps to learn and play,\nSix wonders brighten the day.",
        "moral": "Learning and play are both ways to discover joy.",
        "emoji": "☀️"
    }
}


def build_story_payload(category: str, age: str, language: str, hero: str, content_type: str):
    collection = STORY_TEMPLATES if content_type == "story" else POEM_TEMPLATES
    template = collection.get(category, collection["Kindness"])

    safe_hero = hero.strip() or "Rabbit"
    safe_category = category or "Kindness"
    body = template["body"].replace("{hero}", safe_hero)

    if content_type == "poem":
        moral = template["moral"]
        return {
            "type": "poem",
            "category": safe_category,
            "title": template["title"],
            "body": body,
            "moral": moral,
            "quiz": [
                moral,
                "Poems are only for adults.",
                "Rhymes make learning playful."
            ],
            "emoji": template["emoji"],
            "age": age,
            "language": language,
        }

    return {
        "type": "story",
        "category": safe_category,
        "title": template["title"],
        "body": body,
        "moral": template["moral"],
        "quiz": [
            template["quiz"][0],
            template["quiz"][1],
            template["quiz"][2],
        ],
        "emoji": template["emoji"],
        "age": age,
        "language": language,
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SmartGrow AI API"}


@app.get("/api/content")
def get_content(
    content_type: str = Query(default="story", alias="type"),
    category: str = "Kindness",
    age: str = "5-6",
    language: str = "English",
    hero: str = "Rabbit",
):
    payload = build_story_payload(category, age, language, hero, content_type)
    return payload


@app.post("/api/content")
def create_content(payload: dict):
    content_type = payload.get("type", "story")
    category = payload.get("category", "Kindness")
    age = payload.get("age", "5-6")
    language = payload.get("language", "English")
    hero = payload.get("hero", "Rabbit")
    return build_story_payload(category, age, language, hero, content_type)
