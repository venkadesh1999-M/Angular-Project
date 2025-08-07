import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./add-employee.component').then(m => m.AddEmployeeComponent),
    data: {
      title: 'Add-employee'
    }
  }
];
