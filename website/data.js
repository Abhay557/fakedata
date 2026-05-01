// ──────────────────────────────────────────────
//  Embedded Dataset (sampled from real JSON files)
//  Used for client-side live demo on the website
// ──────────────────────────────────────────────

const FD = {

  firstNames: ["Katherine","Emma","Liam","Olivia","Noah","Ava","William","Sophia","James","Isabella","Oliver","Mia","Benjamin","Charlotte","Elijah","Amelia","Lucas","Harper","Mason","Evelyn","Logan","Abigail","Alexander","Emily","Ethan","Elizabeth","Jacob","Mila","Michael","Ella","Daniel","Avery","Henry","Sofia","Jackson","Camila","Sebastian","Aria","Aiden","Scarlett","Matthew","Victoria","Samuel","Madison","David","Luna","Joseph","Grace","Carter","Chloe"],

  lastNames: ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"],

  cities: ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","San Jose","Austin","Jacksonville","Fort Worth","Columbus","San Francisco","Charlotte","Indianapolis","Seattle","Denver","Washington","Nashville","Oklahoma City","El Paso","Boston","Portland","Las Vegas","Memphis","Louisville","Baltimore","Milwaukee","Albuquerque","Tucson","Fresno","Sacramento","Mesa"],

  emails: ["gmail.com","yahoo.com","hotmail.com","outlook.com","mail.com","protonmail.com","icloud.com","zoho.com","aol.com"],

  jobs: ["Software Engineer","Product Manager","Data Scientist","UX Designer","Marketing Manager","Sales Representative","Financial Analyst","DevOps Engineer","Machine Learning Engineer","Frontend Developer","Backend Developer","Full Stack Developer","QA Engineer","Business Analyst","Project Manager","Cybersecurity Analyst","Database Administrator","Systems Architect","Cloud Engineer","Technical Writer"],

  companies: ["TechCorp Inc","NovaSolutions","DataBridge LLC","CloudStack","InnovateTech","ByteWorks","ClearSky Systems","ApexDigital","NexGen Labs","Fusion Analytics","StratumAI","PlatformX","DeepLogic","GridSystems","SkylineIO"],

  streets: ["Oak Avenue","Maple Street","Cedar Lane","Pine Road","Elm Court","Birch Boulevard","Willow Way","Cherry Street","Dogwood Drive","Magnolia Circle","Sycamore Place","Walnut Avenue","Ash Street","Poplar Lane","Hickory Drive"],

  locales: {
    jp: { first: ["Haruto", "Yuto", "Sota", "Yui", "Rio", "Mei"], last: ["Sato", "Suzuki", "Takahashi", "Tanaka"] },
    in: { first: ["Aarav", "Vivaan", "Aditya", "Diya", "Aanya", "Priya"], last: ["Sharma", "Patel", "Singh", "Kumar"] }
  }
};

// ── Generator Functions ──────────────────────
function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndStr(len, chars='0123456789') { return Array.from({length:len}, ()=>chars[Math.floor(Math.random()*chars.length)]).join(''); }

window.generateUser = function() {
  const first = rnd(FD.firstNames);
  const last  = rnd(FD.lastNames);
  const num   = rndNum(10,99);
  return {
    fullName: `${first} ${last}`,
    age: rndNum(18, 65),
    email: `${first.toLowerCase()}.${last.toLowerCase()}${num}@${rnd(FD.emails)}`,
    phone: `+1 (${rndStr(3)}) ${rndStr(3)}-${rndStr(4)}`,
    address: {
      street: `${rndNum(100,9999)} ${rnd(FD.streets)}`,
      city:   rnd(FD.cities),
      country: "United States"
    },
    job: {
      title:   rnd(FD.jobs),
      company: rnd(FD.companies),
      income: rndNum(45000, 150000)
    }
  };
};

window.generateLocaleUser = function() {
  const loc = rnd(["jp", "in"]);
  const first = rnd(FD.locales[loc].first);
  const last = rnd(FD.locales[loc].last);
  return {
    locale: loc.toUpperCase(),
    fullName: `${first} ${last}`,
    phone: (loc === "jp" ? "+81 " : "+91 ") + rndStr(10),
    address: {
      city: loc === "jp" ? "Tokyo" : "Mumbai",
      country: loc === "jp" ? "Japan" : "India"
    }
  };
};

window.generateTimeSeries = function() {
  const events = [];
  const types = ['login', 'page_view', 'purchase', 'search', 'click', 'logout'];
  for (let i = 0; i < 5; i++) {
    const type = rnd(types);
    const event = {
      timestamp: `2026-05-0${i+1}T${rndNum(10,23)}:${rndStr(2)}:00Z`,
      type: type,
      device: rnd(["desktop", "mobile"]),
      success: true
    };
    if (type === 'purchase') event.amount = rndNum(10, 200) + .99;
    if (type === 'search') event.query = rnd(["shoes", "laptop", "watch"]);
    events.push(event);
  }
  return {
    user: "ID-" + rndStr(8),
    activity: events
  };
};

window.generateAnomaly = function() {
  const user = window.generateUser();
  const types = ["income_spike", "velocity_attack", "geo_impossible"];
  const anomType = rnd(types);
  
  user._anomaly = { isAnomaly: true, type: anomType };
  
  if (anomType === "income_spike") user.job.income = rndNum(500000, 2000000);
  if (anomType === "geo_impossible") {
    user.address.city = "Unknown";
    user.address.country = "Unknown";
    user.ip = "0.0.0.0";
  }
  if (anomType === "velocity_attack") {
    user.sessionsToday = rndNum(10000, 50000);
  }
  
  return user;
};
