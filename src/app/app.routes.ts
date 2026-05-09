import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Layout } from './layout/layout';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForumPage } from './forum-page/forum-page';
import { loggedInGuard } from '../services/routeGuardHelpers/loggedIn.guard';
import { AllFromCategory } from './forum-page/all-from-category/all-from-category';
import { SinglePost } from './forum-page/all-from-category/single-post/single-post';
import { NewForumPost } from './forum-page/new-forum-post/new-forum-post';

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
      },
      {
        path: 'forum/create/new-post',
        component: NewForumPost,
        canActivate: [loggedInGuard]
      },
      {
        path: 'forum/post/:id',
        component: SinglePost,
        canActivate: [loggedInGuard]
      },
      {
        path: 'forum/:subject',
        component: AllFromCategory,
        canActivate: [loggedInGuard]
      },
    ]
  }
];
