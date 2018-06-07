import { Component } from '@angular/core';
import {ResultsService} from './shared/services/results.service';

@Component({
  selector: 'dtf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private resultsService: ResultsService){

    this.resultsService.getResults().subscribe(d=>console.log(d));
    console.log(this.resultsService.getSummary());


  }
}
