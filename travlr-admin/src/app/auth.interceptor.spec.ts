import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { TOKEN_KEY } from './services/authentication.service';
import { API_BASE_URL } from './services/trip-data.service';
import { makeToken } from '../testing/mock-token';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('adds the token to API requests when logged in', () => {
    const token = makeToken(3600);
    localStorage.setItem(TOKEN_KEY, token);
    setup();
    http.get(`${API_BASE_URL}/trips`).subscribe();
    const req = ctrl.expectOne(`${API_BASE_URL}/trips`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush([]);
  });

  it('sends no Authorization header when logged out', () => {
    setup();
    http.get(`${API_BASE_URL}/trips`).subscribe();
    const req = ctrl.expectOne(`${API_BASE_URL}/trips`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('never sends the token to a different website', () => {
    localStorage.setItem(TOKEN_KEY, makeToken(3600));
    setup();
    http.get('https://example.com/data').subscribe();
    const req = ctrl.expectOne('https://example.com/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('logs out and goes to the login page when the API answers 401', () => {
    localStorage.setItem(TOKEN_KEY, makeToken(3600));
    setup();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    http.delete(`${API_BASE_URL}/trips/ABC`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${API_BASE_URL}/trips/ABC`).flush({ message: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
