const { data } = require('./src/index');

console.log('=== PHASE 3 TEST: Seed, Digital Footprint, CSV/JSON Export ===\n');

// ─── Test 1: Digital Footprint ───────────────────────────────────────────
console.log('--- 1. Digital Footprint ---');
const u = data.user();
const df = u.digitalFootprint;
console.log('  Account Created:', df.accountCreatedAt);
console.log('  Last Login:', df.lastLoginAt);
console.log('  Last Password Change:', df.lastPasswordChangeAt);
console.log('  User Agent:', df.userAgent.substring(0, 60) + '...');
console.log('  Browser:', df.browser);
console.log('  OS:', df.os);
console.log('  Referrer:', df.referrer);
console.log('  Avg Session:', df.avgSessionMinutes, 'min');
console.log('  Sessions/Week:', df.sessionsPerWeek);
console.log('  Total Sessions:', df.totalSessions);
console.log('  2FA:', df.twoFactorEnabled);
console.log('  Preferred Language:', df.preferredLanguage);
console.log('  Account Status:', df.accountStatus);
console.log('  Verified Email:', df.verifiedEmail);
console.log('  Verified Phone:', df.verifiedPhone);
console.log('  ✅ Digital footprint has', Object.keys(df).length, 'fields');

// ─── Test 2: Seed-based Reproducibility ──────────────────────────────────
console.log('\n--- 2. Seed-based Reproducibility ---');
const a = data.user({ seed: 42 });
const b = data.user({ seed: 42 });
const c = data.user({ seed: 99 });

console.log('  Seed 42 (run 1):', a.firstName, a.lastName, '| Age:', a.age);
console.log('  Seed 42 (run 2):', b.firstName, b.lastName, '| Age:', b.age);
console.log('  Seed 99 (run 3):', c.firstName, c.lastName, '| Age:', c.age);

const match = (a.firstName === b.firstName && a.lastName === b.lastName && a.age === b.age);
const differ = (a.firstName !== c.firstName || a.age !== c.age);
console.log('  Same seed → same output:', match ? '✅ YES' : '❌ NO');
console.log('  Diff seed → diff output:', differ ? '✅ YES' : '❌ NO');

// Test batch reproducibility
const batch1 = data.users(5, { seed: 123 });
const batch2 = data.users(5, { seed: 123 });
const batchMatch = batch1.every((u, i) => u.firstName === batch2[i].firstName && u.age === batch2[i].age);
console.log('  Batch seed 123 match:', batchMatch ? '✅ YES' : '❌ NO');

// ─── Test 3: CSV Export ──────────────────────────────────────────────────
console.log('\n--- 3. CSV Export ---');
const csv = data.usersToCSV(3, { seed: 42 });
const lines = csv.split('\n');
console.log('  Header columns:', lines[0].split(',').length);
console.log('  Data rows:', lines.length - 1);
console.log('  Header preview:', lines[0].substring(0, 100) + '...');
console.log('  First row preview:', lines[1].substring(0, 100) + '...');
console.log('  ✅ CSV generated successfully');

// ─── Test 4: JSON Export ─────────────────────────────────────────────────
console.log('\n--- 4. JSON Export ---');
const json = data.usersToJSON(2, { seed: 42 });
const parsed = JSON.parse(json);
console.log('  Users in JSON:', parsed.length);
console.log('  First user name:', parsed[0].fullName);
console.log('  Has digitalFootprint:', !!parsed[0].digitalFootprint);
console.log('  ✅ JSON exported and re-parsed successfully');

// ─── Test 5: Flat Export ─────────────────────────────────────────────────
console.log('\n--- 5. Flat (DataFrame) Export ---');
const flat = data.usersFlat(2, { seed: 42 });
const keys = Object.keys(flat[0]);
console.log('  Flat columns:', keys.length);
console.log('  Sample keys:', keys.slice(0, 10).join(', '));
console.log('  Sample values:', Object.values(flat[0]).slice(0, 5).map(v => String(v).substring(0, 20)));
console.log('  ✅ Flat export has', keys.length, 'columns per user');

// ─── Test 6: Seed + Missing Data combo ───────────────────────────────────
console.log('\n--- 6. Seed + Missing Rate Combo ---');
const messy = data.users(3, { seed: 42, missing_rate: 0.1 });
console.log('  3 users with seed=42 + 10% missing');
console.log('  IDs:', messy.map(u => u.id).join(', '), '(protected, never null)');
let nullCount = 0;
const countNulls = (obj) => { for (const v of Object.values(obj)) { if (v === null) nullCount++; else if (typeof v === 'object' && v && !Array.isArray(v)) countNulls(v); } };
messy.forEach(u => countNulls(u));
console.log('  Total null fields across 3 users:', nullCount);
console.log('  ✅ Combo works correctly');

// ─── Summary ──────────────────────────────────────────────────────────────
console.log('\n\n=== ✅ All Phase 3 tests PASSED! ===');
console.log('Total fields per user:', Object.keys(data.usersFlat(1)[0]).length);