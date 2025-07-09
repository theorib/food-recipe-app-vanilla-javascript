import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
  _parentELement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    const markup = this._generateMarkup(data);
    
    if (!render) return markup;

    // Update both desktop and mobile bookmark lists
    const bookmarkLists = document.querySelectorAll('.bookmarks__list');
    bookmarkLists.forEach(list => {
      list.innerHTML = '';
      list.insertAdjacentHTML('afterbegin', markup);
    });
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const newMarkup = this._generateMarkup(this._data);

    // Update both desktop and mobile bookmark lists with the new markup
    const bookmarkLists = document.querySelectorAll('.bookmarks__list');
    bookmarkLists.forEach(list => {
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const currentElements = Array.from(list.querySelectorAll('*'));
      const newElements = Array.from(newDOM.querySelectorAll('*'));

      newElements.forEach(function (newElement, i) {
        const currentElement = currentElements[i];

        if (!currentElement) return;

        // Updates only text content
        if (
          !newElement.isEqualNode(currentElement) &&
          newElement.firstChild?.nodeValue.trim() !== ``
        ) {
          currentElement.textContent = newElement.textContent;
        }

        // Updates attributes
        if (!newElement.isEqualNode(currentElement)) {
          Array.from(newElement.attributes).forEach(attribute =>
            currentElement.setAttribute(attribute.name, attribute.value)
          );
        }
      });
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="src/img/icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    // Update both desktop and mobile bookmark lists
    const bookmarkLists = document.querySelectorAll('.bookmarks__list');
    bookmarkLists.forEach(list => {
      list.innerHTML = '';
      list.insertAdjacentHTML('afterbegin', markup);
    });
  }
}
export default new BookmarksView();
