import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthenticationService, TOKEN_KEY } from './authentication.service';
import { API_BASE_URL } from './trip-data.service';
import { makeToken } from '../../testing/mock-token';

describe('AuthenticationService', () => {
  let http: HttpTestingController;

  function setup() {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthenticationService);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts logged out when no token is stored', () => {
    const auth = setup();
    expect(auth.isLoggedIn()).toBe(false);
    expect(auth.getToken()).toBeNull();
  });

  it('login posts the email and password, then stores the token', () => {
    const auth = setup();
    const token = makeToken(3600);
    auth.login('admin@test.com', 'secret123').subscribe();
    const req = http.expectOne(`${API_BASE_URL}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@test.com', password: 'secret123' });
    req.flush({ token });
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.userName()).toBe('Test Admin');
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token);
  });

  it('a failed login stays logged out', () => {
    const auth = setup();
    auth.login('admin@test.com', 'wrong').subscribe({ error: () => undefined });
    http.expectOne(`${API_BASE_URL}/login`).flush({ message: 'Incorrect email or password' }, { status: 401, statusText: 'Unauthorized' });
    expect(auth.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('logout clears the token', () => {
    localStorage.setItem(TOKEN_KEY, makeToken(3600));
    const auth = setup();
    expect(auth.isLoggedIn()).toBe(true);
    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('treats an expired stored token as logged out', () => {
    localStorage.setItem(TOKEN_KEY, makeToken(-60));
    const auth = setup();
    expect(auth.isLoggedIn()).toBe(false);
    expect(auth.getToken()).toBeNull();
  });

  it('treats a garbage token as logged out', () => {
    localStorage.setItem(TOKEN_KEY, 'not-a-token');
    expect(setup().isLoggedIn()).toBe(false);
  });
});
