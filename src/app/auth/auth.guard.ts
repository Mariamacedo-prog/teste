import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) =>  {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(localStorage.getItem('isLoggedIn') == 'true'){
    return true;
  }

  return router.parseUrl('/login');
};