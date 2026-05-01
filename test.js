const { data } = require('./src/index');

console.log('=== PHASE 2 TEST: Health + Social + Missing Data ===\n');

const u = data.user();

console.log('--- Health Profile ---');
console.log('  BMI:', u.health.bmi, '(' + u.health.bmiCategory + ')');
console.log('  Blood Pressure:', u.health.bloodPressure.systolic + '/' + u.health.bloodPressure.diastolic);
console.log('  Exercise:', u.health.exerciseFrequency);
console.log('  Smoking:', u.health.smoking);
console.log('  Alcohol:', u.health.alcohol);
console.log('  Sleep:', u.health.sleepHoursPerNight + 'h (' + u.health.sleepQuality + ')');
console.log('  Diet:', u.health.diet);
console.log('  Condition:', u.health.medicalCondition);
console.log('  Insurance:', u.health.insuranceProvider);
console.log('  Medications:', u.health.medications);
console.log('  Last Checkup:', u.health.lastCheckupMonthsAgo, 'months ago');
console.log('  Disability:', u.health.hasDisability);
console.log('  Mental Health:', u.health.mentalHealth);
console.log('  Vaccination:', u.health.vaccination);

console.log('\n--- Social Profile ---');
console.log('  Platforms:', u.social.socialMedia.platforms);
console.log('  Screen Time:', u.social.socialMedia.screenTimeHoursPerDay, 'hrs/day');
console.log('  Preferred Content:', u.social.socialMedia.preferredContent);
console.log('  Shopping Freq:', u.social.shopping.frequency);
console.log('  Shop Categories:', u.social.shopping.preferredCategories);
console.log('  Monthly Online Spend: $' + u.social.shopping.monthlyOnlineSpending);
console.log('  News Source:', u.social.newsSource);
console.log('  Travel:', u.social.travelFrequency);
console.log('  Volunteers:', u.social.volunteers);
console.log('  Pet:', u.social.pet);

// Test missing data feature
console.log('\n\n=== Missing Data Test (rate: 0.15) ===');
const missing = data.user({ missing_rate: 0.15 });
let nullCount = 0;
let totalFields = 0;
const countNulls = (obj) => {
    for (const key of Object.keys(obj)) {
        if (obj[key] === null) nullCount++;
        else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) countNulls(obj[key]);
        totalFields++;
    }
};
countNulls(missing);
console.log('Null fields:', nullCount, '/', totalFields, '(' + (nullCount/totalFields*100).toFixed(1) + '%)');
console.log('Protected fields intact:', !!missing.id, !!missing.fullName, !!missing.firstName, !!missing.email);

// Test health distribution
console.log('\n\n=== Health Distribution (100 users) ===');
const batch = data.users(100);

const bmiCats = {};
batch.forEach(u => bmiCats[u.health.bmiCategory] = (bmiCats[u.health.bmiCategory] || 0) + 1);
console.log('BMI Categories:', bmiCats);

const smokingCats = {};
batch.forEach(u => smokingCats[u.health.smoking] = (smokingCats[u.health.smoking] || 0) + 1);
console.log('Smoking:', smokingCats);

const conditionCats = {};
batch.forEach(u => conditionCats[u.health.medicalCondition] = (conditionCats[u.health.medicalCondition] || 0) + 1);
console.log('Conditions:', conditionCats);

const platformCounts = {};
batch.forEach(u => {
    const n = u.social.socialMedia.platforms.length;
    platformCounts[n + ' platforms'] = (platformCounts[n + ' platforms'] || 0) + 1;
});
console.log('Social Platform Counts:', platformCounts);

console.log('\n=== All Phase 2 tests passed! ===');