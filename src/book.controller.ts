import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './Book';
import { BookDto } from './Book.dto';

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
  createBook(@Body() bookToCreate: BookDto): Book {
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

  @Post('search')
  @HttpCode(200)
  public searchByAuthorAndTitle(@Body() query: { term: string }): Book[] {
    return this.bookService.searchByAuthorAndTitle(query.term);
  }
}
