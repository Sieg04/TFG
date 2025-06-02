import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Correct path

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log(`[AuthInterceptor] Intercepting request to: ${req.url}`); // Log URL
  console.log(`[AuthInterceptor] Token from AuthService: ${token}`); // Log token

  if (token) {
    console.log('[AuthInterceptor] Token found, cloning request with Authorization header.');
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedRequest);
  } else {
    console.log('[AuthInterceptor] No token found, passing original request.');
  }

  return next(req);
};
