import { BookDto } from './Book.dto';
class Bookshelf {

    listeLivre: BookDto[];

    constructor() { // Constructor for Bookshelf
        this.listeLivre = [];
    }

    addBook(book: BookDto){

        if(!this.listeLivre.find((value) => value.title === book.title)){ 
            this.listeLivre.push(book);  // Add element to the end of the list
        }
    }

    getBook(name: string){
        // return this.listeLivre.filter(value => value.title === name)[0];  // Return the first element in the listeLivre
        const book = this.listeLivre.find((value) => value.title === name);
        if(!book){
            throw new Error(`Book not found: ${name}`);
        } 
        return book;
    }


    getBooksOf(author: string){
        return this.listeLivre.filter((value) => value.author === author);    // return all books of the author
    }


    getAllBooks() : BookDto[]
    {
        return this.listeLivre.sort((a,b)=>{
            return a.title.localeCompare(b.title);
        })
     // Return all the books
    }

    getTotalNumberOfBooks(){
        return this.listeLivre.length; // Return the total number of books
    }
    
    getBooksPublishedAfter(aDate: string | Date){
        return this.listeLivre.filter(value => value.date > aDate);
    }
}

export {Bookshelf};