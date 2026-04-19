const path = require('path');

const loadData = (file) => require(path.join(__dirname, '../../helpers', file));

const quoteData = loadData('animequote.json');
const factData = loadData('animefact.json');

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const quote = () => {
    const item = getRandom(quoteData.quotes);
    return {
        anime: item.anime,
        quote: item.bruh,
        character: item.character,
        id: item.id
    };
};

const quotesByShow = (animeName) => {
    const filtered = quoteData.quotes.filter(q => q.anime.toLowerCase().includes(animeName.toLowerCase()));
    if (filtered.length === 0) return { error: "No quotes found for this anime" };
    const item = getRandom(filtered);
    return {
        anime: item.anime,
        quote: item.bruh,
        character: item.character,
        id: item.id
    };
};

const fact = () => {
    const item = getRandom(factData.facts);
    return {
        question: item.question,
        answers: item.answers
    };
};

module.exports = {
    quote,
    quotesByShow,
    fact
};
