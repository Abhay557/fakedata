const path = require('path');

const loadData = (file) => require(path.join(__dirname, '../../helpers', file));

const animalData = loadData('animal.json');
const catFactData = loadData('catfact.json');
const dogFactData = loadData('dogfact.json');

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const random = () => {
    const item = getRandom(animalData.animals);
    return { animal: item };
};

const catFact = () => {
    const item = getRandom(catFactData.facts);
    return { fact: item };
};

const dogFact = () => {
    const item = getRandom(dogFactData.facts);
    return { fact: item };
};

module.exports = {
    random,
    catFact,
    dogFact
};
