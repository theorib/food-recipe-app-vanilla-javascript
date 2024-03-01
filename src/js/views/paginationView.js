import View from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentELement = document.querySelector('.pagination');

  _generateMarkup(data) {
    const currentPage = data.currentPage;
    const totalPages = data.totalPages;
    const { btnPrev, btnNext } = this._generateMarkupButtons(currentPage);
    // First page and there are no other pages
    if (data.resultCount <= data.resultsPerPage) return '';
    // First page and there are other pages
    if (currentPage === 1) return btnNext;
    // Last Page
    if (currentPage === totalPages) return btnPrev;
    // Other Page
    if (currentPage < totalPages) return [btnPrev, btnNext].join('');
  }

  _generateMarkupButtons(currentPage) {
    return {
      btnPrev: `
          <button class="btn--inline pagination__btn--prev" data-goto="${
            currentPage - 1
          }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
      `,
      btnNext: `
          <button class="btn--inline pagination__btn--next" data-goto="${
            currentPage + 1
          }">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `,
    };
  }

  addHandlerRenderPagination(handler) {
    this._parentELement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return; //Guard Clause
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
