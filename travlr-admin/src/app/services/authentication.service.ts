import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from './trip-data.service';

export const TOKEN_KEY = 'travlr-token';

interface TokenResponse {
  token: string;
}

interface TokenPayload {
  name?: string;
  email?: string;
  exp?: number; // expiry time, in seconds since 1970
}

// Handles logging in and out and remembers the token the API gives back.
// The token is kept in the browser's localStorage so a page refresh does
// not log the administrator out.
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private http = inject(HttpClient);

  private tokenSignal = signal<string | null>(this.readStoredToken());

  // True while a token exists and has not expired.
  readonly isLoggedIn = computed(() => this.isTokenValid(this.tokenSignal()));
  readonly userName = computed(() => {
    const payload = this.decode(this.tokenSignal());
    return payload?.name ?? payload?.email ?? '';
  });

  // POST /api/login. On success the token is saved.
  login(email: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${API_BASE_URL}/login`, { email, password })
      .pipe(tap((res) => this.saveToken(res.token)));
  }

  logout(): void {
    this.tokenSignal.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage can be blocked in private windows; the signal is cleared anyway
    }
  }

  // The token to send with admin requests, or null when logged out.
  getToken(): string | null {
    const token = this.tokenSignal();
    return this.isTokenValid(token) ? token : null;
  }

  private saveToken(token: string): void {
    this.tokenSignal.set(token);
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // keep the token in memory only
    }
  }

  private readStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  // The middle part of a token holds the user's details as base64 JSON.
  private decode(token: string | null): TokenPayload | null {
    if (!token) {
      return null;
    }
    try {
      const middle = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(middle)) as TokenPayload;
    } catch {
      return null;
    }
  }

  private isTokenValid(token: string | null): boolean {
    const payload = this.decode(token);
    return !!payload && !!payload.exp && payload.exp * 1000 > Date.now();
  }
}
