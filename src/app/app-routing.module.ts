import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
