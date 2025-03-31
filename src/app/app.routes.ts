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
    path: 'sales/orders',
    loadComponent: () =>
      import('./features/sales/components/orders/orders.component').then(
        (m) => m.OrdersComponent
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
