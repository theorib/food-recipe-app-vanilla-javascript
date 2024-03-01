import { MODAL_CLOSE_SECONDS } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return; // Guard clause

    // 0) Update Search results to highlight clicked recipe
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Render Spinner
    recipeView.renderSpinner();

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return; //Guard Clause
    // console.log(query);

    // 2) Get Search Results
    await model.loadSearchResults(query);
    // console.log(model.state.search);

    // 3) Render Search Results (paginated)
    searchResultsView.render(model.getSearchResultsPage());

    // Throw an error if there are no search results and return
    if (model.state.search.resultCount === 0) {
      searchResultsView.renderError();
      return;
    }
    // 4) Add Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    // searchResultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  searchResultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings gets updated
  model.updateServings(newServings);
  // Update UI
  recipeView.update(model.state.recipe);
};

const controlBookmarkRecipe = function () {
  // Add Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmarkRecipe(model.state.recipe);
  }
  // Remove Bookmark
  else {
    model.removeBookmarkRecipe(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  model.setLocalStorageBookmarks();
};

const controlBookmarkRender = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    //Send new Recipe
    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Change URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.location.hash = model.state.recipe.id;

    // Render Success Message
    addRecipeView.renderMessage();

    // Render Bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Save recipe in local storage
    model.setLocalStorageBookmarks();

    // Close Modal
    setTimeout(function () {
      addRecipeView.toggleModal();
    }, MODAL_CLOSE_SECONDS * 1000);

    // Reset Modal
    setTimeout(function () {
      addRecipeView.render(model.state.recipe);
    }, MODAL_CLOSE_SECONDS * 1000 + 1000);
  } catch (err) {
    addRecipeView.renderError(err);
    console.error(err);
  }
};

const init = function () {
  model.getLocalStorageBookmarks();
  bookmarksView.addHandlerRender(controlBookmarkRender);
  recipeView.addHandlerRenderRecipe(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmarkRecipe(controlBookmarkRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  paginationView.addHandlerRenderPagination(controlPagination);
};
init();
