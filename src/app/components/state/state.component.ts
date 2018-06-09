import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Results, States, Parties } from '../../shared/models';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  results: Observable<Results>;
  states = States;
  parties = Parties;
  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
    this.results= this.resultsService.getResults().map(res=>{
      return res.map(item=>{
        return new Results(
          item.partyName,
          item.partyType,
          item.stateName,
          +item.totalVotesPolledInState,
          +item.totalVotesInState,
          +item.seatsWon,
          +item.totalVotesPolledInStateForParty,
          +item.totalVotesPolledInStateForPartyPercentage
        )
      })
    });
  }

}
