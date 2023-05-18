import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'front-end-internship-assignment-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnChanges {

  // search bar element 
  @ViewChild('autofocus') inputElement!: ElementRef;

  // selected option in sidebar search option
  @Input() searchRequest = "";

  // whether to focus the search bar or not
  @Input() focusValue = false;

  // search bar form control
  bookSearch: FormControl;

  // dropdown formcontrol
  dropdown: FormControl;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookSearch = new FormControl('');
    this.dropdown = new FormControl('catalog');

  }

  ngOnInit(): void {

    // gets triggered whenever the search bar observes changes 
    this.bookSearch.valueChanges
      .pipe(

        // only allows when the value of booksearch is different from the last time
        // was added to remove the search bar disable, enable events
        distinctUntilChanged(),

        // wait for 1 sec after change in value od booksearch has been registered
        debounceTime(1000),
      )
      .subscribe((searchValue: string) => {

        // allows the api call only when search value is a finite string
        // and dropdown value is not catalog

        if (
          searchValue.length !== 0 &&
          this.dropdown.value !== "catalog" &&
          searchValue.trim() != ''
        ) {

          // disables the search bar when the api call is made
          this.bookSearch.disable();

          const initPageNo = 0;
          const initPageSize = 10;

          // setting the search request and dropdown value in search service
          this.searchService.searchRequest(searchValue, this.dropdown.value);

          // it fetches the book in searchService and emits the books data 
          this.searchService.getAllBooksBySearch(initPageNo, initPageSize);

          // enables the search bar again after api calling is done
          this.bookSearch.enable();

          // navigates to table component to display books
          this.router.navigate(['view-table'], { queryParams: { request: "search" } });
        }
      });
  }
  // sets the dropdown value and focus value of search bar when an event is triggered in sidebar
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['searchRequest'] && this.searchRequest !== "") {

      this.dropdown = new FormControl(this.searchRequest);

      // removes the focus from search bar after 10 sec of the triggering event in sidebar
      if (this.inputElement.nativeElement) {
        setTimeout(() => {
          this.inputElement.nativeElement.focus();
          setTimeout(() => {
            this.inputElement.nativeElement.blur();
          }, 10000);
        });
      }

    }

    // if the same option is selected in search option again even then it focuses the search bar 
    // for 10 sec
    else {
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
        setTimeout(() => {
          this.inputElement.nativeElement.blur();
        }, 10000);
      });
    }
  }

  // clear button implementation
  onClear() {
    this.bookSearch = new FormControl('');
  }

}
