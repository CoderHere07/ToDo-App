# TODO-App

> A lightweight, modular, and responsive task management application built entirely with HTML, CSS, and Vanilla JavaScript.

## Features

- **Add Tasks**: Create new tasks with a title, priority level (low, medium, high), and an optional due date.
- **Task Management**: Mark tasks as done (visually indicated with a strikethrough and reduced opacity) or delete them.
- **Overdue Indicator**: Tasks that are past their due date are clearly marked as **Overdue** in red text.
- **Search**: Quickly find tasks by title using the debounced search bar.
- **Filters**: View tasks by their status using filters: **All**, **Active**, and **Done**.
- **Statistics**: Keep track of your progress with real-time stats showing total tasks, completed tasks, and high-priority pending tasks.
- **Persistent Storage**: Tasks are automatically saved to the browser's Local Storage, ensuring your data remains even after you refresh or close the page.

## Project Structure

The project follows a modular JavaScript architecture to separate concerns and keep the code organized:

- `index.html`: The main HTML structure of the application.
- `style.css`: The styling for the app, including responsive design and visual cues for tasks.
- `javascript/`
  - `main.js`: The core application logic, event listeners, and DOM rendering.
  - `Todo.js`: Defines the `Todo` class model containing task properties and methods.
  - `storage.js`: Handles saving and loading tasks from Local Storage.
  - `validators.js`: Validates input data when creating new tasks.
  - `utils.js`: Contains utility functions, such as the `debounce` function for the search feature.

## How to Run

This is a static frontend application and does not require any backend or build steps.

1. Clone or download the repository.
2. Open the `index.html` file in any modern web browser.
   - Alternatively, you can serve the directory using a simple local HTTP server (e.g., using VS Code Live Server, or Python's `python -m http.server`).

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6 Modules)
