import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Results, States, Parties } from '../../shared/models';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {
  results: Observable<Results>;
  states = States;
  parties = Parties;
  selectedParty : string = 'Bahujan Samaj Party';
  partyPieOptions: any;
  constructor(private resultsService: ResultsService) {
    this.getOptions(this.selectedParty);
   }
  
  onPartySelected(){
    console.log(this.selectedParty);
  }

  getOptions(selectedParty: string){

  }
  
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
