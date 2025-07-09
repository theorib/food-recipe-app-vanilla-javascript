# Food Recipe App - Vanilla Javascript (Forkify)

A vanilla javascript Single Page Application (SPA) that allows users to search, bookmark and upload food recipes.

## Live Demo

[Check the live demo hosted on Netlify](https://food-recipe-app-vanilla-javascript.netlify.app)

|   ![App dashboard](/screenshots/Screenshot-1.jpg 'App dashboard')   |            ![Bookings Page](/screenshots/Screenshot-4.jpg 'Bookings Page')            |
| :-----------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
| ![Creating cabins](/screenshots/Screenshot-2.jpg 'Creating cabins') | ![Sales graph in dark mode](/screenshots/Screenshot-3.jpg 'Sales graph in dark mode') |

## App Description

This is a recipe app that allows users to:

- Search for recipes or ingredients
- Create and upload their own recipes
- See recipe cooking time, servings and ingredients
- Change the number of servings and immediately see updated ingredients and quantities
- Bookmark favorite recipes
- View their own recipes and bookmarks on demand (saved on their browser's local storage)

## Features

The app follows a Model View Controller (MVC) architecture using a Publisher-Subscriber pattern for event handling. The app features:

- Custom built state management
- Custom built DOM updating algorithm using the DocumentFragment API
- Custom built HTTP library based on the Fetch API and Promises
- Search functionality with results dinamicaly loaded from an API
- Search dynamically displayed with pagination
- Recipe deep-linking with hashes using the history API
- Class based Views extended for each page's functionality
- Saves user's bookmarks using localstorage
- Error handling with messages
- Basic recipe upload functionality
- Built using [Vite](https://vitejs.dev)
- [Deployed to Netlify](https://forkify-theo-ribeiro.netlify.app) using Github

## Room for improvement

Here are a few features and considerations that this app could benefit from:

- A simpler, more user friendly interface for adding new recipes, where users don't have to pay careful attention to the input format. Using repeater fields for ingredients and different input fields with dropdowns for unit types.
- Authenticate users so their own recipes and favourites can be stored in a database and not depend on the user's browser local storage.
- Responsive styling.

## Forking or cloning

If you wish to clone/fork this project, you will need to create a `.env` file at the root of your project directory with the following content:

`API_KEY=yourApiKey`
`API_URL=https://forkify-api.herokuapp.com/api/v2/recipes`

Replace `yourApiKey` with a key generated from [this link](https://forkify-api.herokuapp.com/v2).

## Context

This is the final project for ["The Complete JavaScript Course 2024: From Zero to Expert!"](https://www.udemy.com/course/the-complete-javascript-course/) completed July 2023.

I wrote all the JavaScript code for this app, always writing code before watching the taught content of the module. Most CSS styles and proposed HTML markup for this project were provided by the course instructor [Jonas Schmedtmann](https://codingheroes.io/).
