import random
import string
import math
import datetime
from ..core import load_data

# ─── Data Loading ───────────────────────────────────────────────────────────
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

# New Phase 1 datasets
companies_data = load_data('companies.json')
universities_data = load_data('universities.json')
industries_data = load_data('industries.json')
job_titles_data = load_data('job_titles.json')
salary_ranges_data = load_data('salary_ranges.json')
job_categories_data = load_data('job_categories.json')
countries_data = load_data('countries.json')

# Phase 2 datasets
healthcare_data = load_data('healthcare.json')

# Phase 4 datasets
locales_data = load_data('locales.json')

# ─── Personas for Realistic Distribution ───────────────────────────────────
PERSONAS = [
    {"type": "Executive", "weight": 5, "income_mult": 3.5, "tech_bias": "Apple", "lifestyle": "luxury"},
    {"type": "Tech Professional", "weight": 20, "income_mult": 2.2, "tech_bias": "High-End", "lifestyle": "modern"},
    {"type": "Student", "weight": 15, "income_mult": 0.4, "tech_bias": "Mid-Range", "lifestyle": "frugal"},
    {"type": "Manual Laborer", "weight": 25, "income_mult": 0.9, "tech_bias": "Budget", "lifestyle": "basic"},
    {"type": "Service Worker", "weight": 25, "income_mult": 0.8, "tech_bias": "Budget", "lifestyle": "basic"},
    {"type": "Freelancer", "weight": 10, "income_mult": 1.2, "tech_bias": "Mid-Range", "lifestyle": "flexible"}
]


# ─── Utility Functions ──────────────────────────────────────────────────────
def get_random(arr):
    return random.choice(arr)


def weighted_random(weights):
    """Picks an index based on cumulative weights."""
    total = sum(weights)
    r = random.random() * total
    for i, w in enumerate(weights):
        r -= w
        if r <= 0:
            return i
    return len(weights) - 1


def normal_random(mean, stddev):
    """Generates a normally-distributed random number."""
    return random.gauss(mean, stddev)


def clamp(val, min_val, max_val):
    """Clamps a value between min and max."""
    return max(min_val, min(max_val, val))


# ─── Weighted Age Distribution ──────────────────────────────────────────────
AGE_BRACKETS = [
    {"min": 18, "max": 24, "weight": 18},  # Students, early career
    {"min": 25, "max": 34, "weight": 22},  # Peak workforce entry
    {"min": 35, "max": 44, "weight": 20},  # Mid-career
    {"min": 45, "max": 54, "weight": 17},  # Senior professionals
    {"min": 55, "max": 64, "weight": 13},  # Pre-retirement
    {"min": 65, "max": 80, "weight": 10},  # Retired
]


def generate_age():
    bracket_index = weighted_random([b["weight"] for b in AGE_BRACKETS])
    bracket = AGE_BRACKETS[bracket_index]
    return random.randint(bracket["min"], bracket["max"])


# ─── Education Level Distributions (correlated with age) ────────────────────
EDUCATION_LEVELS = [
    {"level": "High School",   "min_age": 18, "weight": 25, "gpa_range": [2.0, 3.5]},
    {"level": "Associate's",   "min_age": 20, "weight": 10, "gpa_range": [2.0, 3.6]},
    {"level": "Bachelor's",    "min_age": 22, "weight": 35, "gpa_range": [2.5, 4.0]},
    {"level": "Master's",      "min_age": 24, "weight": 18, "gpa_range": [3.0, 4.0]},
    {"level": "PhD",           "min_age": 28, "weight": 5,  "gpa_range": [3.3, 4.0]},
    {"level": "Dropout",       "min_age": 18, "weight": 7,  "gpa_range": [1.5, 2.8]},
]

EDUCATION_FIELDS = [
    "Computer Science", "Business Administration", "Engineering", "Medicine",
    "Economics", "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
    "Marketing", "Finance", "Accounting", "Law", "Architecture",
    "Political Science", "Sociology", "Philosophy", "History", "English Literature",
    "Nursing", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
    "Data Science", "Information Technology", "Graphic Design", "Communications",
    "Environmental Science", "Education"
]


def generate_education(age, persona):
    # Filter education levels by age eligibility
    eligible = [e for e in EDUCATION_LEVELS if age >= e["min_age"]]
    
    # Adjust weights based on persona
    weights = []
    for e in eligible:
        w = e["weight"]
        if persona["type"] == "Executive" and e["level"] in ["Master's", "PhD"]:
            w *= 3
        if persona["type"] == "Manual Laborer" and e["level"] in ["High School", "Dropout"]:
            w *= 2
        if persona["type"] == "Student" and age < 25:
            w *= 2
        weights.append(w)
    
    selected_index = weighted_random(weights)
    selected = eligible[selected_index]

    field = (get_random(EDUCATION_FIELDS)
             if selected["level"] not in ("High School", "Dropout")
             else None)

    gpa = (round(random.uniform(selected["gpa_range"][0], selected["gpa_range"][1]), 2)
           if selected["level"] != "Dropout"
           else None)

    # Pick a real university from dataset
    university = get_random(universities_data)

    # Graduation year correlated with age and education level
    years_to_complete = {
        "High School": 0, "Associate's": 2, "Bachelor's": 4,
        "Master's": 6, "PhD": 10, "Dropout": 1
    }
    import datetime
    current_year = datetime.datetime.now().year
    grad_year = (current_year - (age - 18 - years_to_complete.get(selected["level"], 0))
                 if selected["level"] != "Dropout"
                 else None)

    # Student debt correlated with education level (in USD)
    debt_ranges = {
        "High School": [0, 0], "Associate's": [5000, 25000], "Bachelor's": [15000, 80000],
        "Master's": [30000, 120000], "PhD": [50000, 200000], "Dropout": [2000, 30000]
    }
    debt_range = debt_ranges[selected["level"]]
    student_debt = random.randint(debt_range[0], debt_range[1])

    return {
        "level": selected["level"],
        "field": field,
        "institution": university["name"],
        "institutionCountry": university["country"],
        "gpa": gpa,
        "graduationYear": grad_year,
        "studentDebt": student_debt
    }


# ─── Employment Generation (enhanced with real data) ────────────────────────
EMPLOYMENT_STATUSES = [
    {"status": "employed",     "weight": 55, "min_age": 18, "max_age": 65},
    {"status": "self-employed", "weight": 10, "min_age": 22, "max_age": 70},
    {"status": "unemployed",   "weight": 8,  "min_age": 18, "max_age": 64},
    {"status": "student",      "weight": 12, "min_age": 18, "max_age": 30},
    {"status": "retired",      "weight": 10, "min_age": 55, "max_age": 80},
    {"status": "freelancer",   "weight": 5,  "min_age": 20, "max_age": 60},
]

COMPANY_SIZES = [
    {"size": "startup",    "weight": 15, "employee_range": "1-50"},
    {"size": "small",      "weight": 25, "employee_range": "51-200"},
    {"size": "medium",     "weight": 30, "employee_range": "201-1000"},
    {"size": "enterprise", "weight": 30, "employee_range": "1001+"},
]

WORK_MODES = [
    {"mode": "onsite", "weight": 45},
    {"mode": "hybrid", "weight": 35},
    {"mode": "remote", "weight": 20},
]


def generate_employment(age, education, persona):
    # Filter eligible statuses by age
    eligible = [s for s in EMPLOYMENT_STATUSES if age >= s["min_age"] and age <= s["max_age"]]

    # Boost weights based on persona
    weights = []
    for s in eligible:
        w = s["weight"]
        if persona["type"] == "Executive" and s["status"] == "employed":
            w *= 2
        if persona["type"] == "Freelancer" and s["status"] == "freelancer":
            w *= 5
        if persona["type"] == "Student" and s["status"] == "student":
            w *= 4
        if s["status"] == "retired" and age >= 65:
            w *= 3
        weights.append(w)

    status_index = weighted_random(weights)
    employment_status = eligible[status_index]["status"]

    # Not employed → minimal employment data
    if employment_status in ("unemployed", "student", "retired"):
        return {
            "status": employment_status,
            "company": None,
            "companySize": None,
            "industry": None,
            "jobTitle": None,
            "jobCategory": None,
            "yearsExperience": random.randint(10, 40) if employment_status == "retired" else 0,
            "workMode": None,
            "workHoursPerWeek": 0,
            "jobSatisfaction": None
        }

    # Pick a real company from dataset
    company = get_random(companies_data)
    company_size = COMPANY_SIZES[weighted_random([c["weight"] for c in COMPANY_SIZES])]
    work_mode = WORK_MODES[weighted_random([w["weight"] for w in WORK_MODES])]

    # Pick job title from real dataset
    job_title = get_random(job_titles_data)
    job_category = get_random(job_categories_data)

    # Years of experience
    education_years = {
        "High School": 18, "Associate's": 20, "Bachelor's": 22,
        "Master's": 24, "PhD": 28, "Dropout": 19
    }
    completion_age = education_years.get(education["level"], 22)
    years_experience = max(0, age - completion_age + random.randint(-1, 1))

    # Work hours (normally distributed around 40)
    work_hours = round(clamp(normal_random(42, 8), 20, 70))

    # Job satisfaction (1-10, normally distributed around 6.5)
    satisfaction = round(clamp(normal_random(6.5, 1.8), 1, 10))

    return {
        "status": employment_status,
        "company": company["name"],
        "companySize": company_size["size"],
        "industry": company["industry"],
        "jobTitle": job_title["title"],
        "jobCategory": job_category["name"],
        "yearsExperience": years_experience,
        "workMode": work_mode["mode"],
        "workHoursPerWeek": work_hours,
        "jobSatisfaction": satisfaction
    }


# ─── Financial Profile (correlated with age + education + employment) ───────
TAX_BRACKETS = [
    {"min": 0, "max": 11000, "rate": "10%"},
    {"min": 11001, "max": 44725, "rate": "12%"},
    {"min": 44726, "max": 95375, "rate": "22%"},
    {"min": 95376, "max": 182100, "rate": "24%"},
    {"min": 182101, "max": 231250, "rate": "32%"},
    {"min": 231251, "max": 578125, "rate": "35%"},
    {"min": 578126, "max": float("inf"), "rate": "37%"},
]


def generate_financial(age, education, employment, persona):
    # Base income multipliers by education level
    income_multipliers = {
        "High School": 1.0, "Associate's": 1.3, "Bachelor's": 1.8,
        "Master's": 2.3, "PhD": 2.8, "Dropout": 0.8
    }
    edu_multiplier = income_multipliers.get(education["level"], 1.0)

    # Age factor: income grows with experience (peaks around 50)
    if age < 25:
        age_factor = 0.5
    elif age < 35:
        age_factor = 0.8
    elif age < 50:
        age_factor = 1.0
    elif age < 60:
        age_factor = 0.95
    else:
        age_factor = 0.6

    # Calculate annual income
    if employment["status"] in ("employed", "self-employed", "freelancer"):
        role_keys = list(salary_ranges_data.keys())
        role_key = get_random(role_keys)
        sr = salary_ranges_data[role_key]
        base_salary_inr = normal_random(sr["median"], (sr["p75"] - sr["p25"]) / 2)
        base_salary_usd = round(clamp(base_salary_inr / 80, 15000, 500000))
        
        # Income influenced by Persona and Education
        annual_income = round(base_salary_usd * edu_multiplier * age_factor * persona["income_mult"])
    elif employment["status"] == "retired":
        annual_income = round(random.uniform(20000, 60000))
    else:
        annual_income = round(random.uniform(5000, 20000))

    # Ensure reasonable bounds
    annual_income = int(clamp(annual_income, 0, 800000))

    # Credit score: correlated with age and income
    base_credit = 300 + (age * 3) + (annual_income / 500)
    credit_score = round(clamp(normal_random(base_credit, 50), 300, 850))

    # Savings: correlated with income and age
    if age < 25:
        savings_rate = 0.05
    elif age < 35:
        savings_rate = 0.1
    elif age < 50:
        savings_rate = 0.15
    else:
        savings_rate = 0.2
    savings = round(annual_income * savings_rate * random.uniform(0.5, 3.5) * (age / 30))

    # Monthly expenses
    monthly_income = annual_income / 12
    expense_rate = 0.5 + random.random() * 0.3
    monthly_expenses = round(monthly_income * expense_rate)

    # Debt-to-income ratio
    total_debt = education["studentDebt"] + random.randint(0, int(annual_income * 0.5))
    debt_to_income = round(total_debt / annual_income, 2) if annual_income > 0 else 0

    # Tax bracket
    tax_bracket = TAX_BRACKETS[0]
    for bracket in TAX_BRACKETS:
        if bracket["min"] <= annual_income <= bracket["max"]:
            tax_bracket = bracket
            break

    # Investment style (correlated with age)
    if age < 30:
        investment_styles = ["aggressive", "aggressive", "moderate"]
    elif age < 50:
        investment_styles = ["moderate", "moderate", "aggressive", "conservative"]
    else:
        investment_styles = ["conservative", "conservative", "moderate"]

    # Home ownership (correlated with age and income)
    if age < 28:
        home_options = ["rent", "rent", "rent", "live with family"]
    elif age < 40:
        home_options = ["rent", "mortgage", "mortgage", "own"]
    else:
        home_options = ["own", "own", "mortgage", "rent"]

    return {
        "annualIncome": annual_income,
        "creditScore": credit_score,
        "savings": savings,
        "monthlyExpenses": monthly_expenses,
        "debtToIncome": debt_to_income,
        "taxBracket": tax_bracket["rate"],
        "investmentStyle": get_random(investment_styles),
        "homeOwnership": get_random(home_options)
    }


# ─── Demographics ───────────────────────────────────────────────────────────
NATIONALITIES = [
    "American", "Indian", "British", "Canadian", "Australian",
    "German", "French", "Japanese", "Chinese", "Brazilian",
    "Mexican", "South Korean", "Italian", "Spanish", "Dutch",
    "Swedish", "Swiss", "Norwegian", "Irish", "Russian"
]

LANGUAGES = [
    "English", "Spanish", "Mandarin", "Hindi", "Arabic",
    "Portuguese", "Bengali", "Russian", "Japanese", "French",
    "German", "Korean", "Italian", "Turkish", "Vietnamese"
]

ETHNICITIES = [
    {"label": "White", "weight": 30},
    {"label": "Asian", "weight": 25},
    {"label": "Hispanic", "weight": 18},
    {"label": "Black", "weight": 15},
    {"label": "Mixed", "weight": 8},
    {"label": "Other", "weight": 4},
]


def generate_demographics(age):
    ethnicity_index = weighted_random([e["weight"] for e in ETHNICITIES])
    nationality = get_random(NATIONALITIES)
    primary_language = get_random(LANGUAGES)
    secondary_language = (get_random([l for l in LANGUAGES if l != primary_language])
                          if random.random() > 0.4
                          else None)

    if age < 22:
        relationship_statuses = ["single", "single", "single", "dating"]
    elif age < 35:
        relationship_statuses = ["single", "dating", "married", "married"]
    elif age < 60:
        relationship_statuses = ["married", "married", "married", "divorced", "single"]
    else:
        relationship_statuses = ["married", "widowed", "divorced", "single"]

    return {
        "ethnicity": ETHNICITIES[ethnicity_index]["label"],
        "nationality": nationality,
        "language": {
            "primary": primary_language,
            "secondary": secondary_language
        },
        "relationshipStatus": get_random(relationship_statuses)
    }


# ─── Health Profile (correlated with age, weight, demographics) ─────────────
EXERCISE_FREQUENCIES = [
    {"label": "sedentary",      "weight": 20},
    {"label": "1-2 times/week", "weight": 25},
    {"label": "3-4 times/week", "weight": 30},
    {"label": "5+ times/week",  "weight": 15},
    {"label": "daily",          "weight": 10},
]

SMOKING_STATUSES = [
    {"label": "never",      "weight": 55},
    {"label": "former",     "weight": 20},
    {"label": "current",    "weight": 15},
    {"label": "occasional", "weight": 10},
]

ALCOHOL_STATUSES = [
    {"label": "never",    "weight": 25},
    {"label": "social",   "weight": 35},
    {"label": "moderate", "weight": 25},
    {"label": "heavy",    "weight": 10},
    {"label": "former",   "weight": 5},
]

SLEEP_QUALITY = [
    {"label": "poor", "weight": 15},
    {"label": "fair", "weight": 25},
    {"label": "good", "weight": 35},
    {"label": "excellent", "weight": 25},
]

DIET_TYPES = [
    {"label": "omnivore",      "weight": 50},
    {"label": "vegetarian",    "weight": 15},
    {"label": "vegan",         "weight": 8},
    {"label": "pescatarian",   "weight": 7},
    {"label": "keto",          "weight": 10},
    {"label": "paleo",         "weight": 5},
    {"label": "mediterranean", "weight": 5},
]


def generate_health(age, height_cm, weight_kg):
    # BMI calculation
    height_m = height_cm / 100
    bmi = round(weight_kg / (height_m * height_m), 1)
    if bmi < 18.5:
        bmi_category = "underweight"
    elif bmi < 25:
        bmi_category = "normal"
    elif bmi < 30:
        bmi_category = "overweight"
    else:
        bmi_category = "obese"

    # Exercise (less likely if older or obese)
    exercise_weights = []
    for e in EXERCISE_FREQUENCIES:
        w = e["weight"]
        if age > 60 and e["label"] == "daily":
            w *= 0.4
        if bmi_category == "obese" and e["label"] == "sedentary":
            w *= 2
        exercise_weights.append(w)
    exercise = EXERCISE_FREQUENCIES[weighted_random(exercise_weights)]["label"]

    # Smoking (more likely in certain age ranges)
    smoking_weights = []
    for s in SMOKING_STATUSES:
        w = s["weight"]
        if age > 50 and s["label"] == "former":
            w *= 1.5
        if age < 25 and s["label"] == "current":
            w *= 0.7
        smoking_weights.append(w)
    smoking = SMOKING_STATUSES[weighted_random(smoking_weights)]["label"]

    # Alcohol
    alcohol = ALCOHOL_STATUSES[weighted_random([a["weight"] for a in ALCOHOL_STATUSES])]["label"]

    # Sleep hours (normally distributed, varies by age)
    if age < 25:
        base_sleep = 7.5
    elif age < 45:
        base_sleep = 7.0
    elif age < 65:
        base_sleep = 6.5
    else:
        base_sleep = 7.0
    sleep_hours = round(clamp(normal_random(base_sleep, 1.2), 3.5, 11), 1)
    sleep_quality = SLEEP_QUALITY[weighted_random([s["weight"] for s in SLEEP_QUALITY])]["label"]

    # Diet type
    diet = DIET_TYPES[weighted_random([d["weight"] for d in DIET_TYPES])]["label"]

    # Medical conditions from real healthcare dataset (age-correlated probability)
    has_condition = random.random() < (0.45 if age > 50 else 0.25 if age > 35 else 0.10)
    conditions = [c for c in healthcare_data["conditions"] if c["name"] != "None"]
    condition_weights = []
    for c in conditions:
        w = c["weight"]
        if age > 50:
            w *= c["ageMultiplier"]
        condition_weights.append(w)
    medical_condition = conditions[weighted_random(condition_weights)]["name"] if has_condition else "None"

    # Insurance provider
    if age >= 65:
        insurance_provider = "Medicare" if random.random() > 0.3 else get_random(healthcare_data["insuranceProviders"])
    else:
        insurance_provider = get_random(healthcare_data["insuranceProviders"])

    # Current medications
    num_meds = random.randint(1, 3) if medical_condition != "None" else (1 if random.random() > 0.7 else 0)
    medications = []
    for _ in range(num_meds):
        med = get_random(healthcare_data["medications"])
        if med not in medications:
            medications.append(med)

    # Last checkup (months ago)
    last_checkup_months = random.randint(1, 24)

    # Disability
    has_disability = random.random() < (0.15 if age > 60 else 0.05)

    # Mental health
    mental_health_options = ["good", "good", "good", "fair", "fair", "poor"]
    mental_health = (get_random(["good", "good", "fair", "fair", "poor"])
                     if age < 30
                     else get_random(mental_health_options))

    # Vaccination status
    vaccination_statuses = ["fully vaccinated", "partially vaccinated", "not vaccinated"]
    vaccination_weights = [65, 25, 10]
    vaccination = vaccination_statuses[weighted_random(vaccination_weights)]

    return {
        "bmi": bmi,
        "bmiCategory": bmi_category,
        "bloodPressure": {
            "systolic": round(clamp(normal_random(135 if age > 50 else 120, 15), 85, 200)),
            "diastolic": round(clamp(normal_random(85 if age > 50 else 78, 10), 55, 120))
        },
        "exerciseFrequency": exercise,
        "smoking": smoking,
        "alcohol": alcohol,
        "sleepHoursPerNight": sleep_hours,
        "sleepQuality": sleep_quality,
        "diet": diet,
        "medicalCondition": medical_condition,
        "insuranceProvider": insurance_provider,
        "medications": medications,
        "lastCheckupMonthsAgo": last_checkup_months,
        "hasDisability": has_disability,
        "mentalHealth": mental_health,
        "vaccination": vaccination
    }


# ─── Social & Behavioral Profile ────────────────────────────────────────────
SOCIAL_PLATFORMS = [
    "Instagram", "Twitter/X", "Facebook", "LinkedIn", "TikTok",
    "YouTube", "Reddit", "Snapchat", "Pinterest", "Discord"
]

SHOPPING_CATEGORIES = [
    "electronics", "fashion", "groceries", "books", "home & garden",
    "health & beauty", "sports", "toys & games", "automotive", "pet supplies"
]


def generate_social(age, employment):
    # Social media (younger = more platforms)
    if age < 25:
        num_platforms = random.randint(3, 6)
    elif age < 40:
        num_platforms = random.randint(2, 4)
    elif age < 60:
        num_platforms = random.randint(1, 2)
    else:
        num_platforms = random.randint(0, 1)

    available = list(SOCIAL_PLATFORMS)
    platforms = []
    for _ in range(min(num_platforms, len(available))):
        idx = random.randint(0, len(available) - 1)
        platforms.append(available.pop(idx))

    # Screen time (hours per day, correlated with age)
    if age < 25:
        base_screen = 7.5
    elif age < 40:
        base_screen = 6.0
    elif age < 60:
        base_screen = 4.5
    else:
        base_screen = 3.0
    screen_time = round(clamp(normal_random(base_screen, 2.0), 0.5, 16), 1)

    # Online shopping frequency
    shopping_frequencies = ["never", "rarely", "monthly", "weekly", "daily"]
    if age < 30:
        shop_weights = [5, 10, 30, 40, 15]
    elif age < 50:
        shop_weights = [5, 15, 35, 35, 10]
    else:
        shop_weights = [15, 25, 35, 20, 5]
    shopping_frequency = shopping_frequencies[weighted_random(shop_weights)]

    # Preferred shopping categories
    num_categories = random.randint(1, 3)
    cat_pool = list(SHOPPING_CATEGORIES)
    shop_categories = []
    for _ in range(num_categories):
        idx = random.randint(0, len(cat_pool) - 1)
        shop_categories.append(cat_pool.pop(idx))

    # Monthly online spending
    spend_multiplier = {"never": 0, "rarely": 0.02, "monthly": 0.05, "weekly": 0.1, "daily": 0.2}
    base_spend = 3000 if employment["status"] in ("employed", "self-employed") else 800
    monthly_online_spending = round(base_spend * spend_multiplier.get(shopping_frequency, 0.05) * (0.5 + random.random()))

    # News consumption
    if age < 35:
        news_options = ["social media", "news apps", "podcasts", "newsletters"]
    else:
        news_options = ["TV", "newspapers", "news apps", "radio"]
    primary_news = get_random(news_options)

    # Preferred content type
    content_types = ["video", "text", "audio", "images"]
    if age < 30:
        content_weights = [45, 15, 20, 20]
    elif age < 50:
        content_weights = [30, 30, 20, 20]
    else:
        content_weights = [20, 40, 25, 15]
    preferred_content = content_types[weighted_random(content_weights)]

    # Travel frequency
    travel_options = ["never", "1-2 times/year", "3-5 times/year", "monthly", "weekly"]
    if employment["status"] == "student":
        travel_weights = [20, 40, 30, 8, 2]
    else:
        travel_weights = [10, 30, 30, 20, 10]
    travel_frequency = travel_options[weighted_random(travel_weights)]

    # Volunteering
    volunteers = random.random() < (0.25 if age > 25 else 0.35)

    # Pet ownership
    pet_options = ["none", "dog", "cat", "fish", "bird", "reptile", "hamster", "multiple"]
    pet_weights = [35, 25, 20, 5, 4, 3, 3, 5]
    pet = pet_options[weighted_random(pet_weights)]

    return {
        "socialMedia": {
            "platforms": platforms,
            "screenTimeHoursPerDay": screen_time,
            "preferredContent": preferred_content
        },
        "shopping": {
            "frequency": shopping_frequency,
            "preferredCategories": shop_categories,
            "monthlyOnlineSpending": monthly_online_spending
        },
        "newsSource": primary_news,
        "travelFrequency": travel_frequency,
        "volunteers": volunteers,
        "pet": pet
    }


# ─── Missing Data Utility (for ML training) ─────────────────────────────────
def apply_missing_data(obj, rate, protected_fields=None):
    """Recursively nullifies random fields based on a missing rate."""
    if protected_fields is None:
        protected_fields = ['id', 'fullName', 'firstName', 'lastName', 'age', 'gender', 'email']
    if rate <= 0:
        return obj
    result = dict(obj)
    for key in result:
        if key in protected_fields:
            continue
        if isinstance(result[key], dict):
            result[key] = apply_missing_data(result[key], rate, protected_fields)
        elif random.random() < rate:
            result[key] = None
    return result


# ─── Digital Footprint (Phase 3) ────────────────────────────────────────────
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/{v}.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/{v}.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/{v}.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:{v}.0) Gecko/20100101 Firefox/{v}.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/{v}.0.0.0 Mobile Safari/537.36',
]

BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave']
OS_OPTIONS = ['Windows 11', 'Windows 10', 'macOS Sonoma', 'macOS Ventura', 'Ubuntu 24.04', 'Fedora 40', 'iOS 17', 'Android 14', 'Android 13']
REFERRERS = ['google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'reddit.com', 'direct', 'email', 'youtube.com', 'tiktok.com']


def generate_digital_footprint(age):
    import datetime
    now = datetime.datetime.now(datetime.timezone.utc)

    # Account creation: 1 month to 10 years ago
    max_months_ago = 48 if age < 25 else 84 if age < 40 else 120
    months_ago = random.randint(1, max_months_ago)
    created_at = now - datetime.timedelta(days=months_ago * 30)

    # Last login: 0 to 30 days ago
    days_ago_login = random.randint(0, 30)
    last_login = now - datetime.timedelta(days=days_ago_login)

    # Last password change: 1 to 18 months ago
    months_ago_pwd = random.randint(1, 18)
    last_pwd_change = now - datetime.timedelta(days=months_ago_pwd * 30)

    # Browser version
    browser_version = random.randint(100, 129)
    ua = get_random(USER_AGENTS).replace('{v}', str(browser_version))

    # Session data
    avg_session = round(clamp(normal_random(25 if age < 30 else 15, 8), 1, 120), 1)
    sessions_week = round(clamp(normal_random(12 if age < 30 else 8 if age < 50 else 4, 3), 0, 30))
    total_sessions = round(sessions_week * (months_ago * 4.3))

    two_fa = random.random() < (0.6 if age < 35 else 0.35)

    ui_languages = ['en', 'en', 'en', 'es', 'fr', 'de', 'pt', 'ja', 'zh', 'ko', 'hi', 'ar']

    return {
        "accountCreatedAt": created_at.isoformat(),
        "lastLoginAt": last_login.isoformat(),
        "lastPasswordChangeAt": last_pwd_change.isoformat(),
        "userAgent": ua,
        "browser": get_random(BROWSERS),
        "os": get_random(OS_OPTIONS),
        "referrer": get_random(REFERRERS),
        "avgSessionMinutes": avg_session,
        "sessionsPerWeek": sessions_week,
        "totalSessions": total_sessions,
        "twoFactorEnabled": two_fa,
        "preferredLanguage": get_random(ui_languages),
        "accountStatus": get_random(['active', 'active', 'active', 'active', 'inactive', 'suspended']),
        "verifiedEmail": random.random() < 0.85,
        "verifiedPhone": random.random() < 0.6
    }


# ─── Flatten Utility (Phase 3 - for CSV/DataFrame export) ───────────────────
def flatten_object(obj, prefix=''):
    """Flattens a nested dict into a single-level dict with dot-separated keys."""
    flat = {}
    for key, value in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if value is None:
            flat[full_key] = ''
        elif isinstance(value, list):
            flat[full_key] = ';'.join(str(v) for v in value)
        elif isinstance(value, dict):
            flat.update(flatten_object(value, full_key))
        else:
            flat[full_key] = value
    return flat


# ─── Schema Override Engine (Phase 4) ───────────────────────────────────────
def apply_schema_overrides(user_obj, schema):
    """Applies user-defined schema constraints to a generated user."""
    if not schema or not isinstance(schema, dict):
        return user_obj

    # Age override
    if 'age' in schema:
        age_s = schema['age']
        if 'min' in age_s and user_obj['age'] < age_s['min']:
            user_obj['age'] = age_s['min']
        if 'max' in age_s and user_obj['age'] > age_s['max']:
            user_obj['age'] = age_s['max']
        if 'exact' in age_s:
            user_obj['age'] = age_s['exact']
        import datetime
        cy = datetime.datetime.now().year
        bm = random.randint(1, 12)
        bd = random.randint(1, 28)
        user_obj['birthDate'] = f"{cy - user_obj['age']}-{str(bm).zfill(2)}-{str(bd).zfill(2)}"

    if 'gender' in schema:
        user_obj['gender'] = schema['gender']

    if 'employment' in schema and 'status' in schema['employment']:
        user_obj['employment']['status'] = schema['employment']['status']

    if 'education' in schema and 'level' in schema['education']:
        user_obj['education']['level'] = schema['education']['level']

    if 'financial' in schema:
        if 'annualIncome' in schema['financial']:
            fi = schema['financial']['annualIncome']
            if 'min' in fi and user_obj['financial']['annualIncome'] < fi['min']:
                user_obj['financial']['annualIncome'] = fi['min']
            if 'max' in fi and user_obj['financial']['annualIncome'] > fi['max']:
                user_obj['financial']['annualIncome'] = fi['max']

    if 'health' in schema and 'medicalCondition' in schema['health']:
        user_obj['health']['medicalCondition'] = schema['health']['medicalCondition']

    if 'address' in schema and 'country' in schema['address']:
        user_obj['address']['country'] = schema['address']['country']

    if 'height' in schema:
        if 'min' in schema['height']:
            user_obj['height'] = max(user_obj['height'], schema['height']['min'])
        if 'max' in schema['height']:
            user_obj['height'] = min(user_obj['height'], schema['height']['max'])

    if 'weight' in schema:
        if 'min' in schema['weight']:
            user_obj['weight'] = max(user_obj['weight'], schema['weight']['min'])
        if 'max' in schema['weight']:
            user_obj['weight'] = min(user_obj['weight'], schema['weight']['max'])

    return user_obj


# ─── Locale-Aware Name Selection (Phase 4) ──────────────────────────────────
LOCALE_PHONE_CODES = {
    'en': '+1', 'in': '+91', 'jp': '+81', 'kr': '+82',
    'de': '+49', 'br': '+55', 'ar': '+966', 'fr': '+33'
}

LOCALE_COUNTRIES = {
    'en': {'name': 'United States', 'code': 'US'},
    'in': {'name': 'India', 'code': 'IN'},
    'jp': {'name': 'Japan', 'code': 'JP'},
    'kr': {'name': 'South Korea', 'code': 'KR'},
    'de': {'name': 'Germany', 'code': 'DE'},
    'br': {'name': 'Brazil', 'code': 'BR'},
    'ar': {'name': 'Saudi Arabia', 'code': 'SA'},
    'fr': {'name': 'France', 'code': 'FR'}
}


# ─── Time-Series Activity Generator (Phase 4) ──────────────────────────────
ACTIVITY_TYPES = ['login', 'page_view', 'purchase', 'search', 'click', 'logout', 'api_call', 'upload', 'download', 'comment']
PAGE_NAMES = ['/home', '/profile', '/settings', '/dashboard', '/products', '/cart', '/checkout', '/search', '/help', '/about', '/pricing', '/blog']


def generate_time_series(user_obj, days=30, avg_events_per_day=8):
    """Generates time-series activity data for a user over N days."""
    import datetime
    events = []
    now = datetime.datetime.now(datetime.timezone.utc)
    is_active = user_obj['digitalFootprint']['accountStatus'] == 'active'
    activity_multiplier = 1.0 if is_active else 0.2

    for d in range(days):
        day_date = now - datetime.timedelta(days=(days - d))
        day_of_week = day_date.weekday()  # 0=Mon, 6=Sun
        is_weekend = day_of_week >= 5

        daily_events = max(0, round(
            normal_random(avg_events_per_day * activity_multiplier * (0.6 if is_weekend else 1.0), 3)
        ))

        for _ in range(daily_events):
            hour = int(clamp(normal_random(14, 4), 0, 23))
            minute = random.randint(0, 59)
            second = random.randint(0, 59)

            event_time = day_date.replace(hour=hour, minute=minute, second=second)
            activity_type = get_random(ACTIVITY_TYPES)

            event = {
                'userId': user_obj['id'],
                'timestamp': event_time.isoformat(),
                'type': activity_type,
                'page': get_random(PAGE_NAMES),
                'duration': round(clamp(normal_random(45, 30), 2, 600)) if activity_type == 'page_view' else None,
                'device': get_random(['desktop', 'mobile', 'tablet']),
                'ip': user_obj['ip'],
                'success': random.random() > 0.05,
            }

            if activity_type == 'purchase':
                event['amount'] = round(random.uniform(5, 505), 2)
                event['currency'] = 'USD'
            if activity_type == 'search':
                event['query'] = get_random(['laptop', 'shoes', 'phone case', 'headphones', 'book', 'camera', 'jacket', 'watch', 'keyboard', 'monitor'])

            events.append(event)

    events.sort(key=lambda e: e['timestamp'])
    return events


# ─── Anomaly Injection Engine (Phase 4) ──────────────────────────────────────
def _anomaly_income_spike(u):
    u['financial']['annualIncome'] = round(u['financial']['annualIncome'] * (5 + random.random() * 10))

def _anomaly_age_outlier(u):
    u['age'] = get_random([1, 2, 3, 115, 120, 130])

def _anomaly_credit_fraud(u):
    u['financial']['creditScore'] = get_random([100, 150, 200, 850, 900, 999])
    u['financial']['debtToIncome'] = round(random.random() * 50 + 10, 2)

def _anomaly_geo_impossible(u):
    u['address']['coordinates'] = {'latitude': '0.000000', 'longitude': '0.000000'}
    u['ip'] = '0.0.0.0'

def _anomaly_session(u):
    u['digitalFootprint']['sessionsPerWeek'] = round(random.random() * 500 + 200)
    u['digitalFootprint']['avgSessionMinutes'] = round(random.random() * 1000 + 500, 1)

def _anomaly_velocity_attack(u):
    import datetime
    u['digitalFootprint']['totalSessions'] = round(random.random() * 100000 + 50000)
    u['digitalFootprint']['lastLoginAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()

def _anomaly_data_mismatch(u):
    u['age'] = 12
    u['employment']['status'] = 'employed'
    u['employment']['yearsExperience'] = 30
    u['financial']['annualIncome'] = 500000

def _anomaly_health_outlier(u):
    u['health']['bmi'] = get_random([8, 9, 75, 80])
    u['health']['bloodPressure'] = {'systolic': get_random([40, 300]), 'diastolic': get_random([20, 200])}

ANOMALY_TYPES_PY = [
    {'type': 'income_spike',    'weight': 20, 'apply': _anomaly_income_spike},
    {'type': 'age_outlier',     'weight': 10, 'apply': _anomaly_age_outlier},
    {'type': 'credit_fraud',    'weight': 15, 'apply': _anomaly_credit_fraud},
    {'type': 'geo_impossible',  'weight': 10, 'apply': _anomaly_geo_impossible},
    {'type': 'session_anomaly', 'weight': 15, 'apply': _anomaly_session},
    {'type': 'velocity_attack', 'weight': 10, 'apply': _anomaly_velocity_attack},
    {'type': 'data_mismatch',   'weight': 10, 'apply': _anomaly_data_mismatch},
    {'type': 'health_outlier',  'weight': 10, 'apply': _anomaly_health_outlier},
]


def inject_anomalies(users_arr, rate=0.05):
    """Injects anomalies for fraud/anomaly detection ML training."""
    import copy
    result = []
    for u in users_arr:
        user_copy = copy.deepcopy(u)
        if random.random() < rate:
            idx = weighted_random([a['weight'] for a in ANOMALY_TYPES_PY])
            anomaly = ANOMALY_TYPES_PY[idx]
            anomaly['apply'](user_copy)
            user_copy['_anomaly'] = {'isAnomaly': True, 'type': anomaly['type']}
        else:
            user_copy['_anomaly'] = {'isAnomaly': False, 'type': None}
        result.append(user_copy)
    return result


# ─── Main User Generator ───────────────────────────────────────────────────
def generate_single_user(id_index=None, schema=None, locale=None):
    import datetime

    # Locale-aware name selection
    if locale and locale in locales_data:
        loc = locales_data[locale]
        gender_hint = schema.get('gender') if schema else None
        if not gender_hint:
            gender_hint = get_random(['male', 'female'])
        first_name = get_random(loc['first_female'] if gender_hint == 'female' else loc['first_male'])
        middle_name = get_random(loc['first_male'])
        last_name = get_random(loc['last'])
        phone_code = LOCALE_PHONE_CODES.get(locale, '+1')
    else:
        first_name = get_random(first_names['names'])
        middle_name = get_random(middle_names['father'])
        last_name = get_random(last_names['surnames'])
        phone_code = '+1'
    email_provider = get_random(emails['mails'])
    card_type = get_random(card_data['cards'])
    domain = get_random(domain_data['domains'])
    street = get_random(street_data['addresses'])
    state = get_random(state_data['data'])

    user_id = id_index if id_index is not None else random.randint(1, 100000)

    # Weighted age generation
    age = generate_age()

    # Pick a Persona to drive statistical correlations
    persona = PERSONAS[weighted_random([p["weight"] for p in PERSONAS])]

    # Correlated education
    education = generate_education(age, persona)

    # Correlated employment
    employment = generate_employment(age, education, persona)

    # Correlated financial profile
    financial = generate_financial(age, education, employment, persona)

    # Demographics
    demographics = generate_demographics(age)

    # Height/weight (generated early for health profile)
    height_cm = round(clamp(normal_random(170, 10), 140, 210))
    weight_kg = round(clamp(normal_random(70, 15), 40, 150))

    # Phase 2: Health profile (correlated with age + body metrics)
    health = generate_health(age, height_cm, weight_kg)

    # Phase 2: Social & behavioral profile
    social = generate_social(age, employment)

    # Phase 3: Digital footprint
    digital_footprint = generate_digital_footprint(age)

    # Card info
    card_number = random.randint(10**15, 10**16 - 1)
    card_expiry = f"{random.randint(1, 12)}/{random.randint(25, 35)}"
    card_cvv = random.randint(100, 999)

    # Coordinates
    lat = round(random.uniform(-90, 90), 6)
    lng = round(random.uniform(-180, 180), 6)

    # Network
    ip = ".".join(str(random.randint(0, 255)) for _ in range(4))

    gender_options = ["male", "female", "non-binary"]
    blood_groups = ["+O", "+A", "+B", "+AB", "-O", "-A", "-B", "-AB"]

    # Phone number
    phone_number = "".join(random.choices(string.digits, k=10))

    # Password
    charset = string.ascii_letters + string.digits + "#@$!%&"
    password = "".join(random.choices(charset, k=12))

    # Birth date: calculated from age
    current_year = datetime.datetime.now().year
    birth_year = current_year - age
    birth_month = random.randint(1, 12)
    birth_day = random.randint(1, 28)

    # Hobbies
    user_hobbies = [get_random(hobbies_data)['hobby'], get_random(hobbies_data)['hobby'], get_random(hobbies_data)['hobby']]

    # Technology profile
    critical_features = ["ease of use", "reliability", "security features", "battery life", "camera quality", "performance", "storage", "5G connectivity"]
    primary_uses = ["communication", "education", "organization", "entertainment", "work", "social media", "photography", "gaming"]
    tech_profile = {
        "devices": {
            "additional_devices": [get_random(devices_data)['Device Name'], get_random(devices_data)['Device Name']],
            "smartphone": get_random(devices_data)['Device Name']
        },
        "phone_preferences": {
            "critical_features": random.sample(critical_features, 3),
            "primary_uses": random.sample(primary_uses, 3)
        },
        "interest": user_hobbies
    }

    # Pick a country from the dataset
    country = get_random(countries_data)

    result = {
        "id": str(user_id),
        "fullName": f"{first_name} {middle_name} {last_name}",
        "firstName": first_name,
        "lastName": last_name,
        "middleName": middle_name,
        "age": age,
        "gender": get_random(gender_options),
        "email": f"{first_name.lower()}.{last_name.lower()}@{email_provider}",
        "phone": f"{phone_code} {phone_number}",
        "username": f"{first_name.lower()}_{user_id}",
        "password": password,
        "birthDate": f"{birth_year}-{str(birth_month).zfill(2)}-{str(birth_day).zfill(2)}",
        "bloodGroup": get_random(blood_groups),
        "height": height_cm,
        "weight": weight_kg,
        "domain": f"{first_name.lower()}{last_name.lower()}{domain['tlds'][0]}",
        "ip": ip,
        "macaddress": ":".join(f"{random.randint(0, 255):02X}" for _ in range(6)),
        "address": {
            "street": street['address'],
            "city": state['city'],
            "state": state['state'],
            "country": country["name"],
            "countryCode": country["code"],
            "zipCode": random.randint(10000, 99999),
            "coordinates": {"latitude": str(lat), "longitude": str(lng)}
        },
        "demographics": demographics,
        "education": education,
        "employment": employment,
        "financial": financial,
        "health": health,
        "social": social,
        "digitalFootprint": digital_footprint,
        "bank": {
            "nameOnCard": f"{first_name} {middle_name} {last_name}",
            "cardNumber": str(card_number),
            "cardType": card_type,
            "cardExpiry": card_expiry,
            "cardCvv": str(card_cvv),
        },
        "hobbies": user_hobbies,
        "technology_profile": tech_profile,
        "persona": persona["type"],
        "metadata": {
            "version": "2.1.0",
            "generation_timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }
    }

    # Phase 4: Apply locale country override
    if locale and locale in LOCALE_COUNTRIES:
        result['address']['country'] = LOCALE_COUNTRIES[locale]['name']
        result['address']['countryCode'] = LOCALE_COUNTRIES[locale]['code']

    # Phase 4: Apply schema overrides
    if schema:
        return apply_schema_overrides(result, schema)

    return result


# ─── Public API ─────────────────────────────────────────────────────────────
def user(options=None):
    """Generate a single realistic user profile.
    
    Args:
        options: Optional dict with:
            - missing_rate (float): Probability (0-1) that each field becomes null
            - seed (int): Random seed for reproducibility
            - schema (dict): Schema constraints {age: {min,max}, gender, ...}
            - locale (str): Locale code: 'en','in','jp','kr','de','br','ar','fr'
    """
    if options is None:
        options = {}
    if 'seed' in options and options['seed'] is not None:
        random.seed(options['seed'])
    u = generate_single_user(None, options.get('schema'), options.get('locale'))
    if 'seed' in options and options['seed'] is not None:
        random.seed()
    if options.get('missing_rate', 0) > 0:
        return apply_missing_data(u, options['missing_rate'])
    return u


def users(count=10, options=None):
    """Generate multiple realistic user profiles.
    
    Args:
        count: Number of users to generate
        options: Optional dict with:
            - missing_rate (float): Probability (0-1) that each field becomes null
            - seed (int): Random seed for reproducibility
            - schema (dict): Schema constraints
            - locale (str): Locale code
            - anomaly_rate (float): Fraction of users to inject anomalies into
    """
    if options is None:
        options = {}
    if 'seed' in options and options['seed'] is not None:
        random.seed(options['seed'])
    result = []
    for i in range(count):
        u = generate_single_user(i + 1, options.get('schema'), options.get('locale'))
        if options.get('missing_rate', 0) > 0:
            u = apply_missing_data(u, options['missing_rate'])
        result.append(u)
    if options.get('anomaly_rate', 0) > 0:
        result = inject_anomalies(result, options['anomaly_rate'])
    if 'seed' in options and options['seed'] is not None:
        random.seed()
    return result


def user_time_series(options=None):
    """Generate a user with time-series activity data.
    
    Args:
        options: Same as user() plus:
            - days (int): Number of days of activity (default 30)
            - events_per_day (int): Average events per day (default 8)
    
    Returns:
        dict with 'user' and 'activity' keys
    """
    if options is None:
        options = {}
    u = user(options)
    activity = generate_time_series(u, options.get('days', 30), options.get('events_per_day', 8))
    return {'user': u, 'activity': activity}


def users_to_csv(count=10, options=None):
    """Generate users and export as CSV string.
    
    Nested objects are flattened with dot-separated keys. Arrays are semicolon-joined.
    """
    import io, csv
    data_list = users(count, options)
    flat_rows = [flatten_object(u) for u in data_list]
    headers = list(flat_rows[0].keys())
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=headers, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    for row in flat_rows:
        writer.writerow({k: str(v) if v is not None else '' for k, v in row.items()})
    return output.getvalue()


def users_to_json(count=10, options=None):
    """Generate users and export as a formatted JSON string."""
    import json
    return json.dumps(users(count, options), indent=2)


def users_flat(count=10, options=None):
    """Generate users as flat dicts (for pandas DataFrame conversion).
    
    Usage:
        import pandas as pd
        df = pd.DataFrame(data.users_flat(1000))
    """
    return [flatten_object(u) for u in users(count, options)]


def get_email():
    fn = get_random(first_names['names'])
    ln = get_random(last_names['surnames'])
    domain = get_random(emails['mails'])
    return {"email": f"{fn.lower()}.{ln.lower()}@{domain}"}


def get_username():
    fn = get_random(first_names['names'])
    user_id = random.randint(1, 10000)
    return {"username": f"{fn.lower()}_{user_id}"}


def get_password(length=12):
    charset = string.ascii_letters + string.digits + "#@$!%&"
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
        "countryCode": u['address']['countryCode'],
        "zipCode": u['address']['zipCode'],
        "ip": u['ip'],
        "macaddress": u['macaddress'],
        "coordinates": u['address']['coordinates']
    }


def resume(count=10):
    resumes = []
    for i in range(count):
        u = generate_single_user(i + 1)
        resumes.append({
            "id": u['id'],
            "fullName": u['fullName'],
            "firstName": u['firstName'],
            "lastName": u['lastName'],
            "email": u['email'],
            "phone": u['phone'],
            "age": u['age'],
            "address": u['address'],
            "education": u['education'],
            "employment": u['employment'],
            "skills": random.sample(EDUCATION_FIELDS, k=3)
        })
    return resumes


def biodata(count=10):
    biodatas = []
    personality_types = ["INTJ", "ENFP", "ISTP", "ENTJ", "INFJ", "ESTP", "ISFP", "ENTP",
                         "ISTJ", "ESFJ", "INFP", "ESTJ", "ISFJ", "ENFJ", "INTP", "ESFP"]
    music_genres = ["Rock", "Jazz", "Lofi", "Pop", "Classical", "Hip-Hop",
                    "R&B", "Electronic", "Country", "Metal", "Indie", "Latin"]
    for i in range(count):
        u = generate_single_user(i + 1)
        bio = u.copy()
        bio.update({
            "personalityType": get_random(personality_types),
            "favoriteMusic": get_random(music_genres)
        })
        biodatas.append(bio)
    return biodatas
