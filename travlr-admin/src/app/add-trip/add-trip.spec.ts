import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AddTrip } from './add-trip';
import { TripDataService } from '../services/trip-data.service';
import { MOCK_TRIPS } from '../../testing/mock-trips';

describe('AddTrip', () => {
  async function setup(addTrip: unknown) {
    const service = { addTrip: vi.fn().mockReturnValue(addTrip) };
    await TestBed.configureTestingModule({
      imports: [AddTrip],
      providers: [provideRouter([]), { provide: TripDataService, useValue: service }]
    }).compileComponents();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(AddTrip);
    await fixture.whenStable();
    return { service, navigate, comp: fixture.componentInstance };
  }

  it('posts the trip and returns to the list on success', async () => {
    const { service, navigate, comp } = await setup(of(MOCK_TRIPS[0]));
    comp.save(MOCK_TRIPS[0]);
    expect(service.addTrip).toHaveBeenCalledWith(MOCK_TRIPS[0]);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('shows the API message when the trip code already exists (409)', async () => {
    const err = new HttpErrorResponse({ status: 409, error: { message: 'A trip with code GALR261114 already exists' } });
    const { navigate, comp } = await setup(throwError(() => err));
    comp.save(MOCK_TRIPS[0]);
    expect(comp.errorMessage()).toContain('already exists');
    expect(navigate).not.toHaveBeenCalled();
  });
});
