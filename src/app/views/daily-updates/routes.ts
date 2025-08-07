import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent),
    data: {
      title: 'Daily-Updates'
    }
  }
];
