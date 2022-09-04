import { Injectable } from '@nestjs/common';
import { Book } from './Book';

@Injectable()
export class BookService {
  private storedBooks: Book[] = [];

  addBook(book: Book): void {
    if (
      !this.storedBooks.some((storedBook) => book.title === storedBook.title)
    ) {
      this.storedBooks.push(book);
    }
  }

  getBook(title: string): Book {
    const book = this.storedBooks.find((book) => book.title === title);
    if (!book) {
      throw new Error(`No book with title ${title}`);
    }
    return book;
  }

  getBooksOf(author: string): Book[] {
    return this.storedBooks.filter((book) => book.author === author);
  }

  getAllBooks(): Book[] {
    return this.storedBooks.sort((book1, book2) =>
      book1.title.toLowerCase().localeCompare(book2.title.toLowerCase()),
    );
  }

  getTotalNumberOfBooks(): number {
    return this.storedBooks.length;
  }

  getBooksPublishedAfter(date: string | Date): Book[] {
    const dateAsDate = new Date(date);

    return this.storedBooks.filter(
      (book) => new Date(book.date).getTime() >= dateAsDate.getTime(),
    );
  }

  removeBook(title: string) {
    this.storedBooks = this.storedBooks.filter((book) => book.title !== title);
  }

  searchByAuthorAndTitle(term: string): Book[] {
    const escapedTerm = term.toLowerCase().trim();

    return this.storedBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(escapedTerm) ||
        book.author.toLowerCase().includes(escapedTerm)
      );
    });
  }
}
