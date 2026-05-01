const path = require('path');

// ─── Data Loading ───────────────────────────────────────────────────────────
const loadData = (file) => require(path.join(__dirname, '../../helpers', file));

const cardData = loadData('cardtype.json');
const occupationData = loadData('occupation.json');
const domainData = loadData('domain.json');
const firstNames = loadData('first.json');
const middleNames = loadData('middle.json');
const lastNames = loadData('last.json');
const emails = loadData('email.json');
const streetData = loadData('street.json');
const stateData = loadData('states.json');
const hobbiesData = loadData('hobbies.json');
const devicesData = loadData('devices.json');

// New Phase 1 datasets
const companiesData = loadData('companies.json');
const universitiesData = loadData('universities.json');
const industriesData = loadData('industries.json');
const jobTitlesData = loadData('job_titles.json');
const salaryRangesData = loadData('salary_ranges.json');
const jobCategoriesData = loadData('job_categories.json');
const countriesData = loadData('countries.json');

// Phase 2 datasets
const healthcareData = loadData('healthcare.json');

// ─── Utility Functions ──────────────────────────────────────────────────────
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Weighted random selection: picks an index based on cumulative weights.
 * @param {number[]} weights - Array of weights (must sum > 0)
 * @returns {number} The selected index
 */
const weightedRandom = (weights) => {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        r -= weights[i];
        if (r <= 0) return i;
    }
    return weights.length - 1;
};

/**
 * Generates a normally-distributed random number (Box-Muller transform).
 * @param {number} mean
 * @param {number} stddev
 * @returns {number}
 */
const normalRandom = (mean, stddev) => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stddev;
};

/**
 * Clamps a value between min and max.
 */
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// ─── Weighted Age Distribution ──────────────────────────────────────────────
// Real-world-inspired age distribution for 18-80 range
const AGE_BRACKETS = [
    { min: 18, max: 24, weight: 18 },  // Students, early career
    { min: 25, max: 34, weight: 22 },  // Peak workforce entry
    { min: 35, max: 44, weight: 20 },  // Mid-career
    { min: 45, max: 54, weight: 17 },  // Senior professionals
    { min: 55, max: 64, weight: 13 },  // Pre-retirement
    { min: 65, max: 80, weight: 10 },  // Retired
];

const generateAge = () => {
    const bracketIndex = weightedRandom(AGE_BRACKETS.map(b => b.weight));
    const bracket = AGE_BRACKETS[bracketIndex];
    return Math.floor(Math.random() * (bracket.max - bracket.min + 1)) + bracket.min;
};

// ─── Education Level Distributions (correlated with age) ────────────────────
const EDUCATION_LEVELS = [
    { level: "High School",   field: null, minAge: 18, weight: 25, gpaRange: [2.0, 3.5] },
    { level: "Associate's",   field: null, minAge: 20, weight: 10, gpaRange: [2.0, 3.6] },
    { level: "Bachelor's",    field: null, minAge: 22, weight: 35, gpaRange: [2.5, 4.0] },
    { level: "Master's",      field: null, minAge: 24, weight: 18, gpaRange: [3.0, 4.0] },
    { level: "PhD",           field: null, minAge: 28, weight: 5,  gpaRange: [3.3, 4.0] },
    { level: "Dropout",       field: null, minAge: 18, weight: 7,  gpaRange: [1.5, 2.8] },
];

const EDUCATION_FIELDS = [
    "Computer Science", "Business Administration", "Engineering", "Medicine",
    "Economics", "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
    "Marketing", "Finance", "Accounting", "Law", "Architecture",
    "Political Science", "Sociology", "Philosophy", "History", "English Literature",
    "Nursing", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
    "Data Science", "Information Technology", "Graphic Design", "Communications",
    "Environmental Science", "Education"
];

const generateEducation = (age) => {
    // Filter education levels by age eligibility
    const eligible = EDUCATION_LEVELS.filter(e => age >= e.minAge);
    const weights = eligible.map(e => e.weight);
    const selectedIndex = weightedRandom(weights);
    const selected = eligible[selectedIndex];

    const field = selected.level !== "High School" && selected.level !== "Dropout"
        ? getRandom(EDUCATION_FIELDS)
        : null;

    const gpa = selected.level !== "Dropout"
        ? parseFloat((Math.random() * (selected.gpaRange[1] - selected.gpaRange[0]) + selected.gpaRange[0]).toFixed(2))
        : null;

    // Pick a real university from dataset
    const university = getRandom(universitiesData);

    // Graduation year correlated with age and education level
    const yearsToComplete = {
        "High School": 0, "Associate's": 2, "Bachelor's": 4,
        "Master's": 6, "PhD": 10, "Dropout": 1
    };
    const gradYear = selected.level !== "Dropout"
        ? new Date().getFullYear() - (age - 18 - (yearsToComplete[selected.level] || 0))
        : null;

    // Student debt correlated with education level (in USD)
    const debtRanges = {
        "High School": [0, 0], "Associate's": [5000, 25000], "Bachelor's": [15000, 80000],
        "Master's": [30000, 120000], "PhD": [50000, 200000], "Dropout": [2000, 30000]
    };
    const debtRange = debtRanges[selected.level];
    const studentDebt = Math.floor(Math.random() * (debtRange[1] - debtRange[0]) + debtRange[0]);

    return {
        level: selected.level,
        field,
        institution: university.name,
        institutionCountry: university.country,
        gpa,
        graduationYear: gradYear,
        studentDebt
    };
};

// ─── Employment Generation (enhanced with real data) ────────────────────────
const EMPLOYMENT_STATUSES = [
    { status: "employed",      weight: 55, minAge: 18, maxAge: 65 },
    { status: "self-employed",  weight: 10, minAge: 22, maxAge: 70 },
    { status: "unemployed",    weight: 8,  minAge: 18, maxAge: 64 },
    { status: "student",       weight: 12, minAge: 18, maxAge: 30 },
    { status: "retired",       weight: 10, minAge: 55, maxAge: 80 },
    { status: "freelancer",    weight: 5,  minAge: 20, maxAge: 60 },
];

const COMPANY_SIZES = [
    { size: "startup",    weight: 15, employeeRange: "1-50" },
    { size: "small",      weight: 25, employeeRange: "51-200" },
    { size: "medium",     weight: 30, employeeRange: "201-1000" },
    { size: "enterprise", weight: 30, employeeRange: "1001+" },
];

const WORK_MODES = [
    { mode: "onsite", weight: 45 },
    { mode: "hybrid", weight: 35 },
    { mode: "remote", weight: 20 },
];

const generateEmployment = (age, education) => {
    // Filter eligible statuses by age
    const eligible = EMPLOYMENT_STATUSES.filter(s => age >= s.minAge && age <= s.maxAge);
    // Boost "student" weight if age < 25 and education is Bachelor's or less
    const weights = eligible.map(s => {
        if (s.status === "student" && age < 25) return s.weight * 2;
        if (s.status === "retired" && age >= 65) return s.weight * 3;
        return s.weight;
    });
    const statusIndex = weightedRandom(weights);
    const employmentStatus = eligible[statusIndex].status;

    // Not employed → minimal employment data
    if (["unemployed", "student", "retired"].includes(employmentStatus)) {
        return {
            status: employmentStatus,
            company: null,
            companySize: null,
            industry: null,
            jobTitle: null,
            jobCategory: null,
            yearsExperience: employmentStatus === "retired" ? Math.floor(Math.random() * 30) + 10 : 0,
            workMode: null,
            workHoursPerWeek: 0,
            jobSatisfaction: null
        };
    }

    // Pick a real company from dataset
    const company = getRandom(companiesData);
    const companySize = COMPANY_SIZES[weightedRandom(COMPANY_SIZES.map(c => c.weight))];
    const workMode = WORK_MODES[weightedRandom(WORK_MODES.map(w => w.weight))];

    // Pick job title from real dataset
    const jobTitle = getRandom(jobTitlesData);
    const jobCategory = getRandom(jobCategoriesData);

    // Years of experience: age - education completion age
    const educationYears = { "High School": 18, "Associate's": 20, "Bachelor's": 22, "Master's": 24, "PhD": 28, "Dropout": 19 };
    const completionAge = educationYears[education.level] || 22;
    const yearsExperience = Math.max(0, age - completionAge + Math.floor(Math.random() * 3) - 1);

    // Work hours (normally distributed around 40)
    const workHours = Math.round(clamp(normalRandom(42, 8), 20, 70));

    // Job satisfaction (1-10, normally distributed around 6.5)
    const satisfaction = Math.round(clamp(normalRandom(6.5, 1.8), 1, 10));

    return {
        status: employmentStatus,
        company: company.name,
        companySize: companySize.size,
        industry: company.industry,
        jobTitle: jobTitle.title,
        jobCategory: jobCategory.name,
        yearsExperience,
        workMode: workMode.mode,
        workHoursPerWeek: workHours,
        jobSatisfaction: satisfaction
    };
};

// ─── Financial Profile (correlated with age + education + employment) ───────
const TAX_BRACKETS = [
    { min: 0, max: 11000, rate: "10%" },
    { min: 11001, max: 44725, rate: "12%" },
    { min: 44726, max: 95375, rate: "22%" },
    { min: 95376, max: 182100, rate: "24%" },
    { min: 182101, max: 231250, rate: "32%" },
    { min: 231251, max: 578125, rate: "35%" },
    { min: 578126, max: Infinity, rate: "37%" },
];

const generateFinancial = (age, education, employment) => {
    // Base income multipliers by education level
    const incomeMultipliers = {
        "High School": 1.0, "Associate's": 1.3, "Bachelor's": 1.8,
        "Master's": 2.3, "PhD": 2.8, "Dropout": 0.8
    };
    const eduMultiplier = incomeMultipliers[education.level] || 1.0;

    // Age factor: income grows with experience (peaks around 50)
    const ageFactor = age < 25 ? 0.5 : age < 35 ? 0.8 : age < 50 ? 1.0 : age < 60 ? 0.95 : 0.6;

    // Base salary from salary ranges if employed
    let annualIncome;
    if (["employed", "self-employed", "freelancer"].includes(employment.status)) {
        // Use a salary range from the dataset, scaled from INR to USD (rough 1:80 conversion)
        const roleKeys = Object.keys(salaryRangesData);
        const roleKey = getRandom(roleKeys);
        const range = salaryRangesData[roleKey];
        const baseSalaryINR = Math.floor(normalRandom(range.median, (range.p75 - range.p25) / 2));
        const baseSalaryUSD = Math.round(clamp(baseSalaryINR / 80, 15000, 500000));
        annualIncome = Math.round(baseSalaryUSD * eduMultiplier * ageFactor);
    } else if (employment.status === "retired") {
        annualIncome = Math.round(Math.random() * 40000 + 20000); // pension/SS
    } else {
        annualIncome = Math.round(Math.random() * 15000 + 5000); // unemployed/student
    }

    // Ensure reasonable bounds
    annualIncome = clamp(annualIncome, 0, 800000);

    // Credit score: correlated with age and income
    const baseCreditScore = 300 + (age * 3) + (annualIncome / 500);
    const creditScore = Math.round(clamp(normalRandom(baseCreditScore, 50), 300, 850));

    // Savings: correlated with income and age
    const savingsRate = age < 25 ? 0.05 : age < 35 ? 0.1 : age < 50 ? 0.15 : 0.2;
    const savings = Math.round(annualIncome * savingsRate * (Math.random() * 3 + 0.5) * (age / 30));

    // Monthly expenses: 50-80% of monthly income
    const monthlyIncome = annualIncome / 12;
    const expenseRate = 0.5 + Math.random() * 0.3;
    const monthlyExpenses = Math.round(monthlyIncome * expenseRate);

    // Debt-to-income ratio
    const totalDebt = education.studentDebt + Math.floor(Math.random() * annualIncome * 0.5);
    const debtToIncome = annualIncome > 0 ? parseFloat((totalDebt / annualIncome).toFixed(2)) : 0;

    // Tax bracket
    const taxBracket = TAX_BRACKETS.find(b => annualIncome >= b.min && annualIncome <= b.max) || TAX_BRACKETS[0];

    // Investment style (correlated with age)
    const investmentStyles = age < 30
        ? ["aggressive", "aggressive", "moderate"]
        : age < 50
            ? ["moderate", "moderate", "aggressive", "conservative"]
            : ["conservative", "conservative", "moderate"];

    // Home ownership (correlated with age and income)
    const homeOptions = age < 28
        ? ["rent", "rent", "rent", "live with family"]
        : age < 40
            ? ["rent", "mortgage", "mortgage", "own"]
            : ["own", "own", "mortgage", "rent"];

    return {
        annualIncome,
        creditScore,
        savings,
        monthlyExpenses,
        debtToIncome,
        taxBracket: taxBracket.rate,
        investmentStyle: getRandom(investmentStyles),
        homeOwnership: getRandom(homeOptions)
    };
};

// ─── Demographics ───────────────────────────────────────────────────────────
const NATIONALITIES = [
    "American", "Indian", "British", "Canadian", "Australian",
    "German", "French", "Japanese", "Chinese", "Brazilian",
    "Mexican", "South Korean", "Italian", "Spanish", "Dutch",
    "Swedish", "Swiss", "Norwegian", "Irish", "Russian"
];

const LANGUAGES = [
    "English", "Spanish", "Mandarin", "Hindi", "Arabic",
    "Portuguese", "Bengali", "Russian", "Japanese", "French",
    "German", "Korean", "Italian", "Turkish", "Vietnamese"
];

const ETHNICITIES = [
    { label: "White", weight: 30 },
    { label: "Asian", weight: 25 },
    { label: "Hispanic", weight: 18 },
    { label: "Black", weight: 15 },
    { label: "Mixed", weight: 8 },
    { label: "Other", weight: 4 },
];

const generateDemographics = (age) => {
    const ethnicityIndex = weightedRandom(ETHNICITIES.map(e => e.weight));
    const nationality = getRandom(NATIONALITIES);
    const primaryLanguage = getRandom(LANGUAGES);
    const secondaryLanguage = Math.random() > 0.4
        ? getRandom(LANGUAGES.filter(l => l !== primaryLanguage))
        : null;

    const relationshipStatuses = age < 22
        ? ["single", "single", "single", "dating"]
        : age < 35
            ? ["single", "dating", "married", "married"]
            : age < 60
                ? ["married", "married", "married", "divorced", "single"]
                : ["married", "widowed", "divorced", "single"];

    return {
        ethnicity: ETHNICITIES[ethnicityIndex].label,
        nationality,
        language: {
            primary: primaryLanguage,
            secondary: secondaryLanguage
        },
        relationshipStatus: getRandom(relationshipStatuses)
    };
};

// ─── Health Profile (correlated with age, weight, demographics) ─────────────
const EXERCISE_FREQUENCIES = [
    { label: "sedentary",      weight: 20 },
    { label: "1-2 times/week", weight: 25 },
    { label: "3-4 times/week", weight: 30 },
    { label: "5+ times/week",  weight: 15 },
    { label: "daily",          weight: 10 },
];

const SMOKING_STATUSES = [
    { label: "never",   weight: 55 },
    { label: "former",  weight: 20 },
    { label: "current", weight: 15 },
    { label: "occasional", weight: 10 },
];

const ALCOHOL_STATUSES = [
    { label: "never",    weight: 25 },
    { label: "social",   weight: 35 },
    { label: "moderate",  weight: 25 },
    { label: "heavy",    weight: 10 },
    { label: "former",   weight: 5 },
];

const SLEEP_QUALITY = [
    { label: "poor", weight: 15 },
    { label: "fair", weight: 25 },
    { label: "good", weight: 35 },
    { label: "excellent", weight: 25 },
];

const DIET_TYPES = [
    { label: "omnivore",    weight: 50 },
    { label: "vegetarian",  weight: 15 },
    { label: "vegan",       weight: 8 },
    { label: "pescatarian", weight: 7 },
    { label: "keto",        weight: 10 },
    { label: "paleo",       weight: 5 },
    { label: "mediterranean", weight: 5 },
];

const generateHealth = (age, heightCm, weightKg) => {
    // BMI calculation
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    let bmiCategory;
    if (bmi < 18.5) bmiCategory = "underweight";
    else if (bmi < 25) bmiCategory = "normal";
    else if (bmi < 30) bmiCategory = "overweight";
    else bmiCategory = "obese";

    // Exercise (less likely if older or obese)
    const exerciseWeights = EXERCISE_FREQUENCIES.map(e => {
        let w = e.weight;
        if (age > 60 && e.label === "daily") w *= 0.4;
        if (bmiCategory === "obese" && e.label === "sedentary") w *= 2;
        return w;
    });
    const exercise = EXERCISE_FREQUENCIES[weightedRandom(exerciseWeights)].label;

    // Smoking (more likely in certain age ranges)
    const smokingWeights = SMOKING_STATUSES.map(s => {
        let w = s.weight;
        if (age > 50 && s.label === "former") w *= 1.5;
        if (age < 25 && s.label === "current") w *= 0.7;
        return w;
    });
    const smoking = SMOKING_STATUSES[weightedRandom(smokingWeights)].label;

    // Alcohol
    const alcohol = ALCOHOL_STATUSES[weightedRandom(ALCOHOL_STATUSES.map(a => a.weight))].label;

    // Sleep hours (normally distributed, varies by age)
    const baseSleep = age < 25 ? 7.5 : age < 45 ? 7.0 : age < 65 ? 6.5 : 7.0;
    const sleepHours = parseFloat(clamp(normalRandom(baseSleep, 1.2), 3.5, 11).toFixed(1));
    const sleepQuality = SLEEP_QUALITY[weightedRandom(SLEEP_QUALITY.map(s => s.weight))].label;

    // Diet type
    const diet = DIET_TYPES[weightedRandom(DIET_TYPES.map(d => d.weight))].label;

    // Medical conditions from real healthcare dataset (age-correlated probability)
    const hasCondition = Math.random() < (age > 50 ? 0.45 : age > 35 ? 0.25 : 0.10);
    const conditions = healthcareData.conditions.filter(c => c.name !== "None");
    const conditionWeights = conditions.map(c => {
        let w = c.weight;
        // Higher chance for age-related conditions in older users
        if (age > 50) w *= c.ageMultiplier;
        return w;
    });
    const medicalCondition = hasCondition
        ? conditions[weightedRandom(conditionWeights)].name
        : "None";

    // Insurance provider
    const insuranceProvider = age >= 65
        ? (Math.random() > 0.3 ? "Medicare" : getRandom(healthcareData.insuranceProviders))
        : getRandom(healthcareData.insuranceProviders);

    // Current medications
    const numMeds = medicalCondition !== "None" ? Math.floor(Math.random() * 3) + 1 : (Math.random() > 0.7 ? 1 : 0);
    const medications = [];
    for (let i = 0; i < numMeds; i++) {
        const med = getRandom(healthcareData.medications);
        if (!medications.includes(med)) medications.push(med);
    }

    // Last checkup (months ago)
    const lastCheckupMonths = Math.floor(Math.random() * 24) + 1;

    // Disability
    const hasDisability = Math.random() < (age > 60 ? 0.15 : 0.05);

    // Mental health
    const mentalHealthOptions = ["good", "good", "good", "fair", "fair", "poor"];
    const mentalHealth = age < 30
        ? getRandom(["good", "good", "fair", "fair", "poor"])
        : getRandom(mentalHealthOptions);

    // Vaccination status
    const vaccinationStatuses = ["fully vaccinated", "partially vaccinated", "not vaccinated"];
    const vaccinationWeights = [65, 25, 10];
    const vaccination = vaccinationStatuses[weightedRandom(vaccinationWeights)];

    return {
        bmi,
        bmiCategory,
        bloodPressure: {
            systolic: Math.round(clamp(normalRandom(age > 50 ? 135 : 120, 15), 85, 200)),
            diastolic: Math.round(clamp(normalRandom(age > 50 ? 85 : 78, 10), 55, 120))
        },
        exerciseFrequency: exercise,
        smoking,
        alcohol,
        sleepHoursPerNight: sleepHours,
        sleepQuality,
        diet,
        medicalCondition,
        insuranceProvider,
        medications,
        lastCheckupMonthsAgo: lastCheckupMonths,
        hasDisability,
        mentalHealth,
        vaccination
    };
};

// ─── Social & Behavioral Profile ────────────────────────────────────────────
const SOCIAL_PLATFORMS = [
    "Instagram", "Twitter/X", "Facebook", "LinkedIn", "TikTok",
    "YouTube", "Reddit", "Snapchat", "Pinterest", "Discord"
];

const SHOPPING_CATEGORIES = [
    "electronics", "fashion", "groceries", "books", "home & garden",
    "health & beauty", "sports", "toys & games", "automotive", "pet supplies"
];

const generateSocial = (age, employment) => {
    // Social media (younger = more platforms)
    const numPlatforms = age < 25 ? Math.floor(Math.random() * 4) + 3
        : age < 40 ? Math.floor(Math.random() * 3) + 2
        : age < 60 ? Math.floor(Math.random() * 2) + 1
        : Math.floor(Math.random() * 2);
    const platforms = [];
    const available = [...SOCIAL_PLATFORMS];
    for (let i = 0; i < Math.min(numPlatforms, available.length); i++) {
        const idx = Math.floor(Math.random() * available.length);
        platforms.push(available.splice(idx, 1)[0]);
    }

    // Screen time (hours per day, correlated with age)
    const screenTime = parseFloat(clamp(
        normalRandom(age < 25 ? 7.5 : age < 40 ? 6.0 : age < 60 ? 4.5 : 3.0, 2.0),
        0.5, 16
    ).toFixed(1));

    // Online shopping frequency
    const shoppingFrequencies = ["never", "rarely", "monthly", "weekly", "daily"];
    const shopWeights = age < 30 ? [5, 10, 30, 40, 15] : age < 50 ? [5, 15, 35, 35, 10] : [15, 25, 35, 20, 5];
    const shoppingFrequency = shoppingFrequencies[weightedRandom(shopWeights)];

    // Preferred shopping categories
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const shopCategories = [];
    const catPool = [...SHOPPING_CATEGORIES];
    for (let i = 0; i < numCategories; i++) {
        const idx = Math.floor(Math.random() * catPool.length);
        shopCategories.push(catPool.splice(idx, 1)[0]);
    }

    // Monthly online spending correlated with income and shopping frequency
    const spendMultiplier = { "never": 0, "rarely": 0.02, "monthly": 0.05, "weekly": 0.1, "daily": 0.2 };
    const baseSpend = employment.status === "employed" || employment.status === "self-employed" ? 3000 : 800;
    const monthlyOnlineSpending = Math.round(baseSpend * (spendMultiplier[shoppingFrequency] || 0.05) * (0.5 + Math.random()));

    // News consumption
    const newsSources = ["social media", "news apps", "TV", "newspapers", "podcasts", "newsletters", "radio"];
    const primaryNews = getRandom(age < 35 ? ["social media", "news apps", "podcasts", "newsletters"] : ["TV", "newspapers", "news apps", "radio"]);

    // Preferred content type
    const contentTypes = ["video", "text", "audio", "images"];
    const contentWeights = age < 30 ? [45, 15, 20, 20] : age < 50 ? [30, 30, 20, 20] : [20, 40, 25, 15];
    const preferredContent = contentTypes[weightedRandom(contentWeights)];

    // Travel frequency
    const travelOptions = ["never", "1-2 times/year", "3-5 times/year", "monthly", "weekly"];
    const travelWeights = employment.status === "student" ? [20, 40, 30, 8, 2] : [10, 30, 30, 20, 10];
    const travelFrequency = travelOptions[weightedRandom(travelWeights)];

    // Volunteering
    const volunteers = Math.random() < (age > 25 ? 0.25 : 0.35);

    // Pet ownership
    const petOptions = ["none", "dog", "cat", "fish", "bird", "reptile", "hamster", "multiple"];
    const petWeights = [35, 25, 20, 5, 4, 3, 3, 5];
    const pet = petOptions[weightedRandom(petWeights)];

    return {
        socialMedia: {
            platforms,
            screenTimeHoursPerDay: screenTime,
            preferredContent
        },
        shopping: {
            frequency: shoppingFrequency,
            preferredCategories: shopCategories,
            monthlyOnlineSpending
        },
        newsSource: primaryNews,
        travelFrequency,
        volunteers,
        pet
    };
};

// ─── Missing Data Utility (for ML training) ─────────────────────────────────
/**
 * Recursively nullifies random fields in an object based on a missing rate.
 * @param {object} obj - The object to apply missing data to
 * @param {number} rate - Probability (0-1) that each leaf field becomes null
 * @param {string[]} protectedFields - Fields that should never be nullified
 * @returns {object} The object with random fields set to null
 */
const applyMissingData = (obj, rate, protectedFields = ['id', 'fullName', 'firstName', 'lastName', 'age', 'gender', 'email']) => {
    if (rate <= 0) return obj;
    const result = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const key of Object.keys(result)) {
        if (protectedFields.includes(key)) continue;
        if (result[key] !== null && typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = applyMissingData(result[key], rate, protectedFields);
        } else if (Math.random() < rate) {
            result[key] = null;
        }
    }
    return result;
};

// ─── Main User Generator ───────────────────────────────────────────────────
const generateSingleUser = (idIndex = null) => {
    // Core identity
    const firstName = getRandom(firstNames.names);
    const middleName = getRandom(middleNames.father);
    const lastName = getRandom(lastNames.surnames);
    const emailProvider = getRandom(emails.mails);
    const cardType = getRandom(cardData.cards);
    const domain = getRandom(domainData.domains);
    const street = getRandom(streetData.addresses);
    const state = getRandom(stateData.data);

    const id = idIndex || Math.floor(Math.random() * 100000) + 1;

    // Weighted age generation
    const age = generateAge();

    // Correlated education
    const education = generateEducation(age);

    // Correlated employment
    const employment = generateEmployment(age, education);

    // Correlated financial profile
    const financial = generateFinancial(age, education, employment);

    // Demographics
    const demographics = generateDemographics(age);

    // Height/weight (generated early for health profile)
    const heightCm = Math.round(clamp(normalRandom(170, 10), 140, 210));
    const weightKg = Math.round(clamp(normalRandom(70, 15), 40, 150));

    // Phase 2: Health profile (correlated with age + body metrics)
    const health = generateHealth(age, heightCm, weightKg);

    // Phase 2: Social & behavioral profile
    const social = generateSocial(age, employment);

    // Card info
    const cardNumber = Math.floor(Math.random() * 10000000000000000);
    const cardExpiry = `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 10) + 25}`;
    const cardCvv = Math.floor(Math.random() * 900) + 100;

    // Coordinates
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lng = (Math.random() * 360 - 180).toFixed(6);

    // Network
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const genderOptions = ["male", "female", "non-binary"];
    const bloodGroups = ["+O", "+A", "+B", "+AB", "-O", "-A", "-B", "-AB"];

    // Phone number
    let phoneNumber = "";
    for (let i = 0; i < 10; i++) phoneNumber += Math.floor(Math.random() * 10);

    // Password
    let password = "";
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%&";
    for (let i = 0; i < 12; i++) password += charset.charAt(Math.floor(Math.random() * charset.length));

    // Birth date: calculated from age
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;

    // Height/weight already generated above for health profile correlation

    // Hobbies
    const userHobbies = [getRandom(hobbiesData).hobby, getRandom(hobbiesData).hobby, getRandom(hobbiesData).hobby];

    // Technology profile
    const criticalFeaturesOptions = ["ease of use", "reliability", "security features", "battery life", "camera quality", "performance", "storage", "5G connectivity"];
    const primaryUsesOptions = ["communication", "education", "organization", "entertainment", "work", "social media", "photography", "gaming"];
    const techProfile = {
        devices: {
            additional_devices: [getRandom(devicesData)["Device Name"], getRandom(devicesData)["Device Name"]],
            smartphone: getRandom(devicesData)["Device Name"]
        },
        phone_preferences: {
            critical_features: [getRandom(criticalFeaturesOptions), getRandom(criticalFeaturesOptions), getRandom(criticalFeaturesOptions)],
            primary_uses: [getRandom(primaryUsesOptions), getRandom(primaryUsesOptions), getRandom(primaryUsesOptions)]
        },
        interest: userHobbies
    };

    // Pick a country from the dataset
    const country = getRandom(countriesData);

    return {
        id: `${id}`,
        fullName: `${firstName} ${middleName} ${lastName}`,
        firstName,
        lastName,
        middleName,
        age,
        gender: getRandom(genderOptions),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailProvider}`,
        phone: `+1 ${phoneNumber}`,
        username: `${firstName.toLowerCase()}_${id}`,
        password,
        birthDate: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
        bloodGroup: getRandom(bloodGroups),
        height: heightCm,
        weight: weightKg,
        domain: `${firstName.toLowerCase()}${lastName.toLowerCase()}${domain.tlds[0]}`,
        ip,
        macaddress: Array.from({ length: 6 }, () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0')).join(':').toUpperCase(),
        address: {
            street: `${street.address}`,
            city: state.city,
            state: state.state,
            country: country.name,
            countryCode: country.code,
            zipCode: Math.floor(Math.random() * 90000) + 10000,
            coordinates: { latitude: lat, longitude: lng }
        },
        demographics,
        education,
        employment,
        financial,
        health,
        social,
        bank: {
            nameOnCard: `${firstName} ${middleName} ${lastName}`,
            cardNumber: `${cardNumber}`,
            cardType,
            cardExpiry,
            cardCvv: `${cardCvv}`,
        },
        hobbies: userHobbies,
        technology_profile: techProfile
    };
};

// ─── Public API ─────────────────────────────────────────────────────────────
const user = (options = {}) => {
    const u = generateSingleUser();
    if (options.missing_rate && options.missing_rate > 0) {
        return applyMissingData(u, options.missing_rate);
    }
    return u;
};

/**
 * Generate multiple realistic user profiles.
 * @param {number} count - Number of users to generate
 * @param {object} [options] - Configuration options
 * @param {number} [options.missing_rate=0] - Probability (0-1) that each field is null (for ML training)
 * @param {number} [options.seed] - Random seed for reproducibility (reserved for Phase 3)
 * @returns {object[]} Array of user profiles
 */
const users = (count = 10, options = {}) => {
    return Array.from({ length: count }, (_, i) => {
        const u = generateSingleUser(i + 1);
        if (options.missing_rate && options.missing_rate > 0) {
            return applyMissingData(u, options.missing_rate);
        }
        return u;
    });
};

const getEmail = () => {
    const fn = getRandom(firstNames.names);
    const ln = getRandom(lastNames.surnames);
    const domain = getRandom(emails.mails);
    return { email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}` };
};

const getUsername = () => {
    const fn = getRandom(firstNames.names);
    const id = Math.floor(Math.random() * 10000) + 1;
    return { username: `${fn.toLowerCase()}_${id}` };
};

const getPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%&";
    let password = "";
    for (let i = 0; i < length; i++) password += charset.charAt(Math.floor(Math.random() * charset.length));
    return { password };
};

const getZipCode = () => ({ zipCode: Math.floor(Math.random() * 90000) + 10000 });

const getCoordinates = () => ({
    latitude: (Math.random() * 180 - 90).toFixed(6),
    longitude: (Math.random() * 360 - 180).toFixed(6)
});

const getCity = () => ({ city: getRandom(stateData.data).city });

const getStateCode = () => {
    const codes = loadData('shortformstate.json');
    return { stateCode: getRandom(codes) };
};

const creditcard = () => {
    const u = generateSingleUser();
    return {
        nameOnCard: u.bank.nameOnCard,
        cardNumber: u.bank.cardNumber,
        cardType: u.bank.cardType,
        cardExpiry: u.bank.cardExpiry,
        cardCvv: u.bank.cardCvv,
    };
};

const address = () => {
    const u = generateSingleUser();
    return {
        street: u.address.street,
        city: u.address.city,
        state: u.address.state,
        country: u.address.country,
        countryCode: u.address.countryCode,
        zipCode: u.address.zipCode,
        ip: u.ip,
        macaddress: u.macaddress,
        coordinates: u.address.coordinates
    };
};

const resume = (count = 10) => {
    return Array.from({ length: count }, (_, i) => {
        const u = generateSingleUser(i + 1);
        return {
            id: u.id,
            fullName: u.fullName,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone,
            age: u.age,
            address: u.address,
            education: u.education,
            employment: u.employment,
            skills: getRandom(jobTitlesData).category
                ? [getRandom(EDUCATION_FIELDS), getRandom(EDUCATION_FIELDS), getRandom(EDUCATION_FIELDS)]
                : ["Communication", "Problem Solving", "Teamwork"]
        };
    });
};

const biodata = (count = 10) => {
    return Array.from({ length: count }, (_, i) => {
        const u = generateSingleUser(i + 1);
        return {
            ...u,
            personalityType: getRandom(["INTJ", "ENFP", "ISTP", "ENTJ", "INFJ", "ESTP", "ISFP", "ENTP",
                "ISTJ", "ESFJ", "INFP", "ESTJ", "ISFJ", "ENFJ", "INTP", "ESFP"]),
            favoriteMusic: getRandom(["Rock", "Jazz", "Lofi", "Pop", "Classical", "Hip-Hop",
                "R&B", "Electronic", "Country", "Metal", "Indie", "Latin"])
        };
    });
};

module.exports = {
    user,
    users,
    getEmail,
    getUsername,
    getPassword,
    getZipCode,
    getCoordinates,
    getCity,
    getStateCode,
    creditcard,
    address,
    resume,
    biodata
};
