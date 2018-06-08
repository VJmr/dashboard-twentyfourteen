export class Results{
  constructor(public partyName: string, public partyType: string, public stateName: string, public totalVotesPolledInState: number,
    public totalVotesInState: number, public seatsWon: number, public totalVotesPolledInStateForParty: number, public totalVotesPolledInStateForPartyPercentage: number){
  }
}
