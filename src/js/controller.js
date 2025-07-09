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
    // Get id hash from URL
    const id = window.location.hash.slice(1);

    if (!id) return; // Guard clause

    // 0) Update Search results to highlight clicked recipe
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Render Spinner
    recipeView.renderSpinner();

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Render a recipe if there is one
    recipeView.render(model.state.recipe);

    // 4) Scroll to recipe on mobile after rendering
    if (window.innerWidth <= 600) { // Mobile breakpoint
      setTimeout(() => {
        const recipeElement = document.querySelector('.recipe');
        if (recipeElement) {
          recipeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
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

    // 2) Get Search Results
    await model.loadSearchResults(query);

    // 3) Render Search Results (paginated)
    searchResultsView.render(model.getSearchResultsPage());

    // Render an error message if there are no search results
    if (model.state.search.resultCount === 0) {
      searchResultsView.renderError();
      return;
    }
    // 4) Render the Pagination component
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    searchResultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render current page's search results
  searchResultsView.render(model.getSearchResultsPage(goToPage));
  // Render the Pagination component
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings
  model.updateServings(newServings);
  // Update UI with the new servings
  recipeView.update(model.state.recipe);
};

const controlBookmarkRecipe = function () {
  // Add a Bookmark if the recipe is not bookmarked already
  if (!model.state.recipe.bookmarked) {
    model.addBookmarkRecipe(model.state.recipe);
  }
  // Remove Bookmark if the recipe is already bookmarked
  else {
    model.removeBookmarkRecipe(model.state.recipe.id);
  }
  // Update UI with the bookmarked recipe
  recipeView.update(model.state.recipe);
  // Render Bookmarks component
  bookmarksView.render(model.state.bookmarks);
  // Save bookmarks to local storage
  model.setLocalStorageBookmarks();
};

const controlBookmarkRender = function () {
  // Render Bookmarks component
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload new Recipe
    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Change URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render Success Message
    addRecipeView.renderMessage();

    // Render Bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Save recipe to local storage
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
    console.error(err);
    // Render Error messages
    addRecipeView.renderError(err);

    // Reset Modal
    setTimeout(function () {
      addRecipeView.render(model.state.recipe);
    }, MODAL_CLOSE_SECONDS * 1000 + 1000);
  }
};

const init = function () {
  // Get Bookmarks from local storage
  model.getLocalStorageBookmarks();

  // Assign controlBookmarkRender to the event listener in bookmarksView
  bookmarksView.addHandlerRender(controlBookmarkRender);

  // Assign controlRecipes to the event listener in recipeView
  recipeView.addHandlerRenderRecipe(controlRecipes);

  // Assign controlServings to the event listener in recipeView
  recipeView.addHandlerUpdateServings(controlServings);

  // Assign controlBookmarkRecipe to the event listener in recipeView
  recipeView.addHandlerBookmarkRecipe(controlBookmarkRecipe);

  // Assign controlSearchResults to the event listener in searchView
  searchView.addHandlerSearch(controlSearchResults);

  // Assign controlPagination to the event listener in paginationView
  addRecipeView.addHandlerUpload(controlAddRecipe);

  // Assign controlPagination to the event listener in paginationView
  paginationView.addHandlerRenderPagination(controlPagination);
};

// Mobile menu functionality
const initMobileMenu = function () {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!hamburgerMenu || !mobileMenu) return;
  
  // Handle mobile bookmarks elements
  const mobileBookmarksBtn = mobileMenu.querySelector('.nav__btn--bookmarks');
  const mobileBookmarksDropdown = mobileMenu.querySelector('.mobile-bookmarks');
  
  // Close mobile menu and bookmarks function
  const closeMobileMenu = function() {
    hamburgerMenu.classList.remove('hamburger-menu--active');
    mobileMenu.classList.remove('mobile-menu--active');
    if (mobileBookmarksDropdown) {
      mobileBookmarksDropdown.classList.remove('mobile-bookmarks--active');
    }
  };
  
  hamburgerMenu.addEventListener('click', function() {
    hamburgerMenu.classList.toggle('hamburger-menu--active');
    mobileMenu.classList.toggle('mobile-menu--active');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const isMenuOpen = mobileMenu.classList.contains('mobile-menu--active');
    const isClickOnHamburger = hamburgerMenu.contains(e.target);
    const isClickOnMenu = mobileMenu.contains(e.target);
    
    if (isMenuOpen && !isClickOnHamburger && !isClickOnMenu) {
      closeMobileMenu();
    }
  });
  
  // Handle mobile bookmarks toggle
  if (mobileBookmarksBtn && mobileBookmarksDropdown) {
    mobileBookmarksBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileBookmarksDropdown.classList.toggle('mobile-bookmarks--active');
    });
  }
  
  // Close mobile menu when clicking on add recipe
  const mobileAddRecipeBtn = mobileMenu.querySelector('.nav__btn--add-recipe');
  if (mobileAddRecipeBtn) {
    mobileAddRecipeBtn.addEventListener('click', closeMobileMenu);
  }
  
  // Close mobile menu when clicking on bookmark links
  mobileMenu.addEventListener('click', function(e) {
    const bookmarkLink = e.target.closest('.preview__link');
    if (bookmarkLink) {
      closeMobileMenu();
    }
  });
  
  // Also close when clicking directly on bookmark list items
  if (mobileBookmarksDropdown) {
    mobileBookmarksDropdown.addEventListener('click', function(e) {
      const bookmarkLink = e.target.closest('.preview__link');
      if (bookmarkLink) {
        closeMobileMenu();
      }
    });
  }
};

// Initialize the app, adding event listeners to the views and getting bookmarks from local storage
init();
initMobileMenu();
