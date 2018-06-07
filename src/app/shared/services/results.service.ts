import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Results } from '../models/Results';
import { groupBy, map, sumBy, chain } from 'lodash';

@Injectable()
export class ResultsService {

  constructor(private http : HttpClient) {

   }

   public getResults(): any {
     return this.http.get("./assets/results.json");
   }

   public getSummary() : any{
    this.http.get("./assets/results.json").subscribe((data)=>{
     data = chain(data).map((item)=>({
        "partyName": item.partyName,
        "partyType": item.partyType,
        "stateName": item.stateName,
        "totalVotesPolledInState": +item.totalVotesPolledInState,
        "totalVotesInState": +item.totalVotesInState,
        "seatsWon": +item.seatsWon,
        "totalVotesPolledInStateForParty": +item.totalVotesPolledInStateForParty,
        "totalVotesPolledInStateForPartyPercentage": +item.totalVotesPolledInStateForPartyPercentage
     }))
     const results= chain(data).groupBy('partyName').map((party, id)=>({
        partyName: id,
        seatsWon: sumBy(party, 'seatsWon', Number),
        totalVotesInState: sumBy(party, 'totalVotesInState', Number),
      })).value();
      console.log(results);
      return results;
     })
   }
}
