# 15 Puzzle!

## Project Overview

The 15 Puzzle is an interactive sliding puzzle web application where users rearrange image tiles into the correct order by sliding tiles into an empty space. The application includes multiple difficulty modes, gameplay features such as hints and timers, and a leaderboard system that records player performance.

The project was developed using HTML, CSS, JavaScript, PHP, and MariaDB. The frontend handles the game interface and user interaction, while PHP provides server-side communication between the website and the database for storing and retrieving leaderboard scores.

---

## Technologies Used

* HTML5
* CSS3
* JavaScript
* PHP
* MariaDB/MySQL

No external frameworks or libraries were used. The project was built using standard web technologies to demonstrate frontend development, responsive design, client-server communication, database persistence, and interactive game logic.

---

## Project Structure

```text
src/
├── assets/
│   ├── easy.png
│   ├── regular.png
│   └── hard.png
│
├── index.html
├── leaderboard.html
├── styles.css
├── logic.js
├── api.php
└── README.md
```

---

## Directory Descriptions

### assets/

Contains the images used for the puzzle tiles. Each difficulty mode uses a separate image that is dynamically loaded by JavaScript.

Files include:

* `easy.png` - Image used for Easy mode.
* `regular.png` - Image used for Regular mode.
* `hard.png` - Image used for Hard mode.

---

### index.html

The main page of the application. This contains the primary game interface, including the puzzle board, difficulty selection, controls, instructions, and game information.

Features:

* Puzzle game interface
* Difficulty mode selection
* Timer and move counter
* Shuffle, reset, pause, and hint controls
* How to Play section
* 15 Puzzle history and information section
* Win completion screen

---

### leaderboard.html

Contains the leaderboard display page. Scores are retrieved from the database through the PHP API and dynamically displayed using JavaScript.

Features:

* Player rankings
* Player names
* Difficulty mode
* Move count
* Solve time
* Database-backed score retrieval

---

### styles.css

Contains all styling for the website. This includes layout, colors, buttons, puzzle appearance, animations, responsive behavior, and leaderboard styling.

Features:

* Responsive layouts for desktop, tablet, and mobile devices
* Puzzle board styling
* Navigation and button design
* Modal windows
* Leaderboard formatting
* Visual feedback for hints and correct tile placement

---

### logic.js

Contains the main JavaScript game logic. This file controls all interactive functionality of the puzzle.

Features:

* Dynamic puzzle board generation
* Tile movement logic
* Mouse and keyboard controls
* Puzzle shuffling
* Timer functionality
* Move tracking
* Hint system
* Difficulty-specific features
* Win detection
* Leaderboard communication

The game supports three modes:

* **Easy:** Includes hints and correct tile placement feedback.
* **Regular:** Includes limited hints without tile placement feedback.
* **Hard:** Removes hints and placement assistance.

---

### api.php

Handles communication between JavaScript and the MariaDB database.

The API supports:

* Saving completed puzzle scores.
* Retrieving leaderboard data.
* Validating incoming requests.
* Safely inserting data using prepared SQL statements.

---

## Gameplay Features

### Sliding Puzzle System

The core gameplay is based on the classic 15 Puzzle design. Players move tiles into the empty space until the image is restored.

Features:

* Click/touch tile movement
* Keyboard arrow controls
* Randomized but solvable shuffling
* Move counter
* Completion detection

---

### Difficulty Modes

The game includes three difficulty modes that modify the available assistance features.

### Easy Mode

Provides the most assistance.

Features:

* Five available hints
* Five second hint cooldown
* Correct tile placement highlighting

### Regular Mode

Provides moderate assistance.

Features:

* Three available hints
* Fifteen second hint cooldown
* No correct placement feedback

### Hard Mode

Provides the most challenging experience.

Features:

* No hints
* No correct placement feedback

---

## Leaderboard System

The leaderboard system stores player results using MariaDB.

When a player completes the puzzle:

1. JavaScript collects the player's name, difficulty, move count, and solve time.
2. The data is sent to `api.php` using a POST request.
3. PHP validates the data and inserts it into the leaderboard database table.
4. The leaderboard page retrieves saved scores through a GET request.
5. JavaScript formats and displays the results.

Leaderboard rankings are sorted by:

1. Fastest solve time
2. Lowest number of moves
3. Difficulty as a final tiebreaker

Players who do not enter a name are automatically saved as "Anonymous".

---

## Responsive Design Strategy

The website was designed to remain usable across desktop, tablet, and mobile devices.

Responsive techniques include:

* Flexible content containers.
* CSS media queries for different screen sizes.
* Stacked navigation and controls on mobile devices.
* Larger touch-friendly buttons on smaller screens.
* Adjustable puzzle board sizing.
* Layout changes to maintain readability and usability.

The game supports both mouse/touch interaction and keyboard controls to provide flexibility across different devices.

---

## Design Decisions

### Visual Theme

The application uses a bright color palette inspired by beach and puzzle themes. A gradient background, rounded containers, borders, and button animations were used to create a more engaging and interactive experience.

### Multiple Control Methods

Both mouse/touch controls and keyboard arrow controls were implemented because they support different user preferences.

Click and touch controls are easier for new players to understand, while keyboard controls provide faster and more precise movement for experienced users.

### Difficulty-Based Assistance

The hint system was designed to provide different levels of challenge while keeping the game accessible.

Easy mode provides additional guidance, while Hard mode removes assistance for experienced players.

---

## Installation and Running the Project

1. Place the project folder inside a PHP-enabled web server environment such as XAMPP or WAMP.

2. Start Apache and MariaDB/MySQL services.

3. Configure the database connection information in `api.php`.

4. Create the leaderboard table in MariaDB.

5. Navigate to:

```text
http://localhost/project-folder-name/src/
```

6. Open `index.html` to access the game.

---

## Future Improvements

Potential future enhancements include:

* User accounts and saved profiles
* Additional puzzle sizes
* More image themes
* Improved hint algorithms
* Achievement system
* Multiplayer or challenge modes
* Expanded leaderboard filtering
* Additional accessibility improvements

---

## AI Usage Disclosure

Artificial intelligence tools were used during the development process to assist with:

* Brainstorming feature ideas
* Debugging and troubleshooting code
* Reviewing logic and identifying errors
* Generating documentation templates
* Improving code organization and readability

Artificial intelligence tools were NOT used to:

* Generate the entire project
* Generate implementation decisions
* Create the original project structure
* Generate the images used in the application

All generated suggestions were reviewed, modified, tested, and integrated manually. Final implementation, testing, and project integration were completed by the developer.
