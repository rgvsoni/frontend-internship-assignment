import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { Book } from '../models/book-response.model';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/search-response.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {


  // stores the data of books to be emitted 
  books: Book[] = [];

  // temporary variable
  bookList = [];

  // book data emitter
  booksEmitter: EventEmitter<Book[]> = new EventEmitter<Book[]>();

  // cached data
  cachedData: { [cacheKey: string]: Book[] } = {};

  // book name to be searhed
  search: string;

  // dropdown value 
  selectedRequest: string


  constructor(private apiService: ApiService) {
    this.books = [];
    this.search = "";
    this.selectedRequest = "";
  }

  // it sets the value of bookname and dropdown in this service from navbar component
  searchRequest(searchRequest: string, dropdown: string) {
    this.search = searchRequest;
    this.selectedRequest = dropdown;
    console.log(searchRequest, dropdown);
  }

  // returns the books for a subject. (never used)
  getBooks() {
    return this.books;
  }

  // fetches all the books till a page number with a page size
  getAllBooksBySearch(currPage: number, pageSize: number): void {

    // books needed to display entries till page num = currpage
    const dataNeeded = pageSize * (currPage + 1);

    // cache key for the search request
    const cacheKey = `${this.selectedRequest}_${this.search}`;

    // books available in cached data
    let dataAvailable = 0;

    // if there is data for the perticular search request then changes the value
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
    const dropdown = this.selectedRequest;

    let response;
    if (dropdown == "title") {
      const bookName = this.search;
      response = this.callTitleApiService(bookName, offset, limit);
    }
    else {
      const authorName = this.search;
      response = this.callAuthorApiService(authorName, offset, limit)
    }

    response.subscribe((data: SearchResponse) => {

      this.bookList = data?.docs;

      // converts the Search Response Docs data type to Book interface type
      const newBooks = this.makeBookStruc();

      // caching is done here
      if (this.cachedData[cacheKey])
        this.cachedData[cacheKey].push(...newBooks);
      else {
        this.cachedData[cacheKey] = newBooks;
      }

      this.emitBooks(cacheKey);
    })


  }

  // calls the API service for search request based on title

  callTitleApiService(bookName: string, offset: number, limit: number): Observable<SearchResponse> {
    return this.apiService.get(`/search.json?title=${bookName.toLowerCase().split(' ').join('+')}&offset=${offset}&limit=${limit}`);
  }

  // call the API for search request based on author name

  callAuthorApiService(authorName: string, offset: number, limit: number): Observable<SearchResponse> {
    return this.apiService.get(`/search.json?author=${authorName.toLowerCase().split(' ').join('+')}&offset=${offset}&limit=${limit}`);
  }


  // converts the docs data to book data

  makeBookStruc() {
    const bookStrucData: any = []
    this.bookList.forEach((value: any) => {
      const obj: any = {};
      obj.key = value.key;
      obj.title = value.title;
      obj.authors = []

      const length = typeof value.author_key === undefined ? 0 : value.author_key.length;
      for (let i = 0; i < length; i++) {
        const temp: any = {}
        temp.key = `/authors/${value.author_key[i]}`
        temp.name = value.author_name[i]
        obj.authors.push(temp)
        console.log(obj);
      };
      obj.first_publish_year = value.first_publish_year
      bookStrucData.push(obj)
    })
    return bookStrucData;
  }


  // emits books data for the search request

  emitBooks(cacheKey: any) {
    if (this.cachedData[cacheKey]) {
      this.books = this.cachedData[cacheKey];
    }
    this.booksEmitter.emit(this.books.slice());
  }
}




// else {
//   const authorName = this.search
//   const response: Observable<SearchResponse> = this.apiService.get(`/search.json?author=${authorName.toLowerCase().split(' ').join('+')}&offset=${offset}&limit=${pageSize}`);
//   response.subscribe((data: SearchResponse) => {
//     this.bookList = data?.docs;
//     this.books = this.makeBookStruc();
//     this.booksEmitter.emit(this.books);
//   })
// }


// const offset = pageSize * (currPage);
//   const dropdown = this.selectedRequest;
//     console.log(offset, dropdown)
//   if(dropdown == "title") {
//   const bookName = this.search;
//   const response: Observable<SearchResponse> = this.apiService.get(`/search.json?title=${bookName.toLowerCase().split(' ').join('+')}&offset=${offset}&limit=${pageSize}`);
//   response.subscribe((data: SearchResponse) => {
//     this.bookList = data?.docs;
//     this.books = this.makeBookStruc();
//     this.booksEmitter.emit(this.books);
//   })