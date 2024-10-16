document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', buscar);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                buscar();
            }
        });
    } else {
        console.error('No se encontraron los elementos de búsqueda');
    }

cargarPokemones();
});

function cargarPokemones() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
        .then(response => response.json())
        .then(data => {
            const promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
            return Promise.all(promises);
        })
        .then(pokemones => {
            pokemones.forEach(pokemon => mostrarResultados(pokemon));
        })
        .catch(error => console.error('Error al cargar la lista de Pokémon:', error));
}

function buscar() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('results');

    if (results) {
        results.innerHTML = ''; // Limpiar resultados previos

        fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon no encontrado');
                }
                return response.json();
            })
            .then(data => {
                mostrarResultados(data);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                const message = document.createElement('p');
                message.className = 'text-danger';
                message.textContent = "No se encontró el Pokémon. Intenta con otro nombre.";
                results.appendChild(message);
            });
    } else {
        console.error('No se encontró el contenedor de resultados');
    }
}

function mostrarResultados(data) {
    const results = document.getElementById('results');

    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.name}">
            <div class="card-body">
                <h5 class="card-title text-capitalize">${data.name}</h5>
                <p class="card-text">Este Pokémon tiene un peso de ${data.weight} y una altura de ${data.height}.</p>
            </div>
            <ul class="list-group list-group-flush">
                ${data.types.map(type => `<li class="list-group-item">Tipo: ${type.type.name}</li>`).join('')}
                <li class="list-group-item">Número en la Pokédex: ${data.id}</li>
            </ul>
        </div>
    `;

    results.appendChild(col);
}

