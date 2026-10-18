import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TOKEN_KEY } from './services/authentication.service';
import { makeToken } from '../testing/mock-token';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the admin navigation bar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.navbar-brand')?.textContent).toContain('Travlr Getaways Admin');
    expect(el.textContent).toContain('Log in');
    expect(el.textContent).not.toContain('Add Trip');
  });

  it('shows Add Trip, the user name and Log out when logged in', async () => {
    localStorage.setItem(TOKEN_KEY, makeToken(3600, 'Sadie'));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Add Trip');
    expect(text).toContain('Signed in as Sadie');
    expect(text).toContain('Log out');
  });

  afterEach(() => localStorage.clear());
});
