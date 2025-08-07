import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee.component').then(m => m.EmployeeComponent),
    data: {
      title: 'Employee'
    }
  }
];
