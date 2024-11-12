import Model, { attr } from '@ember-data/model';

export default class BookModel extends Model {
  @attr('string') title;
  @attr('string') author;
  @attr('string') genre;
  @attr('number') publishedYear;
}
