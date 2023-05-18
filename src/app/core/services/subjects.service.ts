import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Book, BookResponse } from 'src/app/core/models/book-response.model';


@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  // stores the data of books to be emitted 
  books: Book[];

  // book data emitter

  subjectEmitter: EventEmitter<string> = new EventEmitter<string>();
  booksEmitter: EventEmitter<Book[]> = new EventEmitter<Book[]>();

  // subject name for which we want to books
  subjectName: string;

  // cached storage
  cachedData: { [cacheKey: string]: Book[] } = {};


  constructor(private apiService: ApiService) {
    this.subjectName = "";
    this.books = [];

  }

  // sets the subject name in subject service based on the value sent from sidebar
  setSubjectName(name: string) {
    this.subjectName = name;
  }

  // unused function
  getBooks() {
    return this.books.slice();
  }


  // fetches the required books from either cache or API
  getAllBooks(currPage: number, pageSize: number) {

    // cache key
    const cacheKey = `${this.subjectName}`;

    // books needed to display entries till page num = currpage
    const dataNeeded = pageSize * (currPage + 1);

    // data available in cache
    let dataAvailable = 0;
    if (this.cachedData[cacheKey]) {
      dataAvailable = this.cachedData[cacheKey].length;
    }


    // if the difference book available in cache and book needed is less than 10 then 
    // new books are fetched 
    if (dataAvailable - dataNeeded < 10) {
      this.fetchMoreBooks(dataAvailable, dataNeeded, cacheKey);
    }

    // if sufficient data is available in cache then the required books are emitted
    else {
      this.emitBooks(cacheKey);
      
    }
  }


  // fetch new books depending on the search request and stores them to cache
  fetchMoreBooks(dataAvailable: any, dataNeeded: any, cacheKey: any) {

    const offset = dataAvailable;
    const limit = 10 + dataNeeded - dataAvailable;
    const subjectName = this.subjectName;
    const response = this.callApiService(subjectName, offset, limit);

    response.subscribe((data: BookResponse) => {
      const newBooks = data?.works;

      // stores the new books in cache 
      if (this.cachedData[cacheKey])
        this.cachedData[cacheKey].push(...newBooks);
      else {
        this.cachedData[cacheKey] = newBooks;
      }

      // emits the books
      this.emitBooks(cacheKey);
    })
  }

  // calls the Subject Api to retrive new data
  callApiService(subjectName: string, offset: number, limit: number): Observable<BookResponse> {
    return this.apiService.get(`/subjects/${subjectName.toLowerCase().split(' ').join('_')}.json?offset=${offset}&limit=${limit}`);
  }


  // emits the books
  emitBooks(cacheKey: any) {
    if (this.cachedData[cacheKey]) {
      this.books = this.cachedData[cacheKey];
    }
    this.subjectEmitter.emit(this.subjectName);
    this.booksEmitter.emit(this.books.slice());
    console.log('books emiited', this.books, this.subjectName);

  }
}
