# Forkify App

[A vanilla javascript Single Page Application (SPA)](https://master--forkify-theo-ribeiro.netlify.app) that allows users to search, bookmark and upload food recipes.

This is the final project from ["The Complete JavaScript Course 2024: From Zero to Expert!"](https://www.udemy.com/course/the-complete-javascript-course/) that I completed on July 4th 2023.

I have written all the JavaScript code for this app, usually writting code upfront on my own and then watching the course solutions. All, css and proposed markup was written by the instructor [Jonas Schmedtmann](https://codingheroes.io/) and I don't claim any credit for it.

This is a recipe app that allows users to:

- Users can search for recipes or ingredients
- Users can create and upload their own recipes
- Recipes are displayed with cooking time, servings and ingredients
- Users can change the number of servings and get updated ingredients and quantities list
- Users can bookmark recipes to view them later
- Users can view their own recipes and bookmarks later on (saved in their browser's localstorage)

The app follows a Model View Controller (MVC) architecture using a Publisher-Subscriber pattern for event handling. The app features:

- Custom built state management
- Custom built DOM updating algorithm using the DocumentFragment API
- Custom built HTTP library based on the Fetch API and promises
- Search functionality with results dinamicaly loaded from an API
- Search dynamically displayed with pagination
- Recipe deep-linking with hashes using the history API
- Class based Views extended for each page's functionality
- Saves user's bookmarks using localstorage
- Error handling with messages
- Basic recipe upload functionality
- Built using [Vite](https://vitejs.dev)
- [Deployed to Netlify](https://master--forkify-theo-ribeiro.netlify.app) using Github
