import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import { Results, States, Parties } from '../../shared/models';
import { groupBy, map, sumBy, chain, uniqBy, pluck, sort, find } from 'lodash';

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
  optionsPartyVotes: any;
  partyResults: Results[];
  constructor(private resultsService: ResultsService) {

   }

  onPartySelected(){
    this.getOptions(this.selectedParty)
  }

  getOptions(selectedParty: string){
    this.results.subscribe((data)=>{
      this.partyResults = groupBy(data, 'partyName')[selectedParty];
      console.log(this.partyResults);
      data = chain(data).groupBy('partyName').map((party, _partyName)=>({
        partyName: _partyName,
        totalVotesPolledInState: sumBy(party, 'totalVotesPolledInState', Number),
        totalVotesPolledInStateForParty: sumBy(party, 'totalVotesPolledInStateForParty', Number),
      })).value();

      let partydata = find(data,['partyName',selectedParty]);
      this.optionsPartyVotes = {
        credits: {
          enabled: false
        },
        chart: { type: 'pie' },
        title: { text : 'TOTAL NO OF VOTES IN CONTESTED STATES TO TOTAL VOTES POLLED TO PARTY'},
        plotOptions: {
          pie: {
            colors: ['#7cb5ec','#90ed7d']
          }
        },
        series:[{
          data:[{name: 'Total', y: partydata.totalVotesPolledInState},{name: selectedParty, y: partydata.totalVotesPolledInStateForParty}]
        }]
      };

    })



  }

  ngOnInit() {
    this.results = this.resultsService.getResults().map(res=>{
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

    this.getOptions(this.selectedParty);
  }


}
