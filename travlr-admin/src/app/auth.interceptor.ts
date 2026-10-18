import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { API_BASE_URL } from './services/trip-data.service';

// Runs on every HTTP request the app makes. If the administrator is logged
// in, it adds the token to the Authorization header. If the API answers
// 401 (token missing, wrong, or expired) it logs out and shows the login page.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  const isApiCall = req.url.startsWith(API_BASE_URL);
  const isLoginCall = req.url === `${API_BASE_URL}/login`;
  const token = auth.getToken();

  const outgoing =
    isApiCall && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(outgoing).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && isApiCall && !isLoginCall) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
