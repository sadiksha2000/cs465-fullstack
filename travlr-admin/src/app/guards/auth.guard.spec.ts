import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { TOKEN_KEY } from '../services/authentication.service';
import { makeToken } from '../../testing/mock-token';

describe('authGuard', () => {
  const run = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
  });
  afterEach(() => localStorage.clear());

  it('lets a logged-in administrator through', () => {
    localStorage.setItem(TOKEN_KEY, makeToken(3600));
    expect(run()).toBe(true);
  });

  it('sends a visitor who is not logged in to the login page', () => {
    const result = run() as UrlTree;
    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });
});
