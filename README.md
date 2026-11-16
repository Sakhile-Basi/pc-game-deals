# PC Game Deals

A responsive PC game deals discovery website built with HTML, CSS and vanilla JavaScript. The application allows users to browse game deals, search by title, combine filters and sort results to find games that match their preferences.

Originally developed for the Silvertree Education Developer Accelerator Programme (DAP) Entry Assessment, the project has since been extended with additional functionality, reliability improvements and accessibility refinements.

## Features

### Game discovery

- Browse a collection of PC games displayed in responsive cards.

- View game titles, stores, current prices and original prices.

- Identify discounted games through sale labels and discount percentages.

- Follow external links to the relevant game store.

### Search and filtering

- Search games by title using case-insensitive, partial matching.

- Filter games to display sale items only.

- Filter by game store.

- Set a minimum discount percentage.

- Combine multiple filters to narrow down results.

- Display active filters as chips.

- Clear all active filters with one action.

- Navigate between all games and sale games.

### Sorting

- Featured order.

- Price: lowest to highest.

- Price: highest to lowest.

- Discount percentage: highest to lowest.

- Alphabetical order.

### Reliability and accessibility

- Validate game records before displaying them.

- Handle failed data requests and invalid JSON data.

- Prevent invalid store URLs from becoming clickable links.

- Use DOM methods and textContent when creating game cards and filter controls.

- Provide alternative text for game images.

- Support keyboard navigation and visible focus indicators.

- Use ARIA attributes to communicate dynamic updates to assistive technologies.

- Respect reduced-motion preferences.

- Provide feedback when no games match the selected filters.

## Technology Stack

- **HTML5** – Application structure and semantic markup.

- **CSS3** – Responsive layouts, styling, transitions and accessibility-focused states.

- **JavaScript (Vanilla)** – Data loading, validation, filtering, sorting and DOM manipulation.

- **JSON** – Local game data storage.

- No frontend framework or external game-price API is currently used.

## Project Structure

```text
pc-games-deals-website/
│
├── index.html          # Main application structure
├── style.css           # Styling and responsive layouts
├── script.js           # Application logic
├── deals.json          # Game data
│
├── README.md
└── images/
    ├── hollow-knight.jpg
    ├── stardew-valley.jpg
    ├── celeste.jpg
    ├── hades.jpg
    ├── portal-2.jpg
    ├── terraria.jpg
    ├── disco-elysium.jpg
    └── cuphead.jpg
```

## Requirements


-   A modern web browser.

- Visual Studio Code or another code editor.

- A local development server, such as the VS Code Live Server extension.

## Running the application

1.  git clone https://github.com/Sakhile-Basi/pc-game-deals.git

2.  Open the project folder in Visual Studio Code.

3.  Launch `index.html` using Live Server.

4.  The application should open in your browser.


A local server is recommended because the application loads its game data asynchronously using `fetch()`.

## How It Works

### Data management

Game information is stored in deals.json. Each game record contains:

- A unique ID.

- Game title.

- Normal price.

- Current sale price.

- Store name.

- Store URL.

- Image path.

JavaScript retrieves the JSON data using the Fetch API, validates the records and uses the valid entries to populate the application.

Invalid records are excluded so that a single malformed entry does not prevent other valid games from being displayed.

### Filtering and sorting

The application maintains the loaded game collection and applies the selected search query and filters to determine which games should be displayed.

Sorting is applied to the filtered results, allowing users to change the order without losing their selected filters.

The results count and active filter indicators update as the user interacts with the controls.

### Price and discount calculations

Discount percentages are calculated using the normal price and current sale price.

The displayed current price takes precedence when determining the price shown to the user. Original prices are displayed separately where applicable.

**Note:** The game prices are locally stored sample data, not live prices retrieved from digital storefronts. Actual prices and availability may change.

## Key Development Considerations

Some of the main areas addressed during development include:

- Separating data retrieval, validation, filtering and rendering responsibilities.

- Handling unsuccessful HTTP responses and malformed data.

- Using `textContent` instead of inserting untrusted values through HTML strings.

- Validating external URLs before creating store links.

- Making filtering and sorting work together consistently.

- Designing responsive layouts for different screen sizes.

- Improving keyboard accessibility and screen-reader feedback.

## Testing

The application has been manually tested for:

- Successful game data loading.

- Invalid and incomplete game records.

- Search and combined filtering.

- Sorting and filter reset behaviour.

- Empty search results.

- Valid and invalid store URLs.

- Broken game images and alternative text.

- Responsive behaviour across different screen sizes.

- Keyboard navigation through sidebar links and visible focus indicators.

## Learning and Development

This project provided practical experience with:

*   Asynchronous JavaScript and the Fetch API.

- Working with JSON data.

- Input validation and error handling.

- Accessibility principles.

- Git branching, commits and feature-based development.


AI tools were used as supporting resources for learning, debugging and reviewing implementation decisions. They were not treated as a replacement for understanding the code. Implementation choices were reviewed and tested throughout development.

## Future Improvements

Potential future enhancements include but are not limited to:

- Integrating a live game-price API.

- Comparing prices across multiple digital storefronts.

- Tracking historical price changes.

- Adding more advanced game discovery options.

## Project Background

The initial version was created as part of the Silvertree Education Developer Accelerator Programme (DAP) Entry Assessment.

The current repository includes additional improvements developed beyond the original assessment scope, with a focus on building a more complete, maintainable and accessible application.

**Author:** Sakhile Basi

**GitHub:** [Sakhile-Basi](https://github.com/Sakhile-Basi)

**Repository:** [PC Game Deals](https://github.com/Sakhile-Basi/pc-game-deals)
