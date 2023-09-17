const pokemonListElement = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 5;
let offset = 0;

const hideDetails = (detailSectionElement, pokemonType) => {
    setTimeout(() => {
        detailSectionElement.innerHTML = "";
    }, 500);
    detailSectionElement.classList.toggle("show");
    detailSectionElement.classList.toggle(pokemonType);
}

const showDetails = (pokemonId) => {
    pokeApi.getPokemonById(pokemonId).then(pokemon => {
        const detailSection = document.getElementById("pokeDetailSection");

        const stats = `<div class="stats">
            ${pokemon.stats.map(statObj => `
                <p>${statObj.stat.name}</p>
                <span>${statObj.base_stat}</span>
            `).join("")}
        </div>`;

        const moves = `<div class="moves">
            ${pokemon.moves.map(moveObj => `
                    <p>${moveObj.move.name}</p>
            `).join("")}
        </div>`;

        const content = `
        <article class="detail-header">
            <div class="actions">
                <button id="goBackBtn" type="button" title="go back">&#10006;</button>
            </div>
            <div id="detailTitle" class="title">
                <div class="top">
                    <h2>${pokemon.name}</h2>
                    <span># ${pokemon.number}</span>
                </div>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join("")}
                    </ol>
                </div>
            </div>
            <div id="detailPhoto" class="photo">
                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </article>
        <article class="detail-content">
            <ul class="tabs">
                <li class="tab-option">
                    Base stats
                    <span class="divider active"></span>
                </li>
                <li class="tab-option">
                    Moves
                    <span class="divider"></span>
                </li>
            </ul>


            <div id="tabContent" class="tab-content">
                ${stats}
            </div>
        </article>
    `;
        detailSection.innerHTML = content;
        detailSection.classList.toggle(pokemon.type);
        detailSection.classList.toggle("show");
        const goBackButton = document.getElementById("goBackBtn");
        goBackButton.addEventListener("click", () => {
            hideDetails(detailSection, pokemon.type);
        });
        const tabOptions = [...document.getElementsByClassName("tab-option")];
        tabOptions.forEach(element => {
            element.addEventListener("click", () => {
                tabOptions.forEach(tab => tab.lastElementChild.classList.remove("active"));
                element.lastElementChild.classList.toggle("active");
                if (element.textContent.includes("Base stats")) {
                    changeTabView(stats);
                } else {
                    changeTabView(moves);
                }
            })
        })
    })
}

const changeTabView = (content) => {
    const tabContent = document.getElementById("tabContent");
    tabContent.innerHTML = content;
}

const loadPokemonItens = (offset, limit) => {
    pokeApi.getPokemons(offset, limit).then((pokemonList = []) => {
        const newHtml = pokemonList.map(pokemon => `
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types"> 
                        ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join("")}
                    </ol>
                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
    `).join("");
        pokemonListElement.innerHTML += newHtml;
        document.querySelectorAll(`.pokemon`).forEach(element => {
            element.addEventListener("click", () => {
                showDetails(element.firstElementChild.textContent.split("#")[1])
            });
        })
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const records = offset + limit;
    if (records >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
})