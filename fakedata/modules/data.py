import random
import string
from ..core import load_data

# Load datasets
card_data = load_data('cardtype.json')
occupation_data = load_data('occupation.json')
domain_data = load_data('domain.json')
first_names = load_data('first.json')
middle_names = load_data('middle.json')
last_names = load_data('last.json')
emails = load_data('email.json')
street_data = load_data('street.json')
state_data = load_data('states.json')
state_codes = load_data('shortformstate.json')
hobbies_data = load_data('hobbies.json')
devices_data = load_data('devices.json')

def get_random(arr):
    return random.choice(arr)

def generate_single_user(id_index=None):
    first_name = get_random(first_names['names'])
    middle_name = get_random(middle_names['father'])
    last_name = get_random(last_names['surnames'])
    email_provider = get_random(emails['mails'])
    card_type = get_random(card_data['cards'])
    occupation = get_random(occupation_data['occupations'])
    domain = get_random(domain_data['domains'])
    street = get_random(street_data['addresses'])
    state = get_random(state_data['data'])

    user_id = id_index if id_index is not None else random.randint(1, 1000)
    age = random.randint(18, 38)
    card_number = random.randint(10**15, 10**16 - 1)
    card_expiry = f"{random.randint(1, 12)}/{random.randint(25, 35)}"
    card_cvv = random.randint(100, 999)
    lat = round(random.uniform(-90, 90), 6)
    lng = round(random.uniform(-180, 180), 6)
    ip = ".".join(map(str, (random.randint(0, 255) for _ in range(4))))

    gender_options = ["male", "female", "not provided"]
    blood_groups = ["+O", "+A", "+B", "+AB", "-O", "-A", "-B", "-AB"]
    departments = ["PDT Administration", "PDT Marketing", "Transportation", "Shipping", "Human Resources", "Operations", "Inventory", "Sales", "Finance", "Documentation", "Billing", "Control And Credit"]

    phone_number = "".join(random.choices(string.digits, k=10))
    password = "".join(random.choices(string.ascii_letters + string.digits + "#@$", k=8))

    birth_year = random.randint(1970, 2010)
    birth_month = random.randint(1, 12)
    birth_day = random.randint(1, 28)

    family_status_options = ["single", "married", "married, 1 child", "married, 2 children", "divorced"]
    critical_features_options = ["ease of use", "reliability", "security features", "battery life", "camera quality", "performance"]
    primary_uses_options = ["communication", "education", "organization", "entertainment", "work", "social media"]

    user_hobbies = [get_random(hobbies_data)['hobby'], get_random(hobbies_data)['hobby']]
    tech_profile = {
        "devices": {
            "additional_devices": [get_random(devices_data)['Device Name'], get_random(devices_data)['Device Name']],
            "smartphone": get_random(devices_data)['Device Name']
        },
        "phone_preferences": {
            "critical_features": random.sample(critical_features_options, 3),
            "primary_uses": random.sample(primary_uses_options, 3)
        },
        "interest": user_hobbies
    }

    return {
        "id": str(user_id),
        "fullName": f"{first_name} {middle_name} {last_name}",
        "firstName": first_name,
        "lastName": middle_name,
        "middleName": last_name,
        "age": str(age),
        "gender": get_random(gender_options),
        "email": f"{first_name.lower()}@{email_provider}",
        "phone": f"+1 {phone_number}",
        "username": f"{first_name.lower()}{user_id}",
        "password": password,
        "birthDate": f"{birth_month}/{birth_day}/{birth_year}",
        "bloodGroup": get_random(blood_groups),
        "height": random.randint(100, 200),
        "weight": random.randint(50, 100),
        "domain": f"{first_name.lower()}{last_name.lower()}{domain['tlds']}",
        "ip": ip,
        "macaddress": ":".join(f"{random.randint(0, 255):02X}" for _ in range(6)),
        "address": {
            "street": f"Street {street['address']}",
            "city": state['city'],
            "state": state['state'],
            "country": "United States Of America",
            "zipCode": random.randint(10000, 99999),
            "coordinates": {"latitude": str(lat), "longitude": str(lng)}
        },
        "university": f"{state['city']} University",
        "bank": {
            "nameOnCard": f"{first_name} {middle_name} {last_name}",
            "cardNumber": str(card_number),
            "cardType": card_type,
            "cardExpiry": card_expiry,
            "cardCvv": str(card_cvv),
        },
        "occupation": {
            "title": occupation,
            "salary": f"{random.randint(5000, 50000)}$",
            "department": get_random(departments),
        },
        "family_status": get_random(family_status_options),
        "hobbies": user_hobbies,
        "technology_profile": tech_profile
    }

def user():
    return generate_single_user()

def users(count=10):
    return [generate_single_user(i + 1) for i in range(count)]

def get_email():
    fn = get_random(first_names['names'])
    ln = get_random(last_names['surnames'])
    domain = get_random(emails['mails'])
    return {"email": f"{fn.lower()}.{ln.lower()}@{domain}"}

def get_username():
    fn = get_random(first_names['names'])
    user_id = random.randint(1, 1000)
    return {"username": f"{fn.lower()}{user_id}"}

def get_password(length=8):
    charset = string.ascii_letters + string.digits + "#@$"
    return {"password": "".join(random.choices(charset, k=length))}

def get_zip_code():
    return {"zipCode": random.randint(10000, 99999)}

def get_coordinates():
    return {
        "latitude": str(round(random.uniform(-90, 90), 6)),
        "longitude": str(round(random.uniform(-180, 180), 6))
    }

def get_city():
    return {"city": get_random(state_data['data'])['city']}

def get_state_code():
    return {"stateCode": get_random(state_codes)}

def creditcard():
    u = generate_single_user()
    return {
        "nameOnCard": u['bank']['nameOnCard'],
        "cardNumber": u['bank']['cardNumber'],
        "cardType": u['bank']['cardType'],
        "cardExpiry": u['bank']['cardExpiry'],
        "cardCvv": u['bank']['cardCvv'],
    }

def address():
    u = generate_single_user()
    return {
        "street": u['address']['street'],
        "city": u['address']['city'],
        "state": u['address']['state'],
        "country": u['address']['country'],
        "zipCode": u['address']['zipCode'],
        "ip": u['ip'],
        "macaddress": u['macaddress'],
        "coordinates": u['address']['coordinates']
    }

def resume(count=10):
    resumes = []
    for i in range(count):
        u = generate_single_user(i + 1)
        res = u.copy()
        res.update({
            "education": {
                "level": get_random(["Bachelor's", "Master's", "PhD"]),
                "major": get_random(["Computer Science", "Business", "Marketing"]),
                "university": u['university'],
                "graduationYear": random.randint(2020, 2025)
            },
            "skills": random.sample(["JavaScript", "Node.js", "React", "Python", "Docker"], k=3)
        })
        resumes.append(res)
    return resumes

def biodata(count=10):
    biodatas = []
    for i in range(count):
        u = generate_single_user(i + 1)
        bio = u.copy()
        bio.update({
            "personalityType": get_random(["INTJ", "ENFP", "ISTP"]),
            "favoriteMusic": get_random(["Rock", "Jazz", "Lofi"])
        })
        biodatas.append(bio)
    return biodatas
