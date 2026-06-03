import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

export const empleadoGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  if (isPlatformBrowser(platformId) && authService.isLoggedIn() && authService.hasRole('empleado')) {
    return true;
  }

  router.navigate(['/']);
  return false;
};