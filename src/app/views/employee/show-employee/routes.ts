import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./show-employee.component').then(m => m.ShowEmployeeComponent),
    data: {
      title: 'show-employee'
    }
  }
];
