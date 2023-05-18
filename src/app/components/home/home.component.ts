import { Component } from '@angular/core';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  // selected option in search option of sidebar
  searchRequest = "";

  // tells whether to focus the search bar in navbar
  focus = false;
  
  request(event: string) {
    this.searchRequest = event;
  }
  focusValue(event: boolean) {
    this.focus = event;
  }
}
