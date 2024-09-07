import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; 
      } else {
        return router.parseUrl('/login');
      }
    })
  );
};