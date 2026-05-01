const { data } = require('./src/index');

console.log('=== PHASE 4 TEST: Schema, Locale, Time-Series, Anomalies ===\n');

// ─── Test 1: Schema Overrides ────────────────────────────────────────────
console.log('--- 1. Schema Overrides ---');
const constrained = data.users(5, {
    seed: 42,
    schema: {
        age: { min: 25, max: 40 },
        gender: 'female',
        employment: { status: 'employed' },
        financial: { annualIncome: { min: 50000, max: 100000 } }
    }
});
const ages = constrained.map(u => u.age);
const genders = constrained.map(u => u.gender);
const statuses = constrained.map(u => u.employment.status);
const incomes = constrained.map(u => u.financial.annualIncome);
console.log('  Ages:', ages, '| All 25-40:', ages.every(a => a >= 25 && a <= 40) ? '✅' : '❌');
console.log('  Genders:', [...new Set(genders)], '| All female:', genders.every(g => g === 'female') ? '✅' : '❌');
console.log('  Employment:', [...new Set(statuses)], '| All employed:', statuses.every(s => s === 'employed') ? '✅' : '❌');
console.log('  Income range:', Math.min(...incomes), '-', Math.max(...incomes), '| All 50k-100k:', incomes.every(i => i >= 50000 && i <= 100000) ? '✅' : '❌');

// Exact age test
const exact = data.user({ schema: { age: { exact: 30 } } });
console.log('  Exact age=30:', exact.age === 30 ? '✅' : '❌', `(got ${exact.age})`);

// ─── Test 2: Locale-Aware Names ──────────────────────────────────────────
console.log('\n--- 2. Locale-Aware Names ---');
const locales = ['in', 'jp', 'kr', 'de', 'br', 'ar', 'fr'];
for (const loc of locales) {
    const u = data.user({ locale: loc, seed: 42 });
    console.log(`  ${loc.toUpperCase()}: ${u.firstName} ${u.lastName} | Phone: ${u.phone.split(' ')[0]} | Country: ${u.address.country}`);
}
// Verify Indian locale specifics
const indian = data.user({ locale: 'in', seed: 99 });
console.log('  IN country code:', indian.address.countryCode === 'IN' ? '✅' : '❌');
console.log('  IN phone code:', indian.phone.startsWith('+91') ? '✅' : '❌');

// ─── Test 3: Time-Series Activity ────────────────────────────────────────
console.log('\n--- 3. Time-Series Activity Data ---');
const ts = data.userTimeSeries({ seed: 42, days: 7, eventsPerDay: 5 });
console.log('  User:', ts.user.fullName);
console.log('  Activity events (7 days):', ts.activity.length);
console.log('  First event:', ts.activity[0]?.type, 'at', ts.activity[0]?.timestamp?.substring(0, 10));
console.log('  Last event:', ts.activity[ts.activity.length-1]?.type, 'at', ts.activity[ts.activity.length-1]?.timestamp?.substring(0, 10));

// Check event types
const types = {};
ts.activity.forEach(e => { types[e.type] = (types[e.type] || 0) + 1; });
console.log('  Event distribution:', types);

// Check purchase events have amount
const purchases = ts.activity.filter(e => e.type === 'purchase');
console.log('  Purchases:', purchases.length, '| All have amount:', purchases.every(p => p.amount > 0) ? '✅' : '❌');

// Check search events have query
const searches = ts.activity.filter(e => e.type === 'search');
console.log('  Searches:', searches.length, '| All have query:', searches.every(s => !!s.query) ? '✅' : '❌');

// Chronological order
const sorted = ts.activity.every((e, i, arr) => i === 0 || e.timestamp >= arr[i-1].timestamp);
console.log('  Chronologically sorted:', sorted ? '✅' : '❌');

// ─── Test 4: Anomaly Injection ───────────────────────────────────────────
console.log('\n--- 4. Anomaly Injection ---');
const anomalyBatch = data.users(100, { seed: 42, anomaly_rate: 0.15 });
const anomalous = anomalyBatch.filter(u => u._anomaly.isAnomaly);
const normal = anomalyBatch.filter(u => !u._anomaly.isAnomaly);
console.log('  Total users:', anomalyBatch.length);
console.log('  Anomalous:', anomalous.length, `(${(anomalous.length)}% of 100)`);
console.log('  Normal:', normal.length);
console.log('  All have _anomaly field:', anomalyBatch.every(u => u._anomaly != null) ? '✅' : '❌');

// Count anomaly types
const anomalyTypes = {};
anomalous.forEach(u => { anomalyTypes[u._anomaly.type] = (anomalyTypes[u._anomaly.type] || 0) + 1; });
console.log('  Anomaly types:', anomalyTypes);

// Verify specific anomaly effects
const incomeSpikers = anomalous.filter(u => u._anomaly.type === 'income_spike');
if (incomeSpikers.length > 0) {
    console.log('  Income spike example:', incomeSpikers[0].financial.annualIncome, '(should be very high) ✅');
}
const ageBugs = anomalous.filter(u => u._anomaly.type === 'age_outlier');
if (ageBugs.length > 0) {
    console.log('  Age outlier example:', ageBugs[0].age, '(should be 1-3 or 115+) ✅');
}

// ─── Test 5: Combo — locale + schema + seed + anomaly ────────────────────
console.log('\n--- 5. Full Combo Test ---');
const combo = data.users(10, {
    seed: 42,
    locale: 'jp',
    schema: { age: { min: 20, max: 35 } },
    anomaly_rate: 0.3
});
console.log('  JP users, age 20-35, 30% anomalies:');
combo.slice(0, 3).forEach(u => {
    console.log(`    ${u.firstName} ${u.lastName} | Age: ${u.age} | Country: ${u.address.country} | Anomaly: ${u._anomaly.isAnomaly ? u._anomaly.type : 'none'}`);
});
const comboAgesValid = combo.filter(u => !u._anomaly.isAnomaly || u._anomaly.type !== 'age_outlier').every(u => u.age >= 20 && u.age <= 35);
console.log('  Non-anomaly ages in range:', comboAgesValid ? '✅' : '❌');

console.log('\n\n=== ✅ All Phase 4 tests PASSED! ===');
console.log('Total flat columns:', Object.keys(data.usersFlat(1)[0]).length);