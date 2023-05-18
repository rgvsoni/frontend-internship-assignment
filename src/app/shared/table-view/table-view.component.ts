import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Book } from 'src/app/core/models/book-response.model';
import { SearchService } from 'src/app/core/services/search.service';
import { SubjectsService } from 'src/app/core/services/subjects.service';

@Component({
  selector: 'front-end-internship-assignment-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})


export class TableViewComponent implements OnInit, AfterViewInit {

  // query parameter value in route
  query = "";
  subjectName = "";
  // page size value
  pageSize = 10;

  // current page number value
  currentPage = 1;

  // books to be displayed in table
  books: Book[] = [];

  // data to be displayed from Book objects
  displayedColumns = ["title", "authors", "first_publish_year"]


  // mat paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // dataSource of mat table
  dataSource = new MatTableDataSource<Book>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private subjectService: SubjectsService
  ) {}

  ngOnInit(): void {
    console.log('print')
    
    
  }


  ngAfterViewInit(): void {

    // observing the change of queryParams and creating the tables accordingly 
    // for subject request or search request
    
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.query = queryParams['request'];
      this.createTable();
      this.paginator.firstPage();
    })
    
  }

  // changing the entries of table when the page is changed

  pageChanged(event: PageEvent) {

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.query = queryParams['request'];
      this.updateTable();
      
    });
  }

  // creates table for the data which was emitted from services

  createTable() {

    if (this.query == "search") {
      this.subscribeSearchedBooks();
    }
    else {
      this.subscribeSubjectBooks();
    }
    
  }

  // updates the data which was emitted from the services when the page was changed

  updateTable() {
    if (this.query == "search") {
      this.searchService.getAllBooksBySearch(this.currentPage, this.pageSize);
      this.subscribeSearchedBooks();
    }
    else {
      this.subjectService.getAllBooks(this.currentPage, this.pageSize);
      this.subscribeSubjectBooks();
    }
  }

  subscribeSearchedBooks() {
    this.searchService.booksEmitter.subscribe(
      (data: Book[]) => {
        this.books = data;
        this.showContent();
      },
      (error) => {
        console.log(error + 'in extracting data');
      }
    )
  }

  subscribeSubjectBooks() {

    this.subjectService.subjectEmitter.subscribe(
      (data: string)=> {
        this.subjectName = data;
        console.log(data);
      },
      (error)=> {
        console.log(error + 'in subject name');
      }
    )
    this.subjectService.booksEmitter.subscribe(
      (data: Book[]) => {
        this.books = data;
        this.showContent();
      },
      (error) => {
        console.log(error + 'in extracting data');
      }
    )
  }

  showContent() {
    if (this.books.length == 0) {
      this.router.navigate(['results-not-found']);
    }
    console.log(this.subjectName, this.books);
    this.dataSource = new MatTableDataSource<Book>(this.books);
    this.dataSource.paginator = this.paginator;

  }
}
