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

// Phase 4 datasets
const localesData = loadData('locales.json');

// ─── Personas for Realistic Distribution ───────────────────────────────────
const PERSONAS = [
    { type: "Executive", weight: 5, incomeMult: 3.5, techBias: "Apple", lifestyle: "luxury" },
    { type: "Tech Professional", weight: 20, incomeMult: 2.2, techBias: "High-End", lifestyle: "modern" },
    { type: "Student", weight: 15, incomeMult: 0.4, techBias: "Mid-Range", lifestyle: "frugal" },
    { type: "Manual Laborer", weight: 25, incomeMult: 0.9, techBias: "Budget", lifestyle: "basic" },
    { type: "Service Worker", weight: 25, incomeMult: 0.8, techBias: "Budget", lifestyle: "basic" },
    { type: "Freelancer", weight: 10, incomeMult: 1.2, techBias: "Mid-Range", lifestyle: "flexible" }
];

// ─── Seedable RNG (Phase 3) ─────────────────────────────────────────────────
/**
 * Mulberry32: A fast, high-quality 32-bit seedable PRNG.
 * @param {number} seed - 32-bit integer seed
 * @returns {function} A function that returns a pseudo-random float in [0, 1)
 */
const mulberry32 = (seed) => {
    return () => {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

// Global RNG — defaults to Math.random, swapped when seed is set
let rng = Math.random;

/**
 * Sets the global RNG to a seeded PRNG or resets to Math.random.
 * @param {number|null} seed
 */
const setSeed = (seed) => {
    if (seed != null) {
        rng = mulberry32(seed);
    } else {
        rng = Math.random;
    }
};

// ─── Utility Functions ──────────────────────────────────────────────────────
const getRandom = (arr) => arr[Math.floor(rng() * arr.length)];

/**
 * Weighted random selection: picks an index based on cumulative weights.
 * @param {number[]} weights - Array of weights (must sum > 0)
 * @returns {number} The selected index
 */
const weightedRandom = (weights) => {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let r = rng() * total;
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
    const u1 = rng();
    const u2 = rng();
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
    return Math.floor(rng() * (bracket.max - bracket.min + 1)) + bracket.min;
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

const generateEducation = (age, persona) => {
    // Filter education levels by age eligibility
    const eligible = EDUCATION_LEVELS.filter(e => age >= e.minAge);
    
    // Adjust weights based on persona
    const weights = eligible.map(e => {
        let w = e.weight;
        if (persona.type === "Executive" && (e.level === "Master's" || e.level === "PhD")) w *= 3;
        if (persona.type === "Manual Laborer" && (e.level === "High School" || e.level === "Dropout")) w *= 2;
        if (persona.type === "Student" && age < 25) w *= 2;
        return w;
    });
    
    const selectedIndex = weightedRandom(weights);
    const selected = eligible[selectedIndex];

    const field = selected.level !== "High School" && selected.level !== "Dropout"
        ? getRandom(EDUCATION_FIELDS)
        : null;

    const gpa = selected.level !== "Dropout"
        ? parseFloat((rng() * (selected.gpaRange[1] - selected.gpaRange[0]) + selected.gpaRange[0]).toFixed(2))
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
    const studentDebt = Math.floor(rng() * (debtRange[1] - debtRange[0]) + debtRange[0]);

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

const generateEmployment = (age, education, persona) => {
    // Filter eligible statuses by age
    const eligible = EMPLOYMENT_STATUSES.filter(s => age >= s.minAge && age <= s.maxAge);
    
    // Boost status weight based on persona
    const weights = eligible.map(s => {
        let w = s.weight;
        if (persona.type === "Executive" && s.status === "employed") w *= 2;
        if (persona.type === "Freelancer" && s.status === "freelancer") w *= 5;
        if (persona.type === "Student" && s.status === "student") w *= 4;
        if (s.status === "retired" && age >= 65) w *= 3;
        return w;
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
            yearsExperience: employmentStatus === "retired" ? Math.floor(rng() * 30) + 10 : 0,
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
    const yearsExperience = Math.max(0, age - completionAge + Math.floor(rng() * 3) - 1);

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

const generateFinancial = (age, education, employment, persona) => {
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
        
        // Final annual income influenced by Persona and Education
        annualIncome = Math.round(baseSalaryUSD * eduMultiplier * ageFactor * persona.incomeMult);
    } else if (employment.status === "retired") {
        annualIncome = Math.round(rng() * 40000 + 20000); // pension/SS
    } else {
        annualIncome = Math.round(rng() * 15000 + 5000); // unemployed/student
    }

    // Ensure reasonable bounds
    annualIncome = clamp(annualIncome, 0, 800000);

    // Credit score: correlated with age and income
    const baseCreditScore = 300 + (age * 3) + (annualIncome / 500);
    const creditScore = Math.round(clamp(normalRandom(baseCreditScore, 50), 300, 850));

    // Savings: correlated with income and age
    const savingsRate = age < 25 ? 0.05 : age < 35 ? 0.1 : age < 50 ? 0.15 : 0.2;
    const savings = Math.round(annualIncome * savingsRate * (rng() * 3 + 0.5) * (age / 30));

    // Monthly expenses: 50-80% of monthly income
    const monthlyIncome = annualIncome / 12;
    const expenseRate = 0.5 + rng() * 0.3;
    const monthlyExpenses = Math.round(monthlyIncome * expenseRate);

    // Debt-to-income ratio
    const totalDebt = education.studentDebt + Math.floor(rng() * annualIncome * 0.5);
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
    const secondaryLanguage = rng() > 0.4
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
    const hasCondition = rng() < (age > 50 ? 0.45 : age > 35 ? 0.25 : 0.10);
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
        ? (rng() > 0.3 ? "Medicare" : getRandom(healthcareData.insuranceProviders))
        : getRandom(healthcareData.insuranceProviders);

    // Current medications
    const numMeds = medicalCondition !== "None" ? Math.floor(rng() * 3) + 1 : (rng() > 0.7 ? 1 : 0);
    const medications = [];
    for (let i = 0; i < numMeds; i++) {
        const med = getRandom(healthcareData.medications);
        if (!medications.includes(med)) medications.push(med);
    }

    // Last checkup (months ago)
    const lastCheckupMonths = Math.floor(rng() * 24) + 1;

    // Disability
    const hasDisability = rng() < (age > 60 ? 0.15 : 0.05);

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

const generateSocial = (age, employment, persona) => {
    // Social media (younger = more platforms)
    let basePlatforms = age < 25 ? 4 : age < 40 ? 3 : age < 60 ? 1 : 0;
    if (persona.type === "Tech Professional") basePlatforms += 2;
    if (persona.type === "Executive") basePlatforms += 1;

    const numPlatforms = Math.floor(rng() * 3) + basePlatforms;
    const platforms = [];
    const available = [...SOCIAL_PLATFORMS];
    for (let i = 0; i < Math.min(numPlatforms, available.length); i++) {
        const idx = Math.floor(rng() * available.length);
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
    const numCategories = Math.floor(rng() * 3) + 1;
    const shopCategories = [];
    const catPool = [...SHOPPING_CATEGORIES];
    for (let i = 0; i < numCategories; i++) {
        const idx = Math.floor(rng() * catPool.length);
        shopCategories.push(catPool.splice(idx, 1)[0]);
    }

    // Monthly online spending correlated with income and shopping frequency
    const spendMultiplier = { "never": 0, "rarely": 0.02, "monthly": 0.05, "weekly": 0.1, "daily": 0.2 };
    const baseSpend = employment.status === "employed" || employment.status === "self-employed" ? 3000 : 800;
    const monthlyOnlineSpending = Math.round(baseSpend * (spendMultiplier[shoppingFrequency] || 0.05) * (0.5 + rng()));

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
    const volunteers = rng() < (age > 25 ? 0.25 : 0.35);

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
        } else if (rng() < rate) {
            result[key] = null;
        }
    }
    return result;
};

// ─── Digital Footprint (Phase 3) ────────────────────────────────────────────
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/{v}.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/{v}.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/{v}.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:{v}.0) Gecko/20100101 Firefox/{v}.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/{v}.0.0.0 Mobile Safari/537.36',
];

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave'];
const OS_OPTIONS = ['Windows 11', 'Windows 10', 'macOS Sonoma', 'macOS Ventura', 'Ubuntu 24.04', 'Fedora 40', 'iOS 17', 'Android 14', 'Android 13'];
const REFERRERS = ['google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'reddit.com', 'direct', 'email', 'youtube.com', 'tiktok.com'];

const generateDigitalFootprint = (age) => {
    const now = new Date();

    // Account creation: 1 month to 10 years ago (younger = more recent)
    const maxMonthsAgo = age < 25 ? 48 : age < 40 ? 84 : 120;
    const monthsAgo = Math.floor(rng() * maxMonthsAgo) + 1;
    const createdAt = new Date(now.getTime() - monthsAgo * 30 * 24 * 60 * 60 * 1000);

    // Last login: 0 to 30 days ago
    const daysAgoLogin = Math.floor(rng() * 30);
    const lastLogin = new Date(now.getTime() - daysAgoLogin * 24 * 60 * 60 * 1000);

    // Last password change: 1 to 18 months ago
    const monthsAgoPassword = Math.floor(rng() * 18) + 1;
    const lastPasswordChange = new Date(now.getTime() - monthsAgoPassword * 30 * 24 * 60 * 60 * 1000);

    // Browser version
    const browserVersion = Math.floor(rng() * 30) + 100;
    const ua = getRandom(USER_AGENTS).replace(/{v}/g, String(browserVersion));

    // Session data
    const avgSessionMinutes = parseFloat(clamp(normalRandom(age < 30 ? 25 : 15, 8), 1, 120).toFixed(1));
    const sessionsPerWeek = Math.round(clamp(normalRandom(age < 30 ? 12 : age < 50 ? 8 : 4, 3), 0, 30));
    const totalSessions = Math.round(sessionsPerWeek * (monthsAgo * 4.3));

    // 2FA enabled (younger + tech-savvy = more likely)
    const twoFactorEnabled = rng() < (age < 35 ? 0.6 : 0.35);

    // Preferred language for UI
    const uiLanguages = ['en', 'en', 'en', 'es', 'fr', 'de', 'pt', 'ja', 'zh', 'ko', 'hi', 'ar'];

    return {
        accountCreatedAt: createdAt.toISOString(),
        lastLoginAt: lastLogin.toISOString(),
        lastPasswordChangeAt: lastPasswordChange.toISOString(),
        userAgent: ua,
        browser: getRandom(BROWSERS),
        os: getRandom(OS_OPTIONS),
        referrer: getRandom(REFERRERS),
        avgSessionMinutes,
        sessionsPerWeek,
        totalSessions,
        twoFactorEnabled,
        preferredLanguage: getRandom(uiLanguages),
        accountStatus: getRandom(['active', 'active', 'active', 'active', 'inactive', 'suspended']),
        verifiedEmail: rng() < 0.85,
        verifiedPhone: rng() < 0.6
    };
};

// ─── Flatten Utility (for CSV export) ───────────────────────────────────────
/**
 * Flattens a nested object into a single-level object with dot-separated keys.
 * Arrays are joined with semicolons.
 * @param {object} obj - The object to flatten
 * @param {string} prefix - Key prefix for recursion
 * @returns {object} Flat object
 */
const flattenObject = (obj, prefix = '') => {
    const flat = {};
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value === null || value === undefined) {
            flat[fullKey] = '';
        } else if (Array.isArray(value)) {
            flat[fullKey] = value.join(';');
        } else if (typeof value === 'object' && !(value instanceof Date)) {
            Object.assign(flat, flattenObject(value, fullKey));
        } else {
            flat[fullKey] = value;
        }
    }
    return flat;
};

// ─── Schema Override Engine (Phase 4) ───────────────────────────────────────
/**
 * Applies user-defined schema constraints to a generated user object.
 * Supports: age.min/max, gender, employment.status, education.level,
 * financial.annualIncome.min/max, health.medicalCondition, address.country
 * @param {object} schema - Schema constraints
 * @returns {function} A post-processor that modifies the generated user
 */
const applySchemaOverrides = (user, schema) => {
    if (!schema || typeof schema !== 'object') return user;

    // Age override
    if (schema.age) {
        if (schema.age.min != null && user.age < schema.age.min) user.age = schema.age.min;
        if (schema.age.max != null && user.age > schema.age.max) user.age = schema.age.max;
        if (schema.age.exact != null) user.age = schema.age.exact;
        // Recalculate birthDate
        const cy = new Date().getFullYear();
        const bm = Math.floor(rng() * 12) + 1;
        const bd = Math.floor(rng() * 28) + 1;
        user.birthDate = `${cy - user.age}-${String(bm).padStart(2, '0')}-${String(bd).padStart(2, '0')}`;
    }

    // Gender override
    if (schema.gender) {
        user.gender = schema.gender;
    }

    // Employment status override
    if (schema.employment && schema.employment.status) {
        user.employment.status = schema.employment.status;
    }

    // Education level override
    if (schema.education && schema.education.level) {
        user.education.level = schema.education.level;
    }

    // Financial income range override
    if (schema.financial) {
        if (schema.financial.annualIncome) {
            const fi = schema.financial.annualIncome;
            if (fi.min != null && user.financial.annualIncome < fi.min)
                user.financial.annualIncome = fi.min;
            if (fi.max != null && user.financial.annualIncome > fi.max)
                user.financial.annualIncome = fi.max;
        }
    }

    // Medical condition override
    if (schema.health && schema.health.medicalCondition) {
        user.health.medicalCondition = schema.health.medicalCondition;
    }

    // Country override
    if (schema.address && schema.address.country) {
        user.address.country = schema.address.country;
    }

    // Height/weight overrides
    if (schema.height) {
        if (schema.height.min != null) user.height = Math.max(user.height, schema.height.min);
        if (schema.height.max != null) user.height = Math.min(user.height, schema.height.max);
    }
    if (schema.weight) {
        if (schema.weight.min != null) user.weight = Math.max(user.weight, schema.weight.min);
        if (schema.weight.max != null) user.weight = Math.min(user.weight, schema.weight.max);
    }

    return user;
};

// ─── Locale-Aware Name Selection (Phase 4) ──────────────────────────────────
const LOCALE_PHONE_CODES = {
    'en': '+1', 'in': '+91', 'jp': '+81', 'kr': '+82',
    'de': '+49', 'br': '+55', 'ar': '+966', 'fr': '+33'
};

const LOCALE_COUNTRIES = {
    'en': { name: 'United States', code: 'US' },
    'in': { name: 'India', code: 'IN' },
    'jp': { name: 'Japan', code: 'JP' },
    'kr': { name: 'South Korea', code: 'KR' },
    'de': { name: 'Germany', code: 'DE' },
    'br': { name: 'Brazil', code: 'BR' },
    'ar': { name: 'Saudi Arabia', code: 'SA' },
    'fr': { name: 'France', code: 'FR' }
};

// ─── Time-Series Activity Generator (Phase 4) ──────────────────────────────
const ACTIVITY_TYPES = ['login', 'page_view', 'purchase', 'search', 'click', 'logout', 'api_call', 'upload', 'download', 'comment'];
const PAGE_NAMES = ['/home', '/profile', '/settings', '/dashboard', '/products', '/cart', '/checkout', '/search', '/help', '/about', '/pricing', '/blog'];

/**
 * Generates time-series activity data for a user over N days.
 * @param {object} user - A generated user object
 * @param {number} days - Number of days to generate
 * @param {number} [avgEventsPerDay=8] - Average events per day
 * @returns {object[]} Array of timestamped activity events
 */
const generateTimeSeries = (user, days = 30, avgEventsPerDay = 8) => {
    const events = [];
    const now = new Date();
    const isActive = user.digitalFootprint.accountStatus === 'active';
    const activityMultiplier = isActive ? 1.0 : 0.2;

    for (let d = 0; d < days; d++) {
        const dayDate = new Date(now.getTime() - (days - d) * 24 * 60 * 60 * 1000);
        const dayOfWeek = dayDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Fewer events on weekends
        const dailyEvents = Math.max(0, Math.round(
            normalRandom(avgEventsPerDay * activityMultiplier * (isWeekend ? 0.6 : 1.0), 3)
        ));

        for (let e = 0; e < dailyEvents; e++) {
            // Time of day: weighted toward work hours (9-22)
            const hour = Math.floor(clamp(normalRandom(14, 4), 0, 23));
            const minute = Math.floor(rng() * 60);
            const second = Math.floor(rng() * 60);

            const eventTime = new Date(dayDate);
            eventTime.setHours(hour, minute, second);

            const activityType = getRandom(ACTIVITY_TYPES);
            const event = {
                userId: user.id,
                timestamp: eventTime.toISOString(),
                type: activityType,
                page: getRandom(PAGE_NAMES),
                duration: activityType === 'page_view'
                    ? Math.round(clamp(normalRandom(45, 30), 2, 600))
                    : null,
                device: getRandom(['desktop', 'mobile', 'tablet']),
                ip: user.ip,
                success: rng() > 0.05, // 95% success rate
            };

            if (activityType === 'purchase') {
                event.amount = parseFloat((rng() * 500 + 5).toFixed(2));
                event.currency = 'USD';
            }
            if (activityType === 'search') {
                event.query = getRandom(['laptop', 'shoes', 'phone case', 'headphones', 'book', 'camera', 'jacket', 'watch', 'keyboard', 'monitor']);
            }

            events.push(event);
        }
    }

    // Sort chronologically
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return events;
};

// ─── Anomaly Injection Engine (Phase 4) ──────────────────────────────────────
const ANOMALY_TYPES = [
    { type: 'income_spike',     weight: 20, apply: (u) => { u.financial.annualIncome *= (5 + rng() * 10); u.financial.annualIncome = Math.round(u.financial.annualIncome); }},
    { type: 'age_outlier',      weight: 10, apply: (u) => { u.age = getRandom([1, 2, 3, 115, 120, 130]); }},
    { type: 'credit_fraud',     weight: 15, apply: (u) => { u.financial.creditScore = getRandom([100, 150, 200, 850, 900, 999]); u.financial.debtToIncome = parseFloat((rng() * 50 + 10).toFixed(2)); }},
    { type: 'geo_impossible',   weight: 10, apply: (u) => { u.address.coordinates = { latitude: '0.000000', longitude: '0.000000' }; u.ip = '0.0.0.0'; }},
    { type: 'session_anomaly',  weight: 15, apply: (u) => { u.digitalFootprint.sessionsPerWeek = Math.round(rng() * 500 + 200); u.digitalFootprint.avgSessionMinutes = parseFloat((rng() * 1000 + 500).toFixed(1)); }},
    { type: 'velocity_attack',  weight: 10, apply: (u) => { u.digitalFootprint.totalSessions = Math.round(rng() * 100000 + 50000); u.digitalFootprint.lastLoginAt = new Date().toISOString(); }},
    { type: 'data_mismatch',    weight: 10, apply: (u) => { u.age = 12; u.employment.status = 'employed'; u.employment.yearsExperience = 30; u.financial.annualIncome = 500000; }},
    { type: 'health_outlier',   weight: 10, apply: (u) => { u.health.bmi = getRandom([8, 9, 75, 80]); u.health.bloodPressure = { systolic: getRandom([40, 300]), diastolic: getRandom([20, 200]) }; }},
];

/**
 * Injects anomalies into a user array for fraud detection / anomaly detection training.
 * @param {object[]} usersArr - Array of user objects
 * @param {number} rate - Fraction (0-1) of users to make anomalous
 * @returns {object[]} Modified array with anomaly flags
 */
const injectAnomalies = (usersArr, rate = 0.05) => {
    return usersArr.map(u => {
        const user = JSON.parse(JSON.stringify(u)); // deep clone
        if (rng() < rate) {
            const anomalyIndex = weightedRandom(ANOMALY_TYPES.map(a => a.weight));
            const anomaly = ANOMALY_TYPES[anomalyIndex];
            anomaly.apply(user);
            user._anomaly = {
                isAnomaly: true,
                type: anomaly.type
            };
        } else {
            user._anomaly = { isAnomaly: false, type: null };
        }
        return user;
    });
};

// ─── Main User Generator ───────────────────────────────────────────────────
const generateSingleUser = (idIndex = null, schema = null, locale = null) => {
    // Locale-aware name selection
    let firstName, middleName, lastName, phoneCode;
    if (locale && localesData[locale]) {
        const loc = localesData[locale];
        const gender = schema && schema.gender ? schema.gender : getRandom(['male', 'female']);
        firstName = getRandom(gender === 'female' ? loc.first_female : loc.first_male);
        middleName = getRandom(loc.first_male); // middle name from male pool
        lastName = getRandom(loc.last);
        phoneCode = LOCALE_PHONE_CODES[locale] || '+1';
    } else {
        firstName = getRandom(firstNames.names);
        middleName = getRandom(middleNames.father);
        lastName = getRandom(lastNames.surnames);
        phoneCode = '+1';
    }
    const emailProvider = getRandom(emails.mails);
    const cardType = getRandom(cardData.cards);
    const domain = getRandom(domainData.domains);
    const street = getRandom(streetData.addresses);
    const state = getRandom(stateData.data);

    const id = idIndex || Math.floor(rng() * 100000) + 1;

    // Weighted age generation
    const age = generateAge();

    // Pick a Persona to drive statistical correlations
    const persona = PERSONAS[weightedRandom(PERSONAS.map(p => p.weight))];

    // Correlated education
    const education = generateEducation(age, persona);

    // Correlated employment
    const employment = generateEmployment(age, education, persona);

    // Correlated financial profile
    const financial = generateFinancial(age, education, employment, persona);

    // Demographics
    const demographics = generateDemographics(age);

    // Height/weight (generated early for health profile)
    const heightCm = Math.round(clamp(normalRandom(170, 10), 140, 210));
    const weightKg = Math.round(clamp(normalRandom(70, 15), 40, 150));

    // Phase 2: Health profile (correlated with age + body metrics)
    const health = generateHealth(age, heightCm, weightKg);

    // Phase 2: Social & behavioral profile
    const social = generateSocial(age, employment, persona);

    // Phase 3: Digital footprint
    const digitalFootprint = generateDigitalFootprint(age, persona);

    // Card info
    const cardNumber = Math.floor(rng() * 10000000000000000);
    const cardExpiry = `${Math.floor(rng() * 12) + 1}/${Math.floor(rng() * 10) + 25}`;
    const cardCvv = Math.floor(rng() * 900) + 100;

    // Coordinates
    const lat = (rng() * 180 - 90).toFixed(6);
    const lng = (rng() * 360 - 180).toFixed(6);

    // Network
    const ip = `${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`;

    const genderOptions = ["male", "female", "non-binary"];
    const bloodGroups = ["+O", "+A", "+B", "+AB", "-O", "-A", "-B", "-AB"];

    // Phone number
    let phoneNumber = "";
    for (let i = 0; i < 10; i++) phoneNumber += Math.floor(rng() * 10);

    // Password
    let password = "";
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%&";
    for (let i = 0; i < 12; i++) password += charset.charAt(Math.floor(rng() * charset.length));

    // Birth date: calculated from age
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = Math.floor(rng() * 12) + 1;
    const birthDay = Math.floor(rng() * 28) + 1;

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

    const result = {
        id: `${id}`,
        fullName: `${firstName} ${middleName} ${lastName}`,
        firstName,
        lastName,
        middleName,
        age,
        gender: getRandom(genderOptions),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailProvider}`,
        phone: `${phoneCode} ${phoneNumber}`,
        username: `${firstName.toLowerCase()}_${id}`,
        password,
        birthDate: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
        bloodGroup: getRandom(bloodGroups),
        height: heightCm,
        weight: weightKg,
        domain: `${firstName.toLowerCase()}${lastName.toLowerCase()}${domain.tlds[0]}`,
        ip,
        macaddress: Array.from({ length: 6 }, () => Math.floor(rng() * 255).toString(16).padStart(2, '0')).join(':').toUpperCase(),
        address: {
            street: `${street.address}`,
            city: state.city,
            state: state.state,
            country: country.name,
            countryCode: country.code,
            zipCode: Math.floor(rng() * 90000) + 10000,
            coordinates: { latitude: lat, longitude: lng }
        },
        demographics,
        education,
        employment,
        financial,
        health,
        social,
        digitalFootprint,
        bank: {
            nameOnCard: `${firstName} ${middleName} ${lastName}`,
            cardNumber: `${cardNumber}`,
            cardType,
            cardExpiry,
            cardCvv: `${cardCvv}`,
        },
        hobbies: userHobbies,
        technology_profile: techProfile,
        persona: persona.type,
        metadata: {
            version: "2.1.0",
            generation_timestamp: new Date().toISOString()
        }
    };

    // Phase 4: Apply locale country override
    if (locale && LOCALE_COUNTRIES[locale]) {
        result.address.country = LOCALE_COUNTRIES[locale].name;
        result.address.countryCode = LOCALE_COUNTRIES[locale].code;
    }

    // Phase 4: Apply schema overrides
    if (schema) {
        return applySchemaOverrides(result, schema);
    }

    return result;
};

// ─── Public API ─────────────────────────────────────────────────────────────
/**
 * Generate a single realistic user profile.
 * @param {object} [options] - Configuration options
 * @param {number} [options.missing_rate=0] - Probability (0-1) that each field is null
 * @param {number} [options.seed] - Random seed for reproducibility
 * @param {object} [options.schema] - Schema constraints { age: {min,max}, gender, ... }
 * @param {string} [options.locale] - Locale code: 'en','in','jp','kr','de','br','ar','fr'
 * @returns {object} User profile
 */
const user = (options = {}) => {
    if (options.seed != null) setSeed(options.seed);
    const u = generateSingleUser(null, options.schema || null, options.locale || null);
    if (options.seed != null) setSeed(null);
    if (options.missing_rate && options.missing_rate > 0) {
        return applyMissingData(u, options.missing_rate);
    }
    return u;
};

/**
 * Generate multiple realistic user profiles.
 * @param {number} count - Number of users to generate
 * @param {object} [options] - Configuration options
 * @param {number} [options.missing_rate=0] - Probability (0-1) that each field is null
 * @param {number} [options.seed] - Random seed for reproducibility
 * @param {object} [options.schema] - Schema constraints
 * @param {string} [options.locale] - Locale code
 * @param {number} [options.anomaly_rate=0] - Fraction of users to inject anomalies into
 * @returns {object[]} Array of user profiles
 */
const users = (count = 10, options = {}) => {
    if (options.seed != null) setSeed(options.seed);
    let result = Array.from({ length: count }, (_, i) => {
        const u = generateSingleUser(i + 1, options.schema || null, options.locale || null);
        if (options.missing_rate && options.missing_rate > 0) {
            return applyMissingData(u, options.missing_rate);
        }
        return u;
    });
    if (options.anomaly_rate && options.anomaly_rate > 0) {
        result = injectAnomalies(result, options.anomaly_rate);
    }
    if (options.seed != null) setSeed(null);
    return result;
};

/**
 * Generate a user with time-series activity data.
 * @param {object} [options] - Same as user() plus:
 * @param {number} [options.days=30] - Number of days of activity
 * @param {number} [options.eventsPerDay=8] - Average events per day
 * @returns {{ user: object, activity: object[] }}
 */
const userTimeSeries = (options = {}) => {
    const u = user(options);
    const activity = generateTimeSeries(u, options.days || 30, options.eventsPerDay || 8);
    return { user: u, activity };
};

/**
 * Generate users and export as CSV string.
 * Nested objects are flattened with dot-separated keys. Arrays are semicolon-joined.
 * @param {number} count - Number of users
 * @param {object} [options] - Same options as users()
 * @returns {string} CSV string with headers
 */
const usersToCSV = (count = 10, options = {}) => {
    const data = users(count, options);
    const flatRows = data.map(u => flattenObject(u));
    const headers = Object.keys(flatRows[0]);
    const csvLines = [
        headers.map(h => `"${h}"`).join(','),
        ...flatRows.map(row =>
            headers.map(h => {
                const val = row[h] != null ? String(row[h]) : '';
                return `"${val.replace(/"/g, '""')}"`;
            }).join(',')
        )
    ];
    return csvLines.join('\n');
};

/**
 * Generate users and export as a formatted JSON string.
 * @param {number} count - Number of users
 * @param {object} [options] - Same options as users()
 * @returns {string} Pretty-printed JSON string
 */
const usersToJSON = (count = 10, options = {}) => {
    return JSON.stringify(users(count, options), null, 2);
};

/**
 * Generate users and export as flat objects (for DataFrame-like usage).
 * @param {number} count - Number of users
 * @param {object} [options] - Same options as users()
 * @returns {object[]} Array of flat objects with dot-separated keys
 */
const usersFlat = (count = 10, options = {}) => {
    return users(count, options).map(u => flattenObject(u));
};

const getEmail = () => {
    const fn = getRandom(firstNames.names);
    const ln = getRandom(lastNames.surnames);
    const domain = getRandom(emails.mails);
    return { email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}` };
};

const getUsername = () => {
    const fn = getRandom(firstNames.names);
    const id = Math.floor(rng() * 10000) + 1;
    return { username: `${fn.toLowerCase()}_${id}` };
};

const getPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%&";
    let password = "";
    for (let i = 0; i < length; i++) password += charset.charAt(Math.floor(rng() * charset.length));
    return { password };
};

const getZipCode = () => ({ zipCode: Math.floor(rng() * 90000) + 10000 });

const getCoordinates = () => ({
    latitude: (rng() * 180 - 90).toFixed(6),
    longitude: (rng() * 360 - 180).toFixed(6)
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
    userTimeSeries,
    usersToCSV,
    usersToJSON,
    usersFlat,
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
