import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL, TripDataService } from './trip-data.service';
import { MOCK_TRIPS } from '../../testing/mock-trips';

describe('TripDataService', () => {
  let service: TripDataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TripDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getTrips sends GET /trips and returns the trips', () => {
    let result: unknown;
    service.getTrips().subscribe((t) => (result = t));
    const req = http.expectOne(`${API_BASE_URL}/trips`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_TRIPS);
    expect(result).toEqual(MOCK_TRIPS);
  });

  it('getTrip sends GET /trips/:code', () => {
    let result: unknown;
    service.getTrip('GALR261114').subscribe((t) => (result = t));
    const req = http.expectOne(`${API_BASE_URL}/trips/GALR261114`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_TRIPS[0]);
    expect(result).toEqual(MOCK_TRIPS[0]);
  });

  it('addTrip sends POST /trips with the trip in the body', () => {
    service.addTrip(MOCK_TRIPS[0]).subscribe();
    const req = http.expectOne(`${API_BASE_URL}/trips`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK_TRIPS[0]);
    req.flush(MOCK_TRIPS[0], { status: 201, statusText: 'Created' });
  });

  it('updateTrip sends PUT /trips/:code with the trip in the body', () => {
    service.updateTrip('GALR261114', MOCK_TRIPS[0]).subscribe();
    const req = http.expectOne(`${API_BASE_URL}/trips/GALR261114`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(MOCK_TRIPS[0]);
    req.flush(MOCK_TRIPS[0]);
  });

  it('deleteTrip sends DELETE /trips/:code', () => {
    service.deleteTrip('GALR261114').subscribe();
    const req = http.expectOne(`${API_BASE_URL}/trips/GALR261114`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
