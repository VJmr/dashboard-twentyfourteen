import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Results } from '../../shared/models/Results';
import { groupBy, map, sumBy, chain } from 'lodash';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  results: Observable<Results>;
  resultsSummary: Observable<any>;
  seatsWonSummary: Observable<any>;
  votesPolledSummary: any;
  optionsSeatsWons: any;
  optionsVotesPolled: any;
  constructor(private resultsService: ResultsService){ }
  ngOnInit(){
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
      return chain(data).groupBy('partyName').map((party, _partyName)=>({
        partyName: _partyName,
        seatsWon: sumBy(party, 'seatsWon', Number),
        totalVotesInState: sumBy(party, 'totalVotesInState', Number),
        totalVotesPolledInState: sumBy(party, 'totalVotesPolledInState', Number),
        totalVotesPolledInStateForParty: sumBy(party, 'totalVotesPolledInStateForParty', Number),
      })).value();
    })

    this.seatsWonSummary = this.resultsSummary.map(d=>{
      return d.map(party=>({
        name: party.partyName,
        y: party.seatsWon
      }))
    })

    this.votesPolledSummary = this.resultsSummary.map(d=>{
      return d.map(party=>({
        name: party.partyName,
        y: party.totalVotesPolledInStateForParty
      }))
    })
    this.seatsWonSummary.subscribe(d=>{
      this.optionsSeatsWons = {
        chart: { type: 'pie' },
        title: { text : 'Seats share'},
        series: [{
          data:d
        }]
      };
    })
    this.votesPolledSummary.subscribe(d=>{
      this.optionsVotesPolled = {
        chart: { type: 'pie' },
        title: { text : 'Votes share'},
        series: [{
          data:d
        }]
      };
    })
  }
}
