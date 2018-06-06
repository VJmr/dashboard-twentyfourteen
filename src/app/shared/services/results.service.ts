import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Results } from '../models/Results';

@Injectable()
export class ResultsService {

  constructor(private http : HttpClient) {

   }

   public getResults(): any {
     return this.http.get("./assets/results.json");
   }
}
