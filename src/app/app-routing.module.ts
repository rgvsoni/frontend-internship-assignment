import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { TableViewComponent } from './shared/table-view/table-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Open Books Library',
    children: [
      {
        path: 'results-not-found',
        component: NotFoundComponent,
        title: 'no result found'
      },
      {
        path: 'view-table',
        component: TableViewComponent,
        title: 'books table',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
