
let games = [];

// Load game data from the JSON file
fetch("deals.json")
    .then(response => response.json())
    .then(data => {
        games = data;

        console.log("Games loaded:", games);

        // Find and display the cheapest game
        const cheapestGame = findCheapestGame(games);

        console.log("Cheapest game:", cheapestGame);
        console.log("Current price:", getCurrentPrice(cheapestGame));

        // Display all games when the page loads
        displayGames(games);
    })
    .catch(error => {
        console.error("Error loading games:", error);
    });


// Check whether a game is on sale
function isOnSale(game) {
    return game.salePrice < game.normalPrice;
}


// Return only games that are currently on sale
function getGamesOnSale(games) {
    return games.filter(isOnSale);
}


// Calculate the discount percentage
function calculateDiscount(game) {
    const discount = (
        (game.normalPrice - game.salePrice) /
        game.normalPrice
    ) * 100;

    return Math.round(discount);
}


// Get the current price of a game
function getCurrentPrice(game) {
    if (isOnSale(game)) {
        return game.salePrice;
    } else {
        return game.normalPrice;
    }
}


// Find the cheapest game in the list
function findCheapestGame(games) {
    if (games.length === 0) {
        return null;
    }

    return games.reduce((cheapest, currentGame) => {
        if (getCurrentPrice(currentGame) < getCurrentPrice(cheapest)) {
            return currentGame;
        } else {
            return cheapest;
        }
    });
}


// Search games by title
function searchGames(games, searchTerm) {
    const search = searchTerm.toLowerCase().trim();

    return games.filter(game => {
        return game.title.toLowerCase().includes(search);
    });
}


// Game card rendering
const gamesContainer = document.getElementById("games-container");

function displayGames(games) {
    gamesContainer.innerHTML = "";

    // Display a message when no games match the search
    if (games.length === 0) {
        gamesContainer.innerHTML = "<p>No games found. Try another search.</p>";
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement("div");

        gameCard.classList.add("game-card");

        gameCard.innerHTML = `
            <h2>${game.title}</h2>
            <p>Normal Price: R${game.normalPrice}</p>

            ${
                isOnSale(game)
                    ? `
                        <p>Sale Price: R${game.salePrice}</p>
                        <span class="sale-label">ON SALE</span>
                        <p>Discount: ${calculateDiscount(game)}% OFF</p>
                    `
                    : ""
            }
        `;

        gamesContainer.appendChild(gameCard);
    });
}


// Get the search and filter elements
const searchInput = document.getElementById("search-input");
const saleFilter = document.getElementById("sale-filter");


// Listen for user input
searchInput.addEventListener("input", applyFilters);
saleFilter.addEventListener("change", applyFilters);


// Apply the search and sale filters
function applyFilters() {
    const searchTerm = searchInput.value;

    // First, filter games according to the search term
    let filteredGames = searchGames(games, searchTerm);

    // If the sale-only checkbox is selected, show only discounted games
    if (saleFilter.checked) {
        filteredGames = getGamesOnSale(filteredGames);
    }

    // Display the filtered results
    displayGames(filteredGames);
}
