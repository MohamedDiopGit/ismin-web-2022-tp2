import { IsNotEmpty, IsString } from 'class-validator';

export class BookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsNotEmpty()
  @IsString()
  readonly date: string;

  constructor(title: string, author: string, date: string) {
    this.title = title;
    this.author = author;
    this.date = date;
  }
}
