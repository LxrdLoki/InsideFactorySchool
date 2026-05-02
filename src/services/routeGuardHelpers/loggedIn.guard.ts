import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const loggedInGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    const checkTokenValid = authService.validateToken(token);

    if (checkTokenValid) {
      return true;
    }
  }



  return router.createUrlTree(['/login']);
};
