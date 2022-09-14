import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './interface/Book.dto'

@Controller('/books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  create(@Body() book: BookDto) : BookDto {
    return this.bookService.addBook(book); 
  }

  @Get()
  getAllBooks(@Query('author') author: string) : BookDto[]{
    if(author){
      return this.bookService.getBooksOf(author);
    }
    return this.bookService.getAllBooks();
  }

  @Post('/search')
  search(@Query('term') term: string) : BookDto[]{

    let research = this.bookService.getBook(term);
    if(!research){
      return this.bookService.getBooksOf(term);
    }
    return [research];

  }


  @Get(':title')
  getBook(@Param('title') title: string) {
    return this.bookService.getBook(title);
  }


  @Delete(':title')
  delete(@Param('title') title: string){
    return this.bookService.deleteBook(title);
  }
}
