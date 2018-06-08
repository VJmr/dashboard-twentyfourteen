import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Results, States, Parties } from '../../shared/models';
import { groupBy, map, sumBy, chain, uniqBy, pluck, sort } from 'lodash';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  results: Observable<Results>;
  resultsSummary: Observable<any>;
  optionsSeatsWons: any;
  optionsVotesPolled: any;
  constructor(private resultsService: ResultsService){ }
  ngOnInit(){
    console.log(States);
    console.log(Parties);
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
    this.resultsSummary = this.results.map(data=>{
      //var data = chain(data).uniqBy('stateName').map('stateName').sort().value();
      return chain(data).groupBy('partyName').map((party, _partyName)=>({
        partyName: _partyName,
        seatsWon: sumBy(party, 'seatsWon', Number),
        totalVotesInState: sumBy(party, 'totalVotesInState', Number),
        totalVotesPolledInState: sumBy(party, 'totalVotesPolledInState', Number),
        totalVotesPolledInStateForParty: sumBy(party, 'totalVotesPolledInStateForParty', Number),
      })).value();
    })

    this.resultsSummary.subscribe(parties=>{

      this.optionsVotesPolled = {
        chart: { type: 'pie' },
        title: { text : 'Votes share'},
        series: [{
          data:parties.map(party=>{
            return {
              name: party.partyName,
              y: party.totalVotesPolledInStateForParty
            }
          })
        }]
      };
      this.optionsSeatsWons = {
        chart: { type: 'pie' },
        title: { text : 'Seats share'},
        series: [{
          data:parties.map(party=>{
            return {
              name: party.partyName,
              y: party.seatsWon
            }
          })
        }]
      };
    })

  }
}
