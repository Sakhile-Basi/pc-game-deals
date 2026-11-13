# PC Game Deals

A simple, responsive website that displays PC game prices and discounts using JavaScript and a local JSON dataset.

The project was developed as part of the Silvertree Education Developer Accelerator Programme (DAP) Entry Assessment.

## Features

- Displays a collection of PC games and their normal prices.
- Identifies games that are currently on sale.
- Calculates and displays discount percentages.
- Finds the cheapest game based on its current price.
- Supports case-insensitive game title searches.
- Includes a sale-only filter.
- Combines search and filtering functionality.
- Displays a message when no games match the selected search or filter.
- Uses a responsive layout for different screen sizes.

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JavaScript)
- JSON

No external JavaScript frameworks or libraries are required.

## Project Structure

```text
pc-games-deals-website/
│
├── deals.json     # Game data
├── index.html     # Website structure
├── style.css      # Website styling
├── script.js      # Application logic
└── README.md      # Project documentation
```

## How to Run the Project

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Open `index.html`.
5. Right-click inside the HTML file and select **Open with Live Server**.
6. The website should open in your browser.

A local development server is recommended because the application uses JavaScript's `fetch()` function to load data from `deals.json`.

## How It Works

The game information is stored separately in `deals.json`.

JavaScript retrieves the data using the Fetch API and uses reusable functions to process and display the information.

The application determines whether a game is on sale by comparing its normal price with its sale price.

The current price is used when determining which game is the cheapest.

The search functionality filters games according to their titles, while the sale-only checkbox limits the displayed results to discounted games.

The webpage updates dynamically based on the user's input without requiring a page refresh.

## Assumptions

The following assumptions were made when developing the application:

1. A game is considered on sale when its sale price is lower than its normal price.
2. Games that are not discounted do not display a sale price, sale label or discount percentage.
3. Discount percentages are rounded to the nearest whole number.
4. The cheapest game is determined using its current price, meaning its sale price when discounted and its normal price otherwise.
5. Search functionality uses partial title matching and ignores capitalisation.
6. Prices are displayed in South African Rand (R).
7. Game information is provided through a local JSON file rather than a live external API.
8. If multiple games have the same lowest price, the first matching game in the dataset is returned.

## Challenges and Learning

One of the main learning opportunities during this project was working with JSON data in a practical application.

Although JSON had been introduced in coursework, this project provided an opportunity to use it to store, retrieve and display data dynamically.

The search and filtering concepts were familiar from previous development experience, but implementing them in JavaScript helped strengthen my understanding of array methods and event handling.

AI tools were used as a collaborative learning and debugging resource. They helped me understand unfamiliar concepts, test my understanding of the code and troubleshoot errors rather than simply generating a complete solution.

The project took approximately 2.5 hours to complete, spread over two days.

## Possible Future Improvements

Given more development time, I would consider:

- Integrating the CheapShark API to retrieve real-time game deals.
- Comparing prices across different digital game stores.
- Adding sorting options, such as price and discount percentage.
- Adding more advanced search and filtering options.
- Introducing price history and price-drop notifications.
- Improving the visual presentation with additional game information and imagery.

---

**Project:** PC Game Deals  
**Assessment:** Silvertree Education Developer Accelerator Programme (DAP) Entry Assessment
