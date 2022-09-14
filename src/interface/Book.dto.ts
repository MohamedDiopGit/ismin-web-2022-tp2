import { IsDateString, IsString } from 'class-validator';
// npm i --save class-validator class-transformer

export class BookDto {
    @IsString()
    title: string;

    @IsString()
    author: string; 

    @IsDateString()
    date: string;

    constructor(title: string, author: string, date: string) {
        this.title = title; 
        this.author = author; 
        this.date = date;
    }   

}

