import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Layout } from './layout/layout';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForumPage } from './forum-page/forum-page';
import { loggedInGuard } from '../services/routeGuardHelpers/loggedIn.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      },
      {
        path: 'forum',
        component: ForumPage,
        canActivate: [loggedInGuard]
      }
    ]
  }
];
