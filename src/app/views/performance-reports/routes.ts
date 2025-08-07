import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./performance-reports.component').then(m => m.PerformanceReportsComponent),
    data: {
      title: 'Performance Reports'
    }
  }
];
