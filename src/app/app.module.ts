import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app-routing.module';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';

import {ResultsService} from './shared/services/results.service';
import { SidenavComponent } from './layout/sidenav.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    NgbModule.forRoot()
  ],
  providers: [ResultsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
