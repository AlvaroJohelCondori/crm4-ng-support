import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'sales/visits',
    pathMatch: 'full',
  },
  {
    path: 'sales/visits',
    loadComponent: () =>
      import('./features/sales/components/visits/visits.component').then(
        (m) => m.VisitsComponent
      ),
  },
  {
    path: 'distribution/visits',
    loadComponent: () =>
      import('./features/distribution/components/visits/visits.component').then(
        (m) => m.VisitsComponent
      ),
  },
];
