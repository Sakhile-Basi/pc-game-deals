let games = [];
let totalRecords = 0;

// Load game data from the JSON file
async function loadGames() {
  try {
    const response = await fetch("deals.json");

    if (!response.ok) {
      throw new Error("Failed to load game data");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Game data must be an array");
    }

    totalRecords = data.length;

    const validGames = data.filter(isValidGame);

    games = validGames;

    if (validGames.length !== data.length) {
      console.warn("Some game records failed validation.");
    }
  } catch (error) {
    console.error("Error loading games:", error);

    gamesContainer.innerHTML = `
      <p class="empty-message">
        Unable to load games. Please try again later.
      </p>
    `;

    return;
  }

  console.log("Games loaded:", games);

  if (totalRecords === 0) {
    gamesContainer.innerHTML = `
    <p class="empty-message">
      No games are currently available.
    </p>
  `;
    return;
  }

  if (games.length === 0) {
    gamesContainer.innerHTML = `
    <p class="empty-message">
      Game data could not be validated.
    </p>
  `;
    return;
  }

  applyFilters();
}

// Validate the structure of a game object
function isValidGame(game) {
  // Reject null, non-objects and arrays so one bad record can't break loading
  if (game === null || typeof game !== "object" || Array.isArray(game)) {
    return false;
  }

  return (
    Number.isFinite(game.id) &&
    game.id > 0 &&
    typeof game.title === "string" &&
    game.title.trim() !== "" &&
    Number.isFinite(game.normalPrice) &&
    game.normalPrice >= 0 &&
    Number.isFinite(game.salePrice) &&
    game.salePrice >= 0 &&
    game.salePrice <= game.normalPrice &&
    typeof game.store === "string" &&
    game.store.trim() !== "" &&
    typeof game.storeUrl === "string" &&
    game.storeUrl.trim() !== "" &&
    typeof game.image === "string" &&
    game.image.trim() !== ""
  );
}

// Check whether a game is on sale
function isOnSale(game) {
  return game.salePrice < game.normalPrice;
}

// Return only games that are currently on sale
function getGamesOnSale(games) {
  return games.filter(isOnSale);
}

// Calculate the discount percentage accounting for the scenario where the normal price is zero to avoid division by zero errors.
function calculateDiscount(game) {
  if (game.normalPrice === 0) {
    return 0;
  }

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

// Search games by title
function searchGames(games, searchTerm) {
  const search = searchTerm.toLowerCase().trim();

  return games.filter((game) => {
    return game.title.toLowerCase().includes(search);
  });
}

// Update the visibility of the "Clear Filters" button
function updateClearFiltersVisibility() {
  const hasActiveFilters =
    searchInput.value.trim() !== "" ||
    storeFilter.value !== "all" ||
    Number(minDiscountFilter.value) > 0 ||
    saleFilter.checked ||
    sortFilter.value !== "featured";

  clearFiltersButton.hidden = !hasActiveFilters;
}

// Game card rendering
const gamesContainer = document.getElementById("games-container");
const specialGameStyles = {
  "Hollow Knight": ["show-full-art", "hollow-knight-card"],
  Celeste: ["show-full-art", "celeste-card"],
  Cuphead: ["show-full-art", "cuphead-card"],
};

function displayGames(games) {
  gamesContainer.innerHTML = "";

  // Display a message when no games match the search
  if (games.length === 0) {
    const message = document.createElement("p");
    message.classList.add("empty-message");
    message.textContent = "No games found. Try another search.";

    gamesContainer.appendChild(message);
    return;
  }

  games.forEach((game) => {
    const gameCard = document.createElement("article");

    gameCard.classList.add("game-card");

    // Apply special styles for specific games
    const specialClasses = specialGameStyles[game.title] || [];

    gameCard.classList.add(...specialClasses);
    const currentPrice = getCurrentPrice(game);
    const onSale = isOnSale(game);

    // Create the image wrapper
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("game-image-wrapper");

    const image = document.createElement("img");

    image.src = game.image;
    image.alt = `${game.title} game artwork`;
    image.classList.add("game-image");
    image.loading = "lazy";

    imageWrapper.appendChild(image);

    // Display sale label when applicable
    if (onSale) {
      const saleLabel = document.createElement("span");
      saleLabel.classList.add("sale-label");
      saleLabel.textContent = `${calculateDiscount(game)}% OFF`;

      imageWrapper.appendChild(saleLabel);
    }

    // Create game information section
    const gameInfo = document.createElement("div");
    gameInfo.classList.add("game-info");

    const gameDetails = document.createElement("div");
    gameDetails.classList.add("game-details");

    // Create title and store information
    const gameIdentity = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = game.title;

    const store = document.createElement("p");
    store.classList.add("game-store");
    store.textContent = game.store;

    gameIdentity.append(title, store);

    // Create pricing section
    const pricing = document.createElement("div");
    pricing.classList.add("game-pricing");

    if (onSale) {
      const normalPrice = document.createElement("span");
      normalPrice.classList.add("normal-price");
      normalPrice.textContent = `R${game.normalPrice.toFixed(2)}`;

      pricing.appendChild(normalPrice);
    }

    const salePrice = document.createElement("span");
    salePrice.classList.add("current-price");
    salePrice.textContent = `R${currentPrice.toFixed(2)}`;

    pricing.appendChild(salePrice);

    // Create store link
    const storeLink = document.createElement("a");
    let validStoreUrl = false;

    try {
      const parsedUrl = new URL(game.storeUrl);

      if (["https:", "http:"].includes(parsedUrl.protocol)) {
        storeLink.href = parsedUrl.href;
        validStoreUrl = true;
      }
    } catch (error) {
      console.warn(`Invalid store URL for ${game.title}:`, error);
    }
    storeLink.classList.add("store-link");
    storeLink.target = "_blank";
    storeLink.rel = "noopener noreferrer";

    storeLink.append(document.createTextNode(`View on ${game.store} `));

    const linkIcon = document.createElement("span");
    linkIcon.setAttribute("aria-hidden", "true");
    linkIcon.textContent = "↗";

    storeLink.appendChild(linkIcon);

    // Assemble the card
    gameDetails.append(gameIdentity, pricing);

    if (validStoreUrl) {
      gameDetails.appendChild(storeLink);
    }
    gameInfo.appendChild(gameDetails);

    gameCard.append(imageWrapper, gameInfo);

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
const clearFiltersButton = document.getElementById("clear-filters");

const allGamesLink = document.getElementById("all-games-link");
const saleGamesLink = document.getElementById("sale-games-link");
const sidebarToggle = document.getElementById("sidebar-toggle");

// Listen for search input
searchInput.addEventListener("input", applyFilters);

// Listen for filter and sorting changes
storeFilter.addEventListener("change", applyFilters);
minDiscountFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

// Listen for the clear filters button click
clearFiltersButton.addEventListener("click", clearFilters);

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
saleGamesLink.addEventListener("click", (event) => {
  event.preventDefault();

  saleFilter.checked = true;

  updateActiveNavigation("sale");

  applyFilters();

  closeMobileSidebar();
});

// Display currently active filters
function updateActiveFilters() {
  const activeFilters = document.getElementById("active-filters");

  activeFilters.innerHTML = "";

  const filters = [];

  // Active search
  if (searchInput.value.trim() !== "") {
    filters.push(`Search: "${searchInput.value.trim()}"`);
  }

  // Selected store
  if (storeFilter.value !== "all") {
    filters.push(storeFilter.value);
  }

  // discount filter
  if (Number(minDiscountFilter.value) > 0) {
    filters.push(`${minDiscountFilter.value}% discount or more`);
  }

  // Sale-only navigation
  if (saleFilter.checked) {
    filters.push("Sale games");
  }

  // Hide the container when no filters are active
  activeFilters.hidden = filters.length === 0;

  // Create an indicator for each active filter
  filters.forEach((filter) => {
    const chip = document.createElement("span");

    chip.classList.add("active-filter-chip");
    chip.textContent = filter;

    activeFilters.appendChild(chip);
  });
}

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

  // 7. Update active filter indicators
  updateActiveFilters();
  updateClearFiltersVisibility();
  displayGames(filteredGames);
}

// Reset all search, filter and sorting controls
function clearFilters() {
  searchInput.value = "";
  storeFilter.value = "all";
  minDiscountFilter.value = "0";
  sortFilter.value = "featured";

  saleFilter.checked = false;

  updateActiveNavigation("all");

  applyFilters();
}

// Start the app once all DOM references and listeners are set up
loadGames();
