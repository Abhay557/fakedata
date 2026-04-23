import random
from ..core import load_data

# Load datasets
joke_data = load_data('joke.json')
fact_data = load_data('fact.json')
fortune_data = load_data('fortune.json')
pickup_data = load_data('pickup.json')
quote_data = load_data('quote.json')
pokemon_data = load_data('pokemon.json')

def get_random(arr):
    return random.choice(arr)

def joke():
    item = get_random(joke_data['jokes'])
    return {
        "id": item['id'],
        "type": item['type'],
        "setup": item['setup'],
        "punchline": item['punchline']
    }

def jokes_by_type(joke_type):
    filtered = [j for j in joke_data['jokes'] if j['type'].lower() == joke_type.lower()]
    if not filtered:
        return {"error": "No jokes found for this type"}
    item = get_random(filtered)
    return {
        "id": item['id'],
        "type": item['type'],
        "setup": item['setup'],
        "punchline": item['punchline']
    }

def fact():
    return {"fact": get_random(fact_data['facts'])}

def fortune():
    return {"fortune": get_random(fortune_data['fortunes'])}

def pickup():
    return {"pickup": get_random(pickup_data['pickups'])}

def quote():
    item = get_random(quote_data['quotes'])
    return {
        "quote": item['quote'],
        "author": item['author']
    }

def pokemon():
    return get_random(pokemon_data)

def pokemon_by_type(poke_type):
    filtered = [p for p in pokemon_data if 
                p['Type 1'].lower() == poke_type.lower() or 
                (p.get('Type 2') and p['Type 2'].lower() == poke_type.lower())]
    if not filtered:
        return {"error": "No pokemon found for this type"}
    return get_random(filtered)
