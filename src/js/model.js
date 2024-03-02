import { RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

// asign the environment variables to API_KEY and API_URL constants
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

// Create the state object
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultCount: 0,
    currentPage: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

// Create a recipe object from data returned from the API
const createRecipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    image: recipe.image_url,
    sourceURL: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

// Create an array of recipes from the received data
const createRecipesArray = function (recipes) {
  const recipesArray = recipes.map(recipe => {
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    };
  });

  return recipesArray;
};

// Load a recipe from the API
export const loadRecipe = async function (id) {
  try {
    // Get the recipe data from the API
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    // Get bookmarks from local storage
    getLocalStorageBookmarks();

    // Create a recipe object from the data
    const recipe = createRecipeObject(data.data.recipe);

    // Set the state recipe to the loaded recipe
    state.recipe = recipe;

    // Check if the current recipe is bookmarked and set the state bookmarked property accordingly
    if (state.bookmarks.some(bookmarks => bookmarks.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

// Load the search results from the API
export const loadSearchResults = async function (query) {
  try {
    // Get the search results from the API
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // Create an array of recipes from the APIs data
    const recipes = createRecipesArray(data.data.recipes);

    // Set the state to reflect the search results
    state.search.query = query;
    state.search.results = recipes;
    state.search.currentPage = 1; // reset pagination
    state.search.resultCount = data.results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Get the page number for the current search results
export const getSearchResultsPage = function (page = state.search.currentPage) {
  // Set the total number of pages in the state
  state.search.totalPages = Math.ceil(
    state.search.resultCount / state.search.resultsPerPage
  );

  // Set the current page in the state
  state.search.currentPage = page;

  // Calculate the start and end indexes for the current page
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // Return the current page of search results
  return state.search.results.slice(start, end);
};

// Update the servings in the state
export const updateServings = function (newServings) {
  // Update the ingredients quantities
  state.recipe.ingredients.forEach(ingredient => {
    const newQuantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
    ingredient.quantity = newQuantity;
  });
  // Update the state to reflect the new servings
  state.recipe.servings = newServings;
};

// Add bookmark to the state
export const addBookmarkRecipe = function (recipe) {
  // Update the state to add the current bookmarked recipe to the bookmarks array
  state.bookmarks.push(recipe);
  // Update the state to set the current recipe as bookmarked
  state.recipe.bookmarked = true;
};

// Remove bookmark from the state
export const removeBookmarkRecipe = function (id) {
  // Update the state to remove the current recipe from the bookmarks array
  state.bookmarks.splice(id, 1);
  // Update the state to remove the bookmark from the the current recipe
  state.recipe.bookmarked = false;
};

// Save the current state bookmarks to local storage
export const setLocalStorageBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Get bookmarks from local storage and add them to the state
export const getLocalStorageBookmarks = function () {
  const data = JSON.parse(localStorage.getItem('bookmarks'));

  if (!data) return;

  state.bookmarks = data;
};

const createUserRecipeObject = function (data) {
  // Get all user loaded ingredients into an array and then split the input data  into an object for each ingredient
  const ingredientsArr = [...data]
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ingredient => {
      const ingArr = ingredient[1].split(',').map(element => element.trim());
      if (ingArr.length !== 3)
        throw new Error(
          'Wrong Ingredient Format! please use the correct format :)'
        );
      return {
        quantity: ingArr[0] !== '' ? +ingArr[0] : null,
        unit: ingArr[1],
        description: ingArr[2],
      };
    });

  // Create the new recipe object ready to upload
  const newRecipe = {
    // id: recipe.id,
    title: data?.get('title'),
    publisher: data?.get('publisher'),
    cooking_time: +data?.get('cookingTime'),
    ingredients: ingredientsArr,
    servings: +data?.get('servings'),
    image_url: data?.get('image'),
    source_url: data?.get('sourceUrl'),
  };
};

export const uploadRecipe = async function (data) {
  try {
    console.log(data);

    // Get all user loaded ingredients into an array and then split the input data  into an object for each ingredient
    const ingredientsArr = [...data]
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingArr = ingredient[1].split(',').map(element => element.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient Format! please use the correct format :)'
          );
        return {
          quantity: ingArr[0] !== '' ? +ingArr[0] : null,
          unit: ingArr[1],
          description: ingArr[2],
        };
      });

    // Create the new recipe object ready to upload
    const newRecipe = {
      // id: recipe.id,
      title: data?.get('title'),
      publisher: data?.get('publisher'),
      cooking_time: +data?.get('cookingTime'),
      ingredients: ingredientsArr,
      servings: +data?.get('servings'),
      image_url: data?.get('image'),
      source_url: data?.get('sourceUrl'),
    };

    const returnedData = await AJAX(`${API_URL}?key=${API_KEY}`, newRecipe);
    state.recipe = createRecipeObject(returnedData.data.recipe);
    addBookmarkRecipe(state.recipe);
  } catch (err) {
    throw err;
  }
};

const clearLocalStorageBookmarks = function () {
  localStorage.clear('bookmarks');
};
//  clearLocalStorageBookmarks();
