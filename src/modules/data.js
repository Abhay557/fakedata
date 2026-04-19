const path = require('path');

// Helper to load JSON safely
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

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateSingleUser = (idIndex = null) => {
    const firstName = getRandom(firstNames.names);
    const middleName = getRandom(middleNames.father);
    const lastName = getRandom(lastNames.surnames);
    const emailProvider = getRandom(emails.mails);
    const cardType = getRandom(cardData.cards);
    const occupation = getRandom(occupationData.occupations);
    const domain = getRandom(domainData.domains);
    const street = getRandom(streetData.addresses);
    const state = getRandom(stateData.data);

    const id = idIndex || Math.floor(Math.random() * 1000) + 1;
    const age = Math.floor(Math.random() * 20) + 18;
    const cardNumber = Math.floor(Math.random() * 10000000000000000);
    const cardExpiry = `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 10) + 25}`;
    const cardCvv = Math.floor(Math.random() * 1000);
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lng = (Math.random() * 360 - 180).toFixed(6);
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const genderOptions = ["male", "female", "not provided"];
    const bloodGroups = ["+O", "+A", "+B", "+AB", "-O", "-A", "-B", "-AB"];
    const departments = ["PDT Administration", "PDT Marketing", "Transportation", "Shipping", "Human Resources", "Operations", "Inventory", "Sales", "Finance", "Documentation", "Billing", "Control And Credit"];

    let phoneNumber = "";
    for (let i = 0; i < 10; i++) phoneNumber += Math.floor(Math.random() * 10);

    let password = "";
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$";
    for (let i = 0; i < 8; i++) password += charset.charAt(Math.floor(Math.random() * charset.length));

    const birthYear = Math.floor(Math.random() * 40) + 1970;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;

    return {
        id: `${id}`,
        fullName: `${firstName} ${middleName} ${lastName}`,
        firstName,
        lastName: middleName, // Kept for backward compatibility with original code
        middleName: lastName, // Kept for backward compatibility
        age: `${age}`,
        gender: getRandom(genderOptions),
        email: `${firstName.toLowerCase()}@${emailProvider}`,
        phone: `+1 ${phoneNumber}`,
        username: `${firstName.toLowerCase()}${id}`,
        password,
        birthDate: `${birthMonth}/${birthDay}/${birthYear}`,
        bloodGroup: getRandom(bloodGroups),
        height: Math.floor(Math.random() * 100) + 100,
        weight: Math.floor(Math.random() * 50) + 50,
        domain: `${firstName.toLowerCase()}${lastName.toLowerCase()}${domain.tlds}`,
        ip,
        macaddress: Array.from({ length: 6 }, () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0')).join(':').toUpperCase(),
        address: {
            street: `Street ${street.address}`,
            city: state.city,
            state: state.state,
            country: "United States Of America",
            zipCode: Math.floor(Math.random() * 90000) + 10000,
            coordinates: { latitude: lat, longitude: lng }
        },
        university: `${state.city} University`,
        bank: {
            nameOnCard: `${firstName} ${middleName} ${lastName}`,
            cardNumber: `${cardNumber}`,
            cardType,
            cardExpiry,
            cardCvv: `${cardCvv}`,
        },
        occupation: {
            title: occupation,
            salary: `${Math.floor(Math.random() * 45000) + 5000}$`,
            department: getRandom(departments),
        }
    };
};

const user = () => generateSingleUser();

const users = (count = 10) => Array.from({ length: count }, (_, i) => generateSingleUser(i + 1));

const getEmail = () => {
    const fn = getRandom(firstNames.names);
    const ln = getRandom(lastNames.surnames);
    const domain = getRandom(emails.mails);
    return { email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}` };
};

const getUsername = () => {
    const fn = getRandom(firstNames.names);
    const id = Math.floor(Math.random() * 1000) + 1;
    return { username: `${fn.toLowerCase()}${id}` };
};

const getPassword = (length = 8) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$";
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
        zipCode: u.address.zipCode,
        ip: u.ip,
        macaddress: u.macaddress,
        coordinates: u.address.coordinates
    };
};

const resume = (count = 10) => {
    // Basic resume implementation reusing logic
    return Array.from({ length: count }, (_, i) => {
        const u = generateSingleUser(i + 1);
        return {
            ...u,
            education: {
                level: getRandom(["Bachelor's", "Master's", "PhD"]),
                major: getRandom(["Computer Science", "Business", "Marketing"]),
                university: u.university,
                graduationYear: 2020 + Math.floor(Math.random() * 5)
            },
            skills: ["JavaScript", "Node.js", "React"].sort(() => 0.5 - Math.random())
        };
    });
};

const biodata = (count = 10) => {
    return Array.from({ length: count }, (_, i) => {
        const u = generateSingleUser(i + 1);
        return {
            ...u,
            personalityType: getRandom(["INTJ", "ENFP", "ISTP"]),
            favoriteMusic: getRandom(["Rock", "Jazz", "Lofi"])
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
