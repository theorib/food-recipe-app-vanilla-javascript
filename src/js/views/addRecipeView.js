import View from './view.js';

class AddRecipeView extends View {
  _parentELement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelectorAll('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _errorMessage = 'There was an error uploading the recipe';
  _message = 'Recipe was succesfuly uploaded :)';

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
    this._addKeyboardHandlers();
    this._addIngredientHandlers();
    this._ingredientCount = 3;
  }
  toggleModal(data) {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');

    // Handle accessibility
    const isModalOpen = !this._overlay.classList.contains('hidden');
    const mainContent = document.querySelector('.container');

    if (isModalOpen) {
      // Render the modal content
      this._clear();
      this._generateMarkup();

      // Hide main content from screen readers
      mainContent.setAttribute('aria-hidden', 'true');

      // Focus first focusable element in modal
      setTimeout(() => {
        const firstFocusableElement = this._window.querySelector(
          'input, button, textarea, select'
        );
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }, 100);
    } else {
      // Show main content to screen readers
      mainContent.removeAttribute('aria-hidden');
    }
  }

  _addHandlerOpenModal() {
    this._btnOpen.forEach(btn => {
      btn.addEventListener('click', this.toggleModal.bind(this));
    });
  }

  _addHandlerCloseModal() {
    const targetElements = [this._btnClose, this._overlay];
    targetElements.forEach(element =>
      element.addEventListener('click', this.toggleModal.bind(this))
    );
  }

  _addKeyboardHandlers() {
    // Handle Escape key to close modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this._overlay.classList.contains('hidden')) {
        this.toggleModal();
      }
    });

    // Handle Tab key for focus trapping
    this._window.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        this._trapFocus(e);
      }
    });
  }

  _trapFocus(e) {
    const focusableElements = this._window.querySelectorAll(
      'input, button:not([disabled]), textarea, select, [href], [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab (backwards)
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      // Tab (forwards)
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }

  addHandlerUpload(handler) {
    this._parentELement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.upload__btn');
        if (!btn) return; //Guard Clause
        e.preventDefault();
        const data = this._collectFormData();
        handler(data);
      }.bind(this)
    );
  }

  _collectFormData() {
    const formData = new FormData();

    // Collect recipe data
    const recipeFields = [
      'title',
      'sourceUrl',
      'image',
      'publisher',
      'cookingTime',
      'servings',
    ];
    recipeFields.forEach(field => {
      const input = this._parentELement.querySelector(`[name="${field}"]`);
      if (input && input.value) {
        formData.append(field, input.value);
      }
    });

    // Collect ingredient data dynamically
    for (let i = 1; i <= this._ingredientCount; i++) {
      const quantityInput = this._parentELement.querySelector(
        `[name="ingredient-${i}-quantity"]`
      );
      const unitSelect = this._parentELement.querySelector(
        `[name="ingredient-${i}-unit"]`
      );
      const unitCustomInput = this._parentELement.querySelector(
        `[name="ingredient-${i}-unit-custom"]`
      );
      const descriptionInput = this._parentELement.querySelector(
        `[name="ingredient-${i}-description"]`
      );

      if (descriptionInput && descriptionInput.value.trim()) {
        const quantity = quantityInput?.value || '';
        let unit = unitSelect?.value || '';

        // Use custom unit if selected
        if (unit === 'custom' && unitCustomInput?.value) {
          unit = unitCustomInput.value;
        }

        const description = descriptionInput.value.trim();

        // Format as original comma-separated string
        const ingredientValue = `${quantity},${unit},${description}`;
        formData.append(`ingredient-${i}`, ingredientValue);
      }
    }

    return formData;
  }

  _addIngredientHandlers() {
    // Handle custom unit dropdown
    document.addEventListener('change', e => {
      if (e.target.classList.contains('ingredient-unit')) {
        const customInput = e.target.parentElement.querySelector(
          '.ingredient-unit-custom'
        );
        if (customInput) {
          if (e.target.value === 'custom') {
            customInput.style.display = 'block';
            customInput.focus();
          } else {
            customInput.style.display = 'none';
            customInput.value = '';
          }
        }
      }
    });

    // Handle add/remove ingredient buttons
    document.addEventListener('click', e => {
      if (e.target.closest('.add-ingredient-btn')) {
        e.preventDefault();
        this._addIngredient();
      }

      if (e.target.closest('.remove-ingredient-btn')) {
        e.preventDefault();
        this._removeIngredient();
      }
    });
  }

  _addIngredient() {
    this._ingredientCount++;
    const container = this._parentELement.querySelector(
      '.ingredients-container'
    );
    const newIngredientHTML = this._generateSingleIngredientField(
      this._ingredientCount
    );
    container.insertAdjacentHTML('beforeend', newIngredientHTML);

    // Update remove button state
    this._updateIngredientControls();
  }

  _removeIngredient() {
    if (this._ingredientCount > 1) {
      const container = this._parentELement.querySelector(
        '.ingredients-container'
      );
      const lastIngredient = container.querySelector(
        `[data-ingredient="${this._ingredientCount}"]`
      );
      if (lastIngredient) {
        lastIngredient.remove();
        this._ingredientCount--;
      }
    }

    // Update remove button state
    this._updateIngredientControls();
  }

  _updateIngredientControls() {
    const removeBtn = this._parentELement.querySelector(
      '.remove-ingredient-btn'
    );
    if (removeBtn) {
      removeBtn.disabled = this._ingredientCount <= 1;
    }
  }

  _generateMarkup(data) {
    const markup = `
        <div class="upload__column upload__column--recipe-data">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="" required name="title" type="text" placeholder="Enter recipe title" />
          <label>URL</label>
          <input value="" required name="sourceUrl" type="text" placeholder="Enter recipe URL" />
          <label>Image URL</label>
          <input value="" required name="image" type="text" placeholder="Enter image URL" />
          <label>Publisher</label>
          <input value="" required name="publisher" type="text" placeholder="Enter publisher name" />
          <label>Prep time (minutes)</label>
          <input value="" required name="cookingTime" type="number" placeholder="Enter cooking time" />
          <label>Servings</label>
          <input value="" required name="servings" type="number" placeholder="Enter number of servings" />
        </div>

        <div class="upload__column upload__column--ingredients">
          <h3 class="upload__heading">Ingredients</h3>
          <div class="ingredient-controls">
            <button type="button" class="btn--inline add-ingredient-btn">
              <svg>
                <use href="src/img/icons.svg#icon-plus-circle"></use>
              </svg>
              <span>Add Ingredient</span>
            </button>
            <button type="button" class="btn--inline remove-ingredient-btn" ${
              this._ingredientCount <= 1 ? 'disabled' : ''
            }>
              <svg>
                <use href="src/img/icons.svg#icon-minus-circle"></use>
              </svg>
              <span>Remove Ingredient</span>
            </button>
          </div>
          <div class="ingredients-container">
            ${this._generateIngredientFields()}
          </div>
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
            </button>
    `;
    this._parentELement.innerHTML = markup;
  }

  _generateIngredientFields() {
    const ingredients = [];
    for (let i = 1; i <= this._ingredientCount; i++) {
      ingredients.push(this._generateSingleIngredientField(i));
    }
    return ingredients.join('');
  }

  _generateSingleIngredientField(index) {
    return `
      <div class="ingredient-group" data-ingredient="${index}">
        <div class="ingredient-inputs">
          <input
            type="number"
            name="ingredient-${index}-quantity"
            placeholder="Qty"
            class="ingredient-quantity"
            step="0.1"
            min="0"
          />
          <select name="ingredient-${index}-unit" class="ingredient-unit">
            <option value="">Unit</option>
            <option value="cup">cup</option>
            <option value="cups">cups</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="pint">pint</option>
            <option value="quart">quart</option>
            <option value="gallon">gallon</option>
            <option value="piece">piece</option>
            <option value="pieces">pieces</option>
            <option value="slice">slice</option>
            <option value="slices">slices</option>
            <option value="clove">clove</option>
            <option value="cloves">cloves</option>
            <option value="custom">Custom...</option>
          </select>
          <input
            type="text"
            name="ingredient-${index}-unit-custom"
            placeholder="Custom unit"
            class="ingredient-unit-custom"
            style="display: none;"
          />
          <input
            type="text"
            name="ingredient-${index}-description"
            placeholder="Ingredient name"
            class="ingredient-description"
            ${index === 1 ? 'required' : ''}
          />
        </div>
      </div>
    `;
  }
}
export default new AddRecipeView();
