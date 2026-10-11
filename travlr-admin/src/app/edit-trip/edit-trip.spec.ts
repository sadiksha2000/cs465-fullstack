import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { EditTrip } from './edit-trip';
import { TripDataService } from '../services/trip-data.service';
import { MOCK_TRIPS } from '../../testing/mock-trips';

describe('EditTrip', () => {
  async function setup() {
    const service = {
      getTrip: vi.fn().mockReturnValue(of(MOCK_TRIPS[0])),
      updateTrip: vi.fn().mockReturnValue(of(MOCK_TRIPS[0]))
    };
    await TestBed.configureTestingModule({
      imports: [EditTrip],
      providers: [
        provideRouter([]),
        { provide: TripDataService, useValue: service },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ code: 'GALR261114' }) } } }
      ]
    }).compileComponents();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(EditTrip);
    await fixture.whenStable();
    return { service, navigate, fixture, comp: fixture.componentInstance };
  }

  it('loads the trip named in the URL and shows it in the form', async () => {
    const { service, fixture } = await setup();
    expect(service.getTrip).toHaveBeenCalledWith('GALR261114');
    const name = fixture.nativeElement.querySelector('#name') as HTMLInputElement;
    expect(name.value).toBe('Gale Reef');
  });

  it('sends the update with PUT and goes back to the list', async () => {
    const { service, navigate, comp } = await setup();
    const changed = { ...MOCK_TRIPS[0], name: 'Gale Reef Deluxe' };
    comp.save(changed);
    expect(service.updateTrip).toHaveBeenCalledWith('GALR261114', changed);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});
