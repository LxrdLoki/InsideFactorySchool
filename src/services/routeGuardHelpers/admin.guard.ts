import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }
  const validateToken = authService.validateToken(token);

  if (!validateToken) {
    return router.createUrlTree(['/login']);
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.role === 'ADMIN') {
      return true;
    }

    return router.createUrlTree(['/']);
  } catch {
    return router.createUrlTree(['/login']);
  }
};
