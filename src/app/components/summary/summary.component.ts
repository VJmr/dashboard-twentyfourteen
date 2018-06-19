import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Results, States, Parties } from '../../shared/models';
import { groupBy, map, sumBy, chain, uniqBy, sort, find } from 'lodash';

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
  stackedColumnChartByVotes: any;
  stackedColumnChartByState: any;
  states = States;
  parties = Parties;
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
      //var data = chain(data).uniqBy('stateName').map('stateName').sort().value();


      let xCategoriesByState = this.states.map(state=>{
        return state.stateName;
      })

      let seriesByState = chain(data).groupBy('partyName').map((partyByState,_partyName)=>({
        name: _partyName,
        data : this.states.map(state=>{
          let x = find(partyByState, ['stateName', state.stateName]);
          return !x?0:x.seatsWon;
        })
      })).value();
      this.stackedColumnChartByState = {
      chart: {
        type: 'column',
        height: 800,
        width: 1150
    },
    title: {
        text: 'SEATS WON BY PARTIES BY STATE'
    },
    credits: {
      enabled: false
    },
    xAxis: {
        categories:xCategoriesByState
    },
    yAxis: {
        min: 0,
        title: {
            text: 'TOTAL NO OF SEATS'
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false,
                color: 'white'
            }
        }
    },
    series:seriesByState
  }
  // let xCategoriesByVotes = this.parties.map(party=>{
  //       return party.partyName;
  //     })

      let seriesByVotes = chain(data).groupBy('partyName').map((partyByVotes,_partyName)=>({
        name: _partyName,
        data : this.states.map(state=>{
          let x = find(partyByVotes, ['stateName', state.stateName]);
          return !x?0:x.totalVotesPolledInStateForParty;
        })
      })).value();
  this.stackedColumnChartByVotes = {
      chart: {
        type: 'column',
        height: 800,
        width: 1150
    },
    credits: {
      enabled: false
    },
    title: {
        text: 'VOTES WON BY PARTIES BY STATE'
    },
    xAxis: {
        categories:xCategoriesByState
    },
    yAxis: {
        min: 0,
        title: {
            text: 'TOTAL NO OF VOTES'
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false,
                color: 'white'
            }
        }
    },
    series:seriesByVotes
    }




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
        title: { text : 'VOTES SHARE'},
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            colors: this.parties.map(party=>{
            return party.color;
          })
          }
        },

        series: [{
          name : 'Votes polled for party',
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
        title: { text : 'SEATS SHARE'},
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            colors: this.parties.map(party=>{
            return party.color;
          })
          }
        },
        series: [{
          name : 'Seats won by party',
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
