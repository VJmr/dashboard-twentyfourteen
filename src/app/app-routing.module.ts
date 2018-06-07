import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { PartyComponent } from './components/party/party.component';
import { StateComponent } from './components/state/state.component';

const routes: Routes = [
  { path: '', redirectTo: 'summary', pathMatch: 'full'},
  { path: 'summary', component: SummaryComponent},
  { path: 'by-party', component: PartyComponent},
  { path: 'by-state', component: StateComponent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
