import Route from '@ember/routing/route';
import ENV from 'bookstore-frontend/config/environment'; // Import environment configuration

export default class BooksRoute extends Route {
  async model() {
    let response = await fetch(`${ENV.APP.apiHost}/books`); // Fetch from Rails API
    let books = await response.json(); // Parse the JSON response
    return books; // Return the array of books
  }
}
