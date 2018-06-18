import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular2-highcharts';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { routing } from './app-routing.module';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

import {ResultsService} from './shared/services/results.service';
import { SidenavComponent } from './layout/sidenav.component';
import { SummaryComponent } from './components/summary/summary.component';
import { PartyComponent } from './components/party/party.component';
import { StateComponent } from './components/state/state.component';

declare var require: any;

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  dd(hc);

  return hc;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    SummaryComponent,
    PartyComponent,
    StateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    FormsModule,
    NgbModule.forRoot(),
    ChartModule
  ],
  providers: [ResultsService,{
          provide: HighchartsStatic,
          useFactory: highchartsFactory
        }],
  bootstrap: [AppComponent]
})
export class AppModule { }
