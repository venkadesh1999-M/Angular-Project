import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./leave-request.component').then(m => m.LeaveRequestComponent),
    data: {
      title: 'leave'
    }
  }
];
