import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './Book';
import { BookDto } from './Book.dto';
import { PaginatedType, PaginationService } from './pagination.service';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly paginationService: PaginationService,
  ) {}

  @Get()
  getBooks(
    @Query('author') author: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ): Book[] | PaginatedType<Book> {
    if (author) {
      return this.bookService.getBooksOf(author);
    }
    return this.paginationService.paginatedData(
      this.bookService.getAllBooks(),
      page,
      size,
    );
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
  public searchByAuthorAndTitle(
    @Body() query: { term: string },
    @Query('page') page: string,
    @Query('size') size: string,
  ): PaginatedType<Book> {
    return this.paginationService.paginatedData(
      this.bookService.searchByAuthorAndTitle(query.term),
      page,
      size,
    );
  }
}
