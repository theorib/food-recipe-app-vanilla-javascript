import icons from 'url:../../img/icons.svg';

class View {
  _data;

  _clear() {
    this._parentELement.innerHTML = '';
  }

  _insertMarkup(markup) {
    this._parentELement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
    </div>
    `;
    this._clear();
    this._insertMarkup(markup);
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup(this._data);

    this._clear();

    this._insertMarkup(markup);
  }

  update(data) {
    // This function basically creates a virtual DOM and replaces only elements that had different text or different attributes

    if (!data || data.lenght === 0) return this.renderError();

    this._data = data;

    const newMarkup = this._generateMarkup(this._data); //this returns a string

    const newDOM = document.createRange().createContextualFragment(newMarkup); //this converts the string into a real dom object
    const currentElements = Array.from(
      this._parentELement.querySelectorAll('*')
    );
    const newElements = Array.from(newDOM.querySelectorAll('*')); // here we select all the elemnts in the new DOM

    newElements.forEach(function (newElement, i) {
      const currentElement = currentElements[i];

      // Udates only text content
      if (
        //Only elements that are not equal to the currentElement
        !newElement.isEqualNode(currentElement) &&
        //Only Elements that contain text
        newElement.firstChild?.nodeValue.trim() !== ``
      ) {
        //Update the text content
        currentElement.textContent = newElement.textContent;
      }

      // Updates attributes
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute =>
          currentElement.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._insertMarkup(markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._insertMarkup(markup);
  }
}
export default View;
