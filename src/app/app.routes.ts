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
    path: 'sales/collections',
    loadComponent: () =>
      import(
        './features/sales/components/collections/collections.component'
      ).then((m) => m.CollectionsComponent),
  },
  {
    path: 'sales/users',
    loadComponent: () =>
      import('./features/sales/components/users/users.component').then(
        (m) => m.UsersComponent
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
