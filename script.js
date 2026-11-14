let games = [];

// Load game data from the JSON file
fetch("deals.json")
  .then((response) => response.json())
  .then((data) => {
    games = data;

    console.log("Games loaded:", games);

    // Find and display the cheapest game
    const cheapestGame = findCheapestGame(games);

    console.log("Cheapest game:", cheapestGame);
    console.log("Current price:", getCurrentPrice(cheapestGame));

    // Apply the default filters and display games
    applyFilters();
  })
  .catch((error) => {
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
  const discount =
    ((game.normalPrice - game.salePrice) / game.normalPrice) * 100;

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

  return games.filter((game) => {
    return game.title.toLowerCase().includes(search);
  });
}

// Game card rendering
const gamesContainer = document.getElementById("games-container");

function displayGames(games) {
  gamesContainer.innerHTML = "";

  // Display a message when no games match the search
  if (games.length === 0) {
    gamesContainer.innerHTML = `
            <p class="empty-message">
                No games found. Try another search.
            </p>
        `;
    return;
  }

  games.forEach((game) => {
    const gameCard = document.createElement("article");

    gameCard.classList.add("game-card");
    if (["Hollow Knight", "Celeste", "Cuphead"].includes(game.title)) {
      gameCard.classList.add("show-full-art");
    }

    if (game.title === "Hollow Knight") {
      gameCard.classList.add("hollow-knight-card");
    }

    if (game.title === "Celeste") {
      gameCard.classList.add("celeste-card");
    }

    if (game.title === "Cuphead") {
      gameCard.classList.add("cuphead-card");
    }

    const currentPrice = getCurrentPrice(game);

    gameCard.innerHTML = `
    <div class="game-image-wrapper">
        <img
            src="${game.image}"
            alt="${game.title} game artwork"
            class="game-image"
            loading="lazy"
        >
        ${
          isOnSale(game)
            ? `<span class="sale-label">${calculateDiscount(game)}% OFF</span>`
            : ""
        }
    </div>

    <div class="game-info">
        <div class="game-details">
            <div>
                <h2>${game.title}</h2>
                <p class="game-store">${game.store}</p>
            </div>

            <div class="game-pricing">
                ${
                  isOnSale(game)
                    ? `<span class="normal-price">R${game.normalPrice.toFixed(2)}</span>`
                    : ""
                }
                <span class="current-price">R${currentPrice.toFixed(2)}</span>
            </div>
        </div>
    </div>
`;
    gamesContainer.appendChild(gameCard);
  });
}

// Get the search and filter elements
const searchInput = document.getElementById("search-input");
const saleFilter = document.getElementById("sale-filter");

const storeFilter = document.getElementById("store-filter");
const minDiscountFilter = document.getElementById("min-discount-filter");
const sortFilter = document.getElementById("sort-filter");
const resultsCount = document.getElementById("results-count");

const allGamesLink = document.getElementById("all-games-link");
const saleGamesLink = document.getElementById("sale-games-link");
const sidebarToggle = document.getElementById("sidebar-toggle");

// Listen for search input
searchInput.addEventListener("input", applyFilters);

// Listen for filter and sorting changes
storeFilter.addEventListener("change", applyFilters);
minDiscountFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

// Update the active sidebar navigation item
function updateActiveNavigation(section) {
  allGamesLink.classList.toggle("active", section === "all");
  saleGamesLink.classList.toggle("active", section === "sale");
}

// Close the sidebar after selecting an item on mobile
function closeMobileSidebar() {
  if (window.matchMedia("(max-width: 760px)").matches) {
    sidebarToggle.checked = false;
  }
}

// All Games navigation
allGamesLink.addEventListener("click", (event) => {
  event.preventDefault();

  saleFilter.checked = false;

  updateActiveNavigation("all");

  applyFilters();

  closeMobileSidebar();
});

// Sale Games navigation
saleGamesLink.addEventListener("click", () => {
  saleFilter.checked = true;

  updateActiveNavigation("sale");

  applyFilters();

  closeMobileSidebar();
});

// Apply the search and sale filters

function applyFilters() {
  const searchTerm = searchInput.value;
  const selectedStore = storeFilter.value;
  const minimumDiscount = Number(minDiscountFilter.value);
  const selectedSort = sortFilter.value;

  // 1. Search games by title
  let filteredGames = searchGames(games, searchTerm);

  // 2. Apply the Sale Games navigation filter
  if (saleFilter.checked) {
    filteredGames = getGamesOnSale(filteredGames);
  }

  // 3. Filter games by store
  if (selectedStore !== "all") {
    filteredGames = filteredGames.filter((game) => {
      return game.store === selectedStore;
    });
  }

  // 4. Filter games by minimum discount
  if (minimumDiscount > 0) {
    filteredGames = filteredGames.filter((game) => {
      return calculateDiscount(game) >= minimumDiscount;
    });
  }

  // 5. Sort the filtered games
  // Create a copy so we don't change the original games array
  filteredGames = [...filteredGames];

  switch (selectedSort) {
    case "price-asc":
      filteredGames.sort((a, b) => {
        return getCurrentPrice(a) - getCurrentPrice(b);
      });
      break;

    case "price-desc":
      filteredGames.sort((a, b) => {
        return getCurrentPrice(b) - getCurrentPrice(a);
      });
      break;

    case "discount-desc":
      filteredGames.sort((a, b) => {
        return calculateDiscount(b) - calculateDiscount(a);
      });
      break;

    case "name-asc":
      filteredGames.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      break;

    case "featured":
    default:
      // Keep the original JSON order
      break;
  }

  // 6. Update the results count
  resultsCount.textContent = `Showing ${filteredGames.length} of ${games.length} games`;

  // 7. Display the final results
  displayGames(filteredGames);
}
