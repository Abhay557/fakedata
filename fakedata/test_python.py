import fakedata

def test():
    print("--- Testing fakedata Python Library ---")
    
    # Data
    user = fakedata.data.user()
    print(f"\n[Data] Random User: {user['fullName']} from {user['address']['city']}")
    
    email = fakedata.data.get_email()
    print(f"[Data] Random Email: {email['email']}")
    
    # Fun
    poke = fakedata.fun.pokemon()
    print(f"\n[Fun] Random Pokemon: {poke['name']} ({poke['Type 1']})")
    
    joke = fakedata.fun.joke()
    print(f"[Fun] Joke: {joke['setup']} -> {joke['punchline']}")
    
    # Anime
    quote = fakedata.anime.quotes_by_show("Naruto")
    print(f"\n[Anime] Naruto Quote: {quote['quote']} - {quote['character']}")
    
    # Animals
    animal = fakedata.animals.random_animal()
    print(f"\n[Animals] Random Animal: {animal['animal']}")

if __name__ == "__main__":
    test()
