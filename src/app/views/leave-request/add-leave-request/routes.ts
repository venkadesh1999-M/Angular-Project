import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./add-leave-request.component').then(m => m.AddLeaveRequestComponent),
    data: {
      title: 'Add-leave'
    }
  }
];
