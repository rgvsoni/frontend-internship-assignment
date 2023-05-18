import { Component, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService } from 'src/app/core/services/subjects.service';

@Component({
  selector: 'front-end-internship-assignment-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  // seleted trending subject
  selectedSubject: string;

  // value used in implementing focus in navbar searchbar
  flag = false;

  // events to be emitted in home component whenever a search option is selected
  @Output() seachRequest = new EventEmitter<string>();
  @Output() focusValue = new EventEmitter<boolean>();


  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.selectedSubject = "";
  }

  // calls the subject service whenever a subject is selected
  // sets teh subject name in subject service
  // fetches the required books and emits the books 
  // routes to table view component with query param = subject to display the books

  onClick(subjectName: string) {
    this.selectedSubject = subjectName;
    if (subjectName.length != 0) {
      this.subjectsService.setSubjectName(subjectName);

      // page number = 0, page size = 10
      this.subjectsService.getAllBooks(0, 10);


      this.router.navigate(['view-table'], { queryParams: { request: "subject" } });

    }
  }

  // emits the selected option and focus value events

  selectCatalog(catalog: any) {
    this.seachRequest.emit(catalog);
    this.flag = !this.flag
    this.focusValue.emit(this.flag);
  }
}
