import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../shared/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import { Results, States, Parties } from '../../shared/models';
import { groupBy, map, sumBy, chain, uniqBy, pluck, sortBy, find, reverse } from 'lodash';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  results: Observable<Results>;
  states = States;
  parties = Parties;
  selectedState: string = 'Andaman & Nicobar Islands';
  partyResults: Results[];
  optionsStateVotes: any;
  individualStateScoreOptions: any;
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
    this.getOptions(this.selectedState);
  }

  onStateSelected(){
    this.getOptions(this.selectedState);
  }

  getOptions(selectedState: string){
    this.results.subscribe((data)=>{
      this.partyResults = groupBy(data, 'stateName')[selectedState];
      this.partyResults = reverse(sortBy(this.partyResults,'totalVotesPolledInStateForParty'));
      this.optionsStateVotes = {
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            colors: this.partyResults.map(result=>{
             let partyConstants = find(this.parties, ['partyName',result.partyName])
             return partyConstants.color;
          })
          }
        },
        chart: { type: 'pie' },
        title: { text : 'EACH PARTY VOTE SHARE'},
        series:[{
          data: this.partyResults.map((result,index)=>{
            return {
              name: result.partyName,
              y: result.totalVotesPolledInStateForParty

            }
          })
        }]
      };

      this.individualStateScoreOptions = this.partyResults.map((result,index)=>{
        let partyConstants = find(this.parties, ['partyName',result.partyName])
        return {
          chart: {
            type : 'bar',
            height: 80
          },
          title: {
            text: result.partyName
          },
          credits: {
            enabled: false
          },
          navigation: {
            buttonOptions: {
              enabled: false
            }
          },
          xAxis: {
            visible: false,
          },
          yAxis: {
            visible: false,

          },
          series:[{
            data : [result.totalVotesPolledInState],
            grouping: false,
            animation: false,
            enableMouseTracking: false,
            showInLegend: false,
            color: 'grey',
            pointWidth: 25,
            borderWidth: 1,
            //result.totalVotesPolledInState
          },
          {
            data : [result.totalVotesPolledInStateForParty],
            grouping: false,
            animation: false,
            enableMouseTracking: false,
            showInLegend: false,
            color: partyConstants.color,
            pointWidth: 25,
            borderWidth: 1,
            //result.totalVotesPolledInState
          }
        ]
        }
      })
      console.log(this.individualStateScoreOptions);
    })
  }
}
