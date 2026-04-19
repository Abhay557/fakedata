const path = require('path');

const loadData = (file) => require(path.join(__dirname, '../../helpers', file));

const jokeData = loadData('joke.json');
const factData = loadData('fact.json');
const fortuneData = loadData('fortune.json');
const pickupData = loadData('pickup.json');
const quoteData = loadData('quote.json');
const pokemonData = loadData('pokemon.json');

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const joke = () => {
    const item = getRandom(jokeData.jokes);
    return {
        id: item.id,
        type: item.type,
        setup: item.setup,
        punchline: item.punchline
    };
};

const jokesByType = (type) => {
    const filtered = jokeData.jokes.filter(j => j.type.toLowerCase() === type.toLowerCase());
    if (filtered.length === 0) return { error: "No jokes found for this type" };
    const item = getRandom(filtered);
    return {
        id: item.id,
        type: item.type,
        setup: item.setup,
        punchline: item.punchline
    };
};

const fact = () => {
    const item = getRandom(factData.facts);
    return { fact: item };
};

const fortune = () => {
    const item = getRandom(fortuneData.fortunes);
    return { fortune: item };
};

const pickup = () => {
    const item = getRandom(pickupData.pickups);
    return { pickup: item };
};

const quote = () => {
    const item = getRandom(quoteData.quotes);
    return {
        quote: item.quote,
        author: item.author
    };
};

const pokemon = () => {
    const item = getRandom(pokemonData);
    return item;
};

const pokemonByType = (type) => {
    const filtered = pokemonData.filter(p => 
        p['Type 1'].toLowerCase() === type.toLowerCase() || 
        p['Type 2'].toLowerCase() === type.toLowerCase()
    );
    if (filtered.length === 0) return { error: "No pokemon found for this type" };
    return getRandom(filtered);
};

module.exports = {
    joke,
    jokesByType,
    fact,
    fortune,
    pickup,
    quote,
    pokemon,
    pokemonByType
};
