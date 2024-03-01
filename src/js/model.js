import { API_URL, API_KEY, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

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

/**
 *
 * @param {*} data
 * @returns
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    image: recipe.image_url,
    sourceURL: recipe.source_url,
    ...(recipe.key && { key: recipe.key }), //trick to conditionally add properties to an object. we use short circuiting and then spread the result
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    getLocalStorageBookmarks();

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmarks => bookmarks.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.currentPage = 1; // reset pagination
    state.search.resultCount = data.results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.totalPages = Math.ceil(
    state.search.resultCount / state.search.resultsPerPage
  );

  state.search.currentPage = page; // Update Current Page
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    const newQuantity =
      (ingredient.quantity * newServings) / state.recipe.servings;

    ingredient.quantity = newQuantity;
  });
  state.recipe.servings = newServings;
};

export const addBookmarkRecipe = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  // Mark recipe as bookmarked
  state.recipe.bookmarked = true;
};

export const removeBookmarkRecipe = function (id) {
  //remove bookmarks
  state.bookmarks.splice(id, 1);
  // Mark recipe as not bookmarked
  state.recipe.bookmarked = false;
};

export const setLocalStorageBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const getLocalStorageBookmarks = function () {
  const data = JSON.parse(localStorage.getItem('bookmarks'));

  if (!data) return;

  state.bookmarks = data;
};

export const uploadRecipe = async function (data) {
  try {
    //Get ingredients into an array and then split the inputs into an object for each ingredient
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
    state.recipe = createRecipeObject(returnedData);
    addBookmarkRecipe(state.recipe);
  } catch (err) {
    throw err;
  }
};

const clearLocalStorageBookmarks = function () {
  localStorage.clear('bookmarks');
};
//  clearLocalStorageBookmarks();
