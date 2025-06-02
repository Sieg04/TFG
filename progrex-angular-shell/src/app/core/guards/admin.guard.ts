import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.getUserRole() === 'admin') {
    return true;
  } else if (authService.isAuthenticated()) {
    // User is authenticated but not an admin
    // Redirect to a 'forbidden' page or home/dashboard
    // For now, redirecting to login, but a dedicated 'forbidden' page would be better UX
    router.navigate(['/auth/login']); // Or a '/forbidden' route
    return false;
  } else {
    // User is not authenticated
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
