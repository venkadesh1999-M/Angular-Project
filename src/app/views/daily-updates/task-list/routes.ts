import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../daily-updates.component').then(m => m.DailyUpdatesComponent),
    data: {
      title: 'Task-List',
    }
  }
];
