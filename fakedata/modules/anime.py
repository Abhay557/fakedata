import random
from ..core import load_data

# Load datasets
quote_data = load_data('animequote.json')
fact_data = load_data('animefact.json')

def get_random(arr):
    return random.choice(arr)

def quote():
    item = get_random(quote_data['quotes'])
    return {
        "anime": item['anime'],
        "quote": item['bruh'],
        "character": item['character'],
        "id": item.get('id')
    }

def quotes_by_show(anime_name):
    filtered = [q for q in quote_data['quotes'] if anime_name.lower() in q['anime'].lower()]
    if not filtered:
        return {"error": "No quotes found for this anime"}
    item = get_random(filtered)
    return {
        "anime": item['anime'],
        "quote": item['bruh'],
        "character": item['character'],
        "id": item.get('id')
    }

def fact():
    item = get_random(fact_data['facts'])
    return {
        "question": item['question'],
        "answers": item['answers']
    }
