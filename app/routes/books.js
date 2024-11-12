import Route from '@ember/routing/route';

export default class BooksRoute extends Route {
  async model() {
    // Fetch the books from the API
    try {
      const response = await fetch('http://localhost:3000/books');
      if (!response.ok) {
        throw new Error(`Error fetching books: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched books:', data);
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.model = model;
  }
}
