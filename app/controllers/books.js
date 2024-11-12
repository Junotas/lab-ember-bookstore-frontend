import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BooksController extends Controller {
  // Properties for the form inputs
  @tracked formTitle = '';
  @tracked formAuthor = '';
  @tracked formGenre = '';
  @tracked formYear = '';
  @tracked isEditing = false;
  @tracked editingBookId = null;
  @tracked model = [];

  // Update form input values
  @action
  updateFormTitle(event) {
    this.formTitle = event.target.value;
    console.log('formTitle updated to:', this.formTitle);
  }

  @action
  updateFormAuthor(event) {
    this.formAuthor = event.target.value;
    console.log('formAuthor updated to:', this.formAuthor);
  }

  @action
  updateFormGenre(event) {
    this.formGenre = event.target.value;
    console.log('formGenre updated to:', this.formGenre);
  }

  @action
  updateFormYear(event) {
    this.formYear = event.target.value;
    console.log('formYear updated to:', this.formYear);
  }

  // Handle form submission for adding or editing a book
  @action
  async handleFormSubmit(event) {
    event.preventDefault();
    console.log('handleFormSubmit action triggered');
    console.log('Form submitted with:', {
      title: this.formTitle,
      author: this.formAuthor,
      genre: this.formGenre,
      publishedYear: this.formYear,
    });

    // Adjust the bookData to match Rails expectations
    const bookData = {
      book: {
        title: this.formTitle,
        author: this.formAuthor,
        genre: this.formGenre,
        published_year: parseInt(this.formYear, 10),
      },
    };

    try {
      if (this.isEditing) {
        // Update the book
        const response = await fetch(`http://localhost:3000/books/${this.editingBookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error updating book: ${response.status} ${response.statusText} - ${errorText}`);
        }
        console.log('Book updated:', bookData);
      } else {
        // Create a new book
        const response = await fetch('http://localhost:3000/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error adding book: ${response.status} ${response.statusText} - ${errorText}`);
        }
        console.log('New book added:', bookData);
      }
      // Refresh the list
      await this.refreshModel();
      // Clear the form
      this.resetForm();
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  }

  // Set up a book for editing
  @action
  editBook(book) {
    console.log('editBook action triggered with:', book);
    this.formTitle = book.title;
    this.formAuthor = book.author;
    this.formGenre = book.genre;
    this.formYear = book.published_year;
    this.isEditing = true;
    this.editingBookId = book.id;
  }

  // Delete a book
  @action
  async deleteBook(bookId) {
    console.log('deleteBook action triggered with ID:', bookId);
    try {
      const response = await fetch(`http://localhost:3000/books/${bookId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Error deleting book: ${response.status} ${response.statusText}`);
      }
      console.log('Book deleted:', bookId);
      await this.refreshModel(); // Refresh the list
    } catch (error) {
      console.error('Error in deleteBook:', error);
    }
  }

  // Reset the form to its initial state
  resetForm() {
    this.formTitle = '';
    this.formAuthor = '';
    this.formGenre = '';
    this.formYear = '';
    this.isEditing = false;
    this.editingBookId = null;
    console.log('Form reset to initial state');
  }

  @action
  async refreshModel() {
    console.log('refreshModel action triggered');
    try {
      const response = await fetch('http://localhost:3000/books');
      if (!response.ok) {
        throw new Error(`Error fetching books: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      this.model = data;
      console.log('Model refreshed with data:', data);
    } catch (error) {
      console.error('Error refreshing model:', error);
    }
  }
}
