import random
from ..core import load_data

# Load datasets
animal_data = load_data('animal.json')
cat_fact_data = load_data('catfact.json')
dog_fact_data = load_data('dogfact.json')

def get_random(arr):
    return random.choice(arr)

def random_animal():
    return {"animal": get_random(animal_data['animals'])}

def cat_fact():
    return {"fact": get_random(cat_fact_data['facts'])}

def dog_fact():
    return {"fact": get_random(dog_fact_data['facts'])}
