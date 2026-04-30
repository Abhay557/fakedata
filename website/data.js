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

  pokemons: [
    {id:1,name:"Bulbasaur","Type 1":"Grass","Type 2":"Poison",HP:45,Attack:49,Defense:49,Speed:45,Generation:1,Legendary:false},
    {id:4,name:"Charmander","Type 1":"Fire","Type 2":"",HP:39,Attack:52,Defense:43,Speed:65,Generation:1,Legendary:false},
    {id:7,name:"Squirtle","Type 1":"Water","Type 2":"",HP:44,Attack:48,Defense:65,Speed:43,Generation:1,Legendary:false},
    {id:25,name:"Pikachu","Type 1":"Electric","Type 2":"",HP:35,Attack:55,Defense:40,Speed:90,Generation:1,Legendary:false},
    {id:39,name:"Jigglypuff","Type 1":"Normal","Type 2":"Fairy",HP:115,Attack:45,Defense:20,Speed:20,Generation:1,Legendary:false},
    {id:52,name:"Meowth","Type 1":"Normal","Type 2":"",HP:40,Attack:45,Defense:35,Speed:90,Generation:1,Legendary:false},
    {id:94,name:"Gengar","Type 1":"Ghost","Type 2":"Poison",HP:60,Attack:65,Defense:60,Speed:110,Generation:1,Legendary:false},
    {id:131,name:"Lapras","Type 1":"Water","Type 2":"Ice",HP:130,Attack:85,Defense:80,Speed:60,Generation:1,Legendary:false},
    {id:143,name:"Snorlax","Type 1":"Normal","Type 2":"",HP:160,Attack:110,Defense:65,Speed:30,Generation:1,Legendary:false},
    {id:150,name:"Mewtwo","Type 1":"Psychic","Type 2":"",HP:106,Attack:110,Defense:90,Speed:130,Generation:1,Legendary:true},
    {id:152,name:"Chikorita","Type 1":"Grass","Type 2":"",HP:45,Attack:49,Defense:65,Speed:45,Generation:2,Legendary:false},
    {id:155,name:"Cyndaquil","Type 1":"Fire","Type 2":"",HP:39,Attack:52,Defense:43,Speed:65,Generation:2,Legendary:false},
    {id:196,name:"Espeon","Type 1":"Psychic","Type 2":"",HP:65,Attack:65,Defense:60,Speed:110,Generation:2,Legendary:false},
    {id:197,name:"Umbreon","Type 1":"Dark","Type 2":"",HP:95,Attack:65,Defense:110,Speed:65,Generation:2,Legendary:false},
    {id:245,name:"Suicune","Type 1":"Water","Type 2":"",HP:100,Attack:75,Defense:115,Speed:85,Generation:2,Legendary:true},
    {id:248,name:"Tyranitar","Type 1":"Rock","Type 2":"Dark",HP:100,Attack:134,Defense:110,Speed:61,Generation:2,Legendary:false},
    {id:249,name:"Lugia","Type 1":"Psychic","Type 2":"Flying",HP:106,Attack:90,Defense:130,Speed:110,Generation:2,Legendary:true},
    {id:282,name:"Gardevoir","Type 1":"Psychic","Type 2":"Fairy",HP:68,Attack:65,Defense:65,Speed:80,Generation:3,Legendary:false},
    {id:330,name:"Flygon","Type 1":"Dragon","Type 2":"Ground",HP:80,Attack:100,Defense:80,Speed:100,Generation:3,Legendary:false},
    {id:373,name:"Salamence","Type 1":"Dragon","Type 2":"Flying",HP:95,Attack:135,Defense:80,Speed:100,Generation:3,Legendary:false},
    {id:381,name:"Latios","Type 1":"Dragon","Type 2":"Psychic",HP:80,Attack:90,Defense:80,Speed:110,Generation:3,Legendary:true},
    {id:448,name:"Lucario","Type 1":"Fighting","Type 2":"Steel",HP:70,Attack:110,Defense:70,Speed:90,Generation:4,Legendary:false},
    {id:445,name:"Garchomp","Type 1":"Dragon","Type 2":"Ground",HP:108,Attack:130,Defense:95,Speed:102,Generation:4,Legendary:false},
    {id:487,name:"Giratina","Type 1":"Ghost","Type 2":"Dragon",HP:150,Attack:100,Defense:120,Speed:90,Generation:4,Legendary:true},
    {id:495,name:"Snivy","Type 1":"Grass","Type 2":"",HP:45,Attack:45,Defense:55,Speed:63,Generation:5,Legendary:false},
    {id:545,name:"Scolipede","Type 1":"Bug","Type 2":"Poison",HP:60,Attack:100,Defense:89,Speed:112,Generation:5,Legendary:false},
    {id:612,name:"Haxorus","Type 1":"Dragon","Type 2":"",HP:76,Attack:147,Defense:90,Speed:97,Generation:5,Legendary:false},
    {id:658,name:"Greninja","Type 1":"Water","Type 2":"Dark",HP:72,Attack:95,Defense:67,Speed:122,Generation:6,Legendary:false},
    {id:700,name:"Sylveon","Type 1":"Fairy","Type 2":"",HP:95,Attack:65,Defense:65,Speed:60,Generation:6,Legendary:false},
    {id:748,name:"Toxapex","Type 1":"Poison","Type 2":"Water",HP:50,Attack:63,Defense:152,Speed:35,Generation:7,Legendary:false},
    {id:800,name:"Necrozma","Type 1":"Psychic","Type 2":"",HP:97,Attack:107,Defense:101,Speed:79,Generation:7,Legendary:true},
    {id:884,name:"Duraludon","Type 1":"Steel","Type 2":"Dragon",HP:70,Attack:95,Defense:115,Speed:85,Generation:8,Legendary:false},
    {id:888,name:"Zacian","Type 1":"Fairy","Type 2":"",HP:92,Attack:130,Defense:115,Speed:138,Generation:8,Legendary:true},
  ],

  jokes: [
    {id:1,type:"general",setup:"What did the fish say when it hit the wall?",punchline:"Dam."},
    {id:2,type:"general",setup:"How do you make a tissue dance?",punchline:"You put a little boogie on it."},
    {id:3,type:"programming",setup:"What's the best thing about a Boolean?",punchline:"Even if you're wrong, you're only off by a bit."},
    {id:4,type:"programming",setup:"What's the object-oriented way to become wealthy?",punchline:"Inheritance"},
    {id:5,type:"general",setup:"Why can't bicycles stand on their own?",punchline:"They are two tired"},
    {id:6,type:"programming",setup:"A SQL query walks into a bar, walks up to two tables and asks...",punchline:"'Can I join you?'"},
    {id:7,type:"general",setup:"Did you hear about the mushroom who got invited to the party?",punchline:"Because he was a fungi."},
    {id:8,type:"programming",setup:"Why do Java programmers wear glasses?",punchline:"Because they don't C#"},
    {id:9,type:"general",setup:"What do you call sad coffee?",punchline:"Despresso."},
    {id:10,type:"programming",setup:"A user interface is like a joke.",punchline:"If you have to explain it, it's not that good."},
    {id:11,type:"programming",setup:"Why did the programmer quit his job?",punchline:"Because he didn't get arrays."},
    {id:12,type:"general",setup:"I'm reading a book about anti-gravity...",punchline:"It's impossible to put down"},
    {id:13,type:"general",setup:"Can February march?",punchline:"No, but April may."},
    {id:14,type:"programming",setup:"There are 10 types of people in this world...",punchline:"Those who understand binary and those who don't"},
    {id:15,type:"general",setup:"What kind of shoes does a thief wear?",punchline:"Sneakers"},
    {id:16,type:"general",setup:"What do you call a factory that sells passable products?",punchline:"A satisfactory"},
    {id:17,type:"programming",setup:"I was gonna tell you a joke about UDP...",punchline:"...but you might not get it."},
    {id:18,type:"general",setup:"Why is Peter Pan always flying?",punchline:"Because he neverlands"},
    {id:19,type:"general",setup:"What do you call a belt made out of watches?",punchline:"A waist of time."},
    {id:20,type:"programming",setup:"How do you check if a webpage is HTML5?",punchline:"Try it out on Internet Explorer"},
  ],

  animeQuotes: [
    {quote:"Humans constantly feel pain in their hearts. Because the heart is so sensitive to pain, humans also feel that to live is to suffer.",character:"Kaworu Nagisa",anime:"Neon Genesis Evangelion"},
    {quote:"I learned that no matter how much you want something, no matter how much you scream for it, sometimes it's out of your reach.",character:"Takashi Natsume",anime:"Natsume Yuujinchou"},
    {quote:"We can only live while we lose.",character:"Renji Yomo",anime:"Tokyo Ghoul"},
    {quote:"Life hurts, you think we don't know that? But some of us choose to go on regardless.",character:"Ganta Igarashi",anime:"Deadman Wonderland"},
    {quote:"Pride is not the opposite of shame, but its source. True humility is the only antidote to shame.",character:"Uncle Iroh",anime:"Avatar: The Last Airbender"},
    {quote:"Getting dumped always makes a man stronger. But then again, men aren't meant to pursue happiness.",character:"Jiraiya",anime:"Naruto"},
    {quote:"Love provides the worth of everything in the world. Without love, gold, silver, horses, and women are all worthless.",character:"Father Willibald",anime:"Vinland Saga"},
    {quote:"I am who I am now because of everything that's happened. If I try to deny my past, I'm denying the person I've become.",character:"Iori Nagase",anime:"Kokoro Connect"},
    {quote:"I would rather be a brainless monkey than a heartless monster.",character:"Son Goku",anime:"Dragon Ball"},
    {quote:"Even in the darkness, I'm sure it's reassuring to have someone there to walk with you.",character:"Noe Isurugi",anime:"True Tears"},
    {quote:"Therefore let me inform you... All of your dreams are to be thrown away.",character:"Ulquiorra Schiffer",anime:"Bleach"},
    {quote:"Don't kid yourself, Mustang. You know how humans love to watch other people suffer.",character:"Envy",anime:"Fullmetal Alchemist"},
    {quote:"Murder doesn't necessarily mean evil, right? The world being what it is, a lot of people out there deserve to die.",character:"Genjo Sanzo",anime:"Saiyuki"},
    {quote:"Family is other people. No matter how close your blood relationship is, anyone other than you is not you!",character:"Yuuko Ichihara",anime:"xxxHOLiC"},
    {quote:"Death by sword. Death by broken bones. Death by crushing. There's not much difference, right? You die at the end.",character:"Ainz Ooal Gown",anime:"Overlord"},
    {quote:"You came into my life as a story, you left as a legend.",character:"Reborn",anime:"Katekyo Hitman Reborn!"},
    {quote:"In the world of sports, quickness doesn't necessarily mean having the fastest time.",character:"Midorima Shintarou",anime:"Kuroko No Basket"},
  ],

  animals: ["Aardvark","Albatross","Alligator","Alpaca","Ant","Anteater","Antelope","Ape","Armadillo","Baboon","Badger","Bear","Beaver","Bee","Bison","Buffalo","Butterfly","Camel","Capybara","Cheetah","Cobra","Coyote","Crocodile","Deer","Dolphin","Eagle","Elephant","Falcon","Fox","Frog","Giraffe","Gorilla","Hawk","Hippopotamus","Horse","Jaguar","Jellyfish","Kangaroo","Koala","Lion","Lobster","Monkey","Moose","Narwhal","Octopus","Owl","Panther","Penguin","Rhinoceros","Shark","Tiger","Whale","Wolf","Zebra"],

  cardTypes: ["Visa","Mastercard","American Express","Discover"],
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
    email: `${first.toLowerCase()}.${last.toLowerCase()}${num}@${rnd(FD.emails)}`,
    phone: `+1 (${rndStr(3)}) ${rndStr(3)}-${rndStr(4)}`,
    address: {
      street: `${rndNum(100,9999)} ${rnd(FD.streets)}`,
      city:   rnd(FD.cities),
      zip:    rndStr(5),
    },
    job: {
      title:   rnd(FD.jobs),
      company: rnd(FD.companies),
    },
    creditCard: {
      type:   rnd(FD.cardTypes),
      number: `${rndStr(4)} ${rndStr(4)} ${rndStr(4)} ${rndStr(4)}`,
      expiry: `${String(rndNum(1,12)).padStart(2,'0')}/${rndNum(25,30)}`,
      cvv:    rndStr(3),
    }
  };
};

window.generatePokemon = function() { return {...rnd(FD.pokemons)}; };
window.generateJoke    = function() { return {...rnd(FD.jokes)}; };
window.generateAnime   = function() { return {...rnd(FD.animeQuotes)}; };
window.generateAnimal  = function() { return { animal: rnd(FD.animals) }; };
