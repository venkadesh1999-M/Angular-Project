import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { RoleGuard } from './guards/role.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        // canActivate: [RoleGuard],
      },
      {
        path: 'employee',
        loadChildren: () => import('./views/employee/routes').then(m => m.routes),
        canActivate: [RoleGuard],

      },
      {
        path: 'show-employee',
        loadChildren: () => import('./views/employee/show-employee/routes').then(m => m.routes),
        canActivate: [RoleGuard],

      },
      {
        path: 'add-employee',
        loadChildren: () => import('./views/employee/add-employee/routes').then(m => m.routes),
        canActivate: [RoleGuard],
      },
      {
        path: 'leave',
        loadChildren: () => import('./views/leave-request/routes').then(m => m.routes),
      },
      {
        path: 'Add-leave',
        loadChildren: () => import('./views/leave-request/add-leave-request/routes').then(m => m.routes),
        // canActivate: [RoleGuard],
      },
      {
        path: 'Holidays',
        loadChildren: () => import('./views/holidays/routes').then(m => m.routes),
        canActivate: [RoleGuard],
      },
      {
        path: 'Daily-Updates',
        loadChildren: () => import('./views/daily-updates/routes').then(m => m.routes),
        canActivate: [RoleGuard],
      },
      {
        path: 'Task-List',
        loadChildren: () => import('./views/daily-updates/task-list/routes').then(m => m.routes),
        canActivate: [RoleGuard],
      },
      {
        path: 'performance',
        loadChildren: () => import('./views/performance-reports/routes').then(m => m.routes),
        canActivate: [RoleGuard],
      },

      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
