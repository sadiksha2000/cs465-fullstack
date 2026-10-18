import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from './login';
import { AuthenticationService } from '../services/authentication.service';

describe('Login', () => {
  async function setup(login: unknown) {
    const auth = { login: vi.fn().mockReturnValue(login) };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthenticationService, useValue: auth }]
    }).compileComponents();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    return { auth, navigate, fixture, comp: fixture.componentInstance };
  }

  it('shows an email field, a password field and a Log in button', async () => {
    const { fixture } = await setup(of({ token: 'x' }));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#email')).toBeTruthy();
    expect((el.querySelector('#password') as HTMLInputElement).type).toBe('password');
    expect(el.querySelector('button[type=submit]')?.textContent).toContain('Log in');
  });

  it('does not call the API when the form is empty', async () => {
    const { auth, comp } = await setup(of({ token: 'x' }));
    comp.submit();
    expect(auth.login).not.toHaveBeenCalled();
    expect(comp.form.invalid).toBe(true);
  });

  it('does not accept an email that is not an email', async () => {
    const { auth, comp } = await setup(of({ token: 'x' }));
    comp.form.setValue({ email: 'nope', password: 'secret123' });
    comp.submit();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('logs in with the typed values and goes to the trip list', async () => {
    const { auth, navigate, comp } = await setup(of({ token: 'x' }));
    comp.form.setValue({ email: 'admin@test.com', password: 'secret123' });
    comp.submit();
    expect(auth.login).toHaveBeenCalledWith('admin@test.com', 'secret123');
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('shows the API message when the password is wrong (401)', async () => {
    const err = new HttpErrorResponse({ status: 401, error: { message: 'Incorrect email or password' } });
    const { navigate, comp, fixture } = await setup(throwError(() => err));
    comp.form.setValue({ email: 'admin@test.com', password: 'wrongpass' });
    comp.submit();
    await fixture.whenStable();
    expect(comp.errorMessage()).toBe('Incorrect email or password');
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.alert-danger')?.textContent).toContain('Incorrect email or password');
  });
});
