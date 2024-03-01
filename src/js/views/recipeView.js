import View from './view.js';
import icons from '../../img/icons.svg';
import Fraction from 'fraction.js'; // include fractional library

class RecipeView extends View {
  _parentELement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  _generateMarkup(data) {
    return `
    <figure class="recipe__fig">
          <img src="${data.image}" alt="${data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--decrease-servings" data-new-servings="${
                data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-new-servings="${
                data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="recipe__user-generated ${data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>

          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${this._data.ingredients
            .map(ingredient => this._generateMarkupIngredient(ingredient))
            .join('\n')}

          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${data.sourceURL}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    
    `;
  }

  _generateMarkupIngredient(ingredient) {
    return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
              ${
                ingredient.quantity
                  ? `
                <div class="recipe__quantity"> ${new Fraction(
                  ingredient.quantity
                ).toString()}
                </div>
                    `
                  : ''
              }
                <div class="recipe__description">
                  <span class="recipe__unit">${ingredient.unit}</span>
                  ${ingredient.description}
                </div>
              </li>
        `;
  }

  addHandlerRenderRecipe(handler) {
    ['hashchange', 'load'].forEach(type =>
      window.addEventListener(type, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentELement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return; //Guard Clause
      const newServings = +btn.dataset.newServings;

      if (newServings > 0) handler(newServings);
    });
  }

  addHandlerBookmarkRecipe(handler) {
    this._parentELement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return; //Guard Clause
      handler();
    });
  }
}

export default new RecipeView();
