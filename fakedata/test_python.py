from fakedata import data
import json

print('=== PHASE 1 TEST: Enhanced data.user() ===\n')

# Test single user
u = data.user()
print('--- Single User Profile ---')
print('Name:', u['fullName'])
print('Age:', u['age'])
print('Gender:', u['gender'])
print('Email:', u['email'])
print('Domain:', u['domain'])
print('Birth Date:', u['birthDate'])
print(f'Height: {u["height"]}cm | Weight: {u["weight"]}kg')
print()
print(f'Address: {u["address"]["city"]}, {u["address"]["state"]}, {u["address"]["country"]} ({u["address"]["countryCode"]})')
print()
print('Demographics:')
print(f'  Ethnicity: {u["demographics"]["ethnicity"]}')
print(f'  Nationality: {u["demographics"]["nationality"]}')
lang2 = u["demographics"]["language"]["secondary"]
print(f'  Language: {u["demographics"]["language"]["primary"]}{" / " + lang2 if lang2 else ""}')
print(f'  Status: {u["demographics"]["relationshipStatus"]}')
print()
print('Education:')
print(f'  Level: {u["education"]["level"]}')
print(f'  Field: {u["education"]["field"]}')
print(f'  Institution: {u["education"]["institution"]} ({u["education"]["institutionCountry"]})')
print(f'  GPA: {u["education"]["gpa"]}')
print(f'  Graduation: {u["education"]["graduationYear"]}')
print(f'  Student Debt: ${u["education"]["studentDebt"]}')
print()
print('Employment:')
print(f'  Status: {u["employment"]["status"]}')
print(f'  Company: {u["employment"]["company"]}')
print(f'  Industry: {u["employment"]["industry"]}')
print(f'  Title: {u["employment"]["jobTitle"]}')
print(f'  Experience: {u["employment"]["yearsExperience"]} years')
print(f'  Satisfaction: {u["employment"]["jobSatisfaction"]}/10')
print()
print('Financial:')
print(f'  Income: ${u["financial"]["annualIncome"]}')
print(f'  Credit Score: {u["financial"]["creditScore"]}')
print(f'  Savings: ${u["financial"]["savings"]}')
print(f'  Tax Bracket: {u["financial"]["taxBracket"]}')
print(f'  Home: {u["financial"]["homeOwnership"]}')

print('\n\n=== Age Distribution Test (100 users) ===')
batch = data.users(100)
buckets = {'18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65+': 0}
for u in batch:
    age = u['age']
    if age <= 24: buckets['18-24'] += 1
    elif age <= 34: buckets['25-34'] += 1
    elif age <= 44: buckets['35-44'] += 1
    elif age <= 54: buckets['45-54'] += 1
    elif age <= 64: buckets['55-64'] += 1
    else: buckets['65+'] += 1

for k, v in buckets.items():
    print(f'  {k}: {v}%')

print('\n=== Education Distribution ===')
edu_buckets = {}
for u in batch:
    lvl = u['education']['level']
    edu_buckets[lvl] = edu_buckets.get(lvl, 0) + 1
for k, v in sorted(edu_buckets.items(), key=lambda x: -x[1]):
    print(f'  {k}: {v}%')

print('\n=== Employment Status ===')
emp_buckets = {}
for u in batch:
    st = u['employment']['status']
    emp_buckets[st] = emp_buckets.get(st, 0) + 1
for k, v in sorted(emp_buckets.items(), key=lambda x: -x[1]):
    print(f'  {k}: {v}%')

print('\n=== Helper Functions ===')
print('Email:', data.get_email()['email'])
print('Username:', data.get_username()['username'])
print('Password:', data.get_password()['password'])
print('City:', data.get_city()['city'])
print('CreditCard:', json.dumps(data.creditcard()))

print('\n=== All tests passed! ===')
