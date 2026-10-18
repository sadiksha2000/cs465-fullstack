import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TOKEN_KEY } from '../services/authentication.service';
import { makeToken } from '../../testing/mock-token';
import { TripListing } from './trip-listing';
import { TripDataService } from '../services/trip-data.service';
import { MOCK_TRIPS } from '../../testing/mock-trips';

describe('TripListing', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  let fixture: ComponentFixture<TripListing>;
  let service: { getTrips: ReturnType<typeof vi.fn>; deleteTrip: ReturnType<typeof vi.fn> };

  async function create(getTrips: unknown) {
    service = { getTrips: vi.fn().mockReturnValue(getTrips), deleteTrip: vi.fn().mockReturnValue(of(undefined)) };
    await TestBed.configureTestingModule({
      imports: [TripListing],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), { provide: TripDataService, useValue: service }]
    }).compileComponents();
    fixture = TestBed.createComponent(TripListing);
    await fixture.whenStable();
  }

  it('shows one card for every trip returned by the service', async () => {
    await create(of(MOCK_TRIPS));
    const cards = fixture.nativeElement.querySelectorAll('app-trip-card');
    expect(cards.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain("Dawson's Reef");
  });

  it('shows an error message when the API cannot be reached', async () => {
    await create(throwError(() => new Error('down')));
    expect(fixture.nativeElement.querySelector('.alert-danger')?.textContent).toContain('Could not load');
    expect(fixture.nativeElement.querySelectorAll('app-trip-card').length).toBe(0);
  });

  it('opens the edit page for the chosen trip', async () => {
    await create(of(MOCK_TRIPS));
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.componentInstance.editTrip(MOCK_TRIPS[1]);
    expect(navigate).toHaveBeenCalledWith(['/edit-trip', 'DAWR261205']);
  });

  it('deletes a trip and removes its card after the user confirms', async () => {
    await create(of(MOCK_TRIPS));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.componentInstance.deleteTrip(MOCK_TRIPS[0]);
    await fixture.whenStable();
    expect(service.deleteTrip).toHaveBeenCalledWith('GALR261114');
    expect(fixture.nativeElement.querySelectorAll('app-trip-card').length).toBe(1);
  });

  it('does not delete when the user cancels', async () => {
    await create(of(MOCK_TRIPS));
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    fixture.componentInstance.deleteTrip(MOCK_TRIPS[0]);
    expect(service.deleteTrip).not.toHaveBeenCalled();
  });

  it('shows Edit, Delete and Add Trip when logged in', async () => {
    localStorage.setItem(TOKEN_KEY, makeToken(3600));
    await create(of(MOCK_TRIPS));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.btn-outline-danger').length).toBe(2);
    expect(el.textContent).toContain('Add Trip');
  });

  it('hides Edit, Delete and Add Trip when logged out, but still lists the trips', async () => {
    await create(of(MOCK_TRIPS));
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-trip-card').length).toBe(2);
    expect(el.querySelectorAll('.btn-outline-danger').length).toBe(0);
    expect(el.textContent).not.toContain('Add Trip');
    expect(el.textContent).toContain('Log in to manage trips');
  });
});
