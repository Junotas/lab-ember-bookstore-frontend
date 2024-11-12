import Route from '@ember/routing/route';

export default class BooksRoute extends Route {
  model() {
    // Fetch the books from the API
    return fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched books:', data);
        return data;
      })
      .catch(error => console.error('Error fetching books:', error));
  }

  actions = {
    refresh() {
      this.refresh();
    }
  }
}
