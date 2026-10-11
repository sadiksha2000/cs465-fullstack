import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

// Base URL of the Express server. The API lives under /api.
export const API_BASE_URL = 'http://localhost:3000/api';
// Express also serves the trip pictures from /images.
export const IMAGE_BASE_URL = 'http://localhost:3000/images';

// Talks to the Travlr REST API. One method for each HTTP verb.
@Injectable({ providedIn: 'root' })
export class TripDataService {
  private http = inject(HttpClient);
  private tripsUrl = `${API_BASE_URL}/trips`;

  // GET /api/trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  // GET /api/trips/:code
  getTrip(code: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.tripsUrl}/${encodeURIComponent(code)}`);
  }

  // POST /api/trips
  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripsUrl, trip);
  }

  // PUT /api/trips/:code
  updateTrip(code: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.tripsUrl}/${encodeURIComponent(code)}`, trip);
  }

  // DELETE /api/trips/:code  (the API answers 204 No Content)
  deleteTrip(code: string): Observable<void> {
    return this.http.delete<void>(`${this.tripsUrl}/${encodeURIComponent(code)}`);
  }
}
