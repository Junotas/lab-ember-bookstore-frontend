import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class BooksController extends Controller {
  // Properties for the form inputs
  formTitle = '';
  formAuthor = '';
  formGenre = '';
  formYear = '';
  isEditing = false;
  editingBookId = null;

  // Update form input values
  @action
  updateFormTitle(event) {
    this.set('formTitle', event.target.value);
  }

  @action
  updateFormAuthor(event) {
    this.set('formAuthor', event.target.value);
  }

  @action
  updateFormGenre(event) {
    this.set('formGenre', event.target.value);
  }

  @action
  updateFormYear(event) {
    this.set('formYear', event.target.value);
  }

  // Handle form submission for adding or editing a book
  @action
  handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submitted with:', {
      title: this.formTitle,
      author: this.formAuthor,
      genre: this.formGenre,
      publishedYear: this.formYear,
    });

    const bookData = {
      title: this.formTitle,
      author: this.formAuthor,
      genre: this.formGenre,
      publishedYear: parseInt(this.formYear, 10)
    };

    if (this.isEditing) {
      // Update the book
      fetch(`http://localhost:3000/books/${this.editingBookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })
        .then(() => {
          console.log('Book updated:', bookData);
          this.send('refreshModel'); // Refresh the list
          this.resetForm(); // Clear the form
        });
    } else {
      // Create a new book
      fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })
        .then(() => {
          console.log('New book added:', bookData);
          this.send('refreshModel'); // Refresh the list
          this.resetForm(); // Clear the form
        });
    }
  }

  // Set up a book for editing
  @action
  editBook(book) {
    console.log('Editing book:', book);
    this.setProperties({
      formTitle: book.title,
      formAuthor: book.author,
      formGenre: book.genre,
      formYear: book.publishedYear,
      isEditing: true,
      editingBookId: book.id
    });
  }

  // Delete a book
  @action
  deleteBook(bookId) {
    console.log('Deleting book with ID:', bookId);
    fetch(`http://localhost:3000/books/${bookId}`, { method: 'DELETE' })
      .then(() => {
        console.log('Book deleted:', bookId);
        this.send('refreshModel'); // Refresh the list
      });
  }

  // Reset the form to its initial state
  resetForm() {
    this.setProperties({
      formTitle: '',
      formAuthor: '',
      formGenre: '',
      formYear: '',
      isEditing: false,
      editingBookId: null
    });
  }

  @action
  refreshModel() {
    this.get('target').send('refresh');
  }
}
