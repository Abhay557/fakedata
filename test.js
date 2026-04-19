const fakedata = require('./src/index');

console.log("--- Testing @abhay557/fakedata Library v1.1.0 ---");

try {
    console.log("\n[1] Testing Atomic Data Module:");
    console.log("Random Email:", fakedata.data.getEmail().email);
    console.log("Random City:", fakedata.data.getCity().city);
    console.log("State Code:", fakedata.data.getStateCode().stateCode);
    console.log("Password (12 char):", fakedata.data.getPassword(12).password);

    console.log("\n[2] Testing Pokemon Module:");
    const poke = fakedata.fun.pokemon();
    console.log(`Pokemon: ${poke.name} | Type: ${poke['Type 1']} | Total Stats: ${poke.Total}`);

    const firePoke = fakedata.fun.pokemonByType('Fire');
    console.log(`Fire Pokemon: ${firePoke.name} | HP: ${firePoke.HP}`);

    console.log("\n[3] Testing Quote Filters:");
    const narutoQuote = fakedata.anime.quotesByShow('Naruto');
    console.log(`Naruto Quote: "${narutoQuote.quote}" - ${narutoQuote.character}`);

    console.log("\n[4] Testing Joke Filters:");
    const devJoke = fakedata.fun.jokesByType('programming');
    console.log(`Dev Joke: ${devJoke.setup}`);

    console.log("\n--- All 1.1.0 Tests Passed Successfully! ---");
} catch (error) {
    console.error("\n--- Tests Failed! ---");
    console.error(error);
    process.exit(1);
}