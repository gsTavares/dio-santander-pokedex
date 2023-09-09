const pokeApi = {
    getPokemonDetail: async (pokemon) => {
        return fetch(pokemon.url)
            .then((response) => response.json());
    },

    getPokemons: async (offset = 0, limit = 5) => {
        const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
        return fetch(url)
            .then((response) => response.json())
            .then((jsonBody) => jsonBody.results)
            .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
            .then((detailRequests) => Promise.all(detailRequests))
            .then((pokemonsDetails) => pokemonsDetails)
            .catch((error) => console.error(error));
    }
}