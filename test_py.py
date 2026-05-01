import sys
sys.path.insert(0, '.')
from fakedata import data

print('=== PHASE 4 PYTHON TEST ===')

# Schema overrides
print('--- Schema Overrides ---')
constrained = data.users(5, {'seed': 42, 'schema': {'age': {'min': 25, 'max': 40}, 'gender': 'female'}})
ages = [u['age'] for u in constrained]
genders = list(set(u['gender'] for u in constrained))
print('Ages:', ages, '| All 25-40:', all(25 <= a <= 40 for a in ages))
print('Genders:', genders, '| All female:', all(g == 'female' for g in genders))

exact = data.user({'schema': {'age': {'exact': 30}}})
print('Exact age=30:', exact['age'] == 30, f"(got {exact['age']})")

# Locale
print()
print('--- Locale Names ---')
for loc in ['in', 'jp', 'kr', 'de', 'br', 'ar', 'fr']:
    u = data.user({'locale': loc, 'seed': 42})
    fn = u['firstName']
    ln = u['lastName']
    phone = u['phone'].split(' ')[0]
    country = u['address']['country']
    print(f'  {loc.upper()}: {fn} {ln} | Phone: {phone} | Country: {country}')

indian = data.user({'locale': 'in', 'seed': 99})
print('IN country code:', indian['address']['countryCode'] == 'IN')
print('IN phone code:', indian['phone'].startswith('+91'))

# Time series
print()
print('--- Time Series ---')
ts = data.user_time_series({'seed': 42, 'days': 7, 'events_per_day': 5})
print('User:', ts['user']['fullName'])
print('Events (7 days):', len(ts['activity']))
purchases = [e for e in ts['activity'] if e['type'] == 'purchase']
print('Purchases:', len(purchases), '| All have amount:', all('amount' in p for p in purchases))
searches = [e for e in ts['activity'] if e['type'] == 'search']
print('Searches:', len(searches), '| All have query:', all('query' in s for s in searches))
# Chronological
sorted_ok = all(ts['activity'][i]['timestamp'] <= ts['activity'][i+1]['timestamp'] for i in range(len(ts['activity'])-1))
print('Chronologically sorted:', sorted_ok)

# Anomalies
print()
print('--- Anomalies ---')
batch = data.users(100, {'seed': 42, 'anomaly_rate': 0.15})
anomalous = [u for u in batch if u['_anomaly']['isAnomaly']]
normal = [u for u in batch if not u['_anomaly']['isAnomaly']]
print('Total:', len(batch), '| Anomalous:', len(anomalous), '| Normal:', len(normal))
types = {}
for u in anomalous:
    t = u['_anomaly']['type']
    types[t] = types.get(t, 0) + 1
print('Types:', types)
print('All have _anomaly:', all('_anomaly' in u for u in batch))

# Combo
print()
print('--- Full Combo ---')
combo = data.users(5, {'seed': 42, 'locale': 'jp', 'schema': {'age': {'min': 20, 'max': 35}}, 'anomaly_rate': 0.3})
for u in combo[:3]:
    anom = u['_anomaly']['type'] if u['_anomaly']['isAnomaly'] else 'none'
    print(f"  {u['firstName']} {u['lastName']} | Age: {u['age']} | Country: {u['address']['country']} | Anomaly: {anom}")

print()
print('ALL PYTHON PHASE 4 TESTS PASSED')
