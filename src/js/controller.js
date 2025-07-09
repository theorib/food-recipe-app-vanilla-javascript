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

    // 4) Scroll to recipe on mobile and medium screens after rendering
    if (window.innerWidth <= 980) { // Mobile and medium breakpoint ($bp-medium)
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
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  
  if (!hamburgerMenu || !mobileMenu || !mobileMenuOverlay) return;
  
  // Handle mobile bookmarks elements
  const mobileBookmarksBtn = mobileMenu.querySelector('.nav__btn--bookmarks');
  const mobileBookmarksDropdown = mobileMenu.querySelector('.mobile-bookmarks');
  
  // Get all focusable elements in the mobile menu
  const getFocusableElements = function() {
    const buttons = mobileMenu.querySelectorAll('button');
    const bookmarkLinks = mobileMenu.querySelectorAll('.mobile-bookmarks--active .preview__link');
    return [...buttons, ...bookmarkLinks];
  };
  
  // Close mobile menu and bookmarks function
  const closeMobileMenu = function() {
    hamburgerMenu.classList.remove('hamburger-menu--active');
    mobileMenu.classList.remove('mobile-menu--active');
    mobileMenuOverlay.classList.remove('mobile-menu-overlay--active');
    document.body.style.overflow = '';
    if (mobileBookmarksDropdown) {
      mobileBookmarksDropdown.classList.remove('mobile-bookmarks--active');
    }
    
    // Remove tabindex from all focusable elements when closed
    const allFocusableElements = getFocusableElements();
    allFocusableElements.forEach(el => {
      el.setAttribute('tabindex', '-1');
    });
  };
  
  hamburgerMenu.addEventListener('click', function() {
    hamburgerMenu.classList.toggle('hamburger-menu--active');
    mobileMenu.classList.toggle('mobile-menu--active');
    mobileMenuOverlay.classList.toggle('mobile-menu-overlay--active');
    
    // Prevent body scrolling when menu is open
    if (mobileMenu.classList.contains('mobile-menu--active')) {
      document.body.style.overflow = 'hidden';
      
      // Enable tabindex for menu items when opened
      const focusableElements = getFocusableElements();
      focusableElements.forEach(el => {
        el.setAttribute('tabindex', '0');
      });
      
      // Focus first menu item
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } else {
      document.body.style.overflow = '';
      
      // Remove tabindex from menu items when closed
      const focusableElements = getFocusableElements();
      focusableElements.forEach(el => {
        el.setAttribute('tabindex', '-1');
      });
    }
  });
  
  // Close mobile menu when clicking outside or on overlay
  document.addEventListener('click', function(e) {
    const isMenuOpen = mobileMenu.classList.contains('mobile-menu--active');
    const isClickOnHamburger = hamburgerMenu.contains(e.target);
    const isClickOnMenu = mobileMenu.contains(e.target);
    const isClickOnOverlay = mobileMenuOverlay.contains(e.target);
    
    if (isMenuOpen && (!isClickOnHamburger && !isClickOnMenu || isClickOnOverlay)) {
      closeMobileMenu();
    }
  });
  
  // Handle keyboard navigation
  document.addEventListener('keydown', function(e) {
    const isMenuOpen = mobileMenu.classList.contains('mobile-menu--active');
    
    if (isMenuOpen) {
      // Close menu with Escape key
      if (e.key === 'Escape') {
        closeMobileMenu();
        hamburgerMenu.focus();
      }
      
      // Tab navigation within menu
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        const focusedElement = document.activeElement;
        const focusedIndex = Array.from(focusableElements).indexOf(focusedElement);
        
        if (e.shiftKey) {
          // Shift+Tab (backwards)
          if (focusedIndex === 0) {
            e.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
          }
        } else {
          // Tab (forwards)
          if (focusedIndex === focusableElements.length - 1) {
            e.preventDefault();
            focusableElements[0].focus();
          }
        }
      }
    }
  });
  
  // Handle mobile bookmarks toggle
  if (mobileBookmarksBtn && mobileBookmarksDropdown) {
    mobileBookmarksBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileBookmarksDropdown.classList.toggle('mobile-bookmarks--active');
      
      // Update focus management when bookmarks are toggled
      const focusableElements = getFocusableElements();
      focusableElements.forEach(el => {
        el.setAttribute('tabindex', '0');
      });
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
  
  // Close mobile menu when using keyboard on bookmark links
  mobileMenu.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const bookmarkLink = e.target.closest('.preview__link');
      if (bookmarkLink) {
        e.preventDefault();
        bookmarkLink.click(); // Trigger the click event
        closeMobileMenu();
      }
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
    
    // Also handle keyboard events on bookmark dropdown
    mobileBookmarksDropdown.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const bookmarkLink = e.target.closest('.preview__link');
        if (bookmarkLink) {
          e.preventDefault();
          bookmarkLink.click(); // Trigger the click event
          closeMobileMenu();
        }
      }
    });
  }
};

// Initialize the app, adding event listeners to the views and getting bookmarks from local storage
init();
initMobileMenu();
