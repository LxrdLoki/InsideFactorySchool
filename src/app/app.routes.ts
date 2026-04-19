import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Dashboard
      }
    ]
  }
];
