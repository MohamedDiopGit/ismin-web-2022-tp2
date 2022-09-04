import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './Book';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks(@Query('author') author: string): Book[] {
    if (author) {
      return this.bookService.getBooksOf(author);
    }
    return this.bookService.getAllBooks();
  }

  @Post()
  createBook(@Body() bookToCreate: Book): Book {
    this.bookService.addBook(bookToCreate);
    return this.bookService.getBook(bookToCreate.title);
  }

  @Get(':title')
  getBookByTitle(@Param('title') title: string): Book {
    return this.bookService.getBook(title);
  }

  @Delete(':title')
  deleteBook(@Param('title') title: string): void {
    return this.bookService.removeBook(title);
  }
}
