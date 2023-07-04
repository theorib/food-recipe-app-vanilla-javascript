class SearchView {
  _parentELement = document.querySelector('.search');

  getQuery() {
    const query = this._parentELement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentELement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentELement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(e);
    });
  }
}

export default new SearchView();
