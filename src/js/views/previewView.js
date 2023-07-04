import View from './view.js';
import icons from 'url:../../img/icons.svg';
class PreviewView extends View {
  _parentELement = '';

  _generateMarkup(data) {
    return `
    ${data.map(bookmark => this._generateMarkupPreview(bookmark)).join('\n')}
    `;
  }

  _generateMarkupPreview(data) {
    const currentID = window.location.hash.slice(1);
    return `
    <li class="preview">
    <a class="preview__link${
      currentID === data.id ? ` preview__link--active` : ''
    }" href="#${data.id}">
      <figure class="preview__fig">
        <img src="${data.image}" alt="${data.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${data.title}</h4>
        <p class="preview__publisher">${data.publisher}</p>
        <div class="recipe__user-generated ${data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>
        `;
  }
}
export default PreviewView;
