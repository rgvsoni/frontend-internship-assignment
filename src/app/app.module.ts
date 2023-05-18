import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from '../app/components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { MatMenuModule } from '@angular/material/menu';

// const ngxUiLoaderConfig: NgxUiLoaderConfig =
// {
//   "bgsColor": "#3871b7",
//   "bgsOpacity": 0.5,
//   "bgsPosition": "bottom-right",
//   "bgsSize": 60,
//   "bgsType": "ball-spin-clockwise",
//   "blur": 3,
//   "delay": 0,
//   "fastFadeOut": true,
//   "fgsColor": "#3871b7",
//   "fgsPosition": "center-center",
//   "fgsSize": 60,
//   "fgsType": "ball-spin-clockwise",
//   "gap": 24,
//   "logoPosition": "center-center",
//   "logoSize": 120,
//   "logoUrl": "",
//   "masterLoaderId": "master",
//   "overlayBorderRadius": "0",
//   "overlayColor": "rgba(230,224,224,0.8)",
//   "pbColor": "#3871b7",
//   "pbDirection": "ltr",
//   "pbThickness": 3,
//   "hasProgressBar": true,
//   "text": "Progress...",
//   "textColor": "#3871b7",
//   "textPosition": "center-center",
//   "maxTime": -1,
//   "minTime": 300
// }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatMenuModule,
    NgxUiLoaderModule,
    MatProgressSpinnerModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})


export class AppModule {}
