import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripForm } from '../trip-form/trip-form';

// Add Trip page: sends the form to the API with POST.
@Component({
  selector: 'app-add-trip',
  imports: [TripForm],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip {
  private tripService = inject(TripDataService);
  private router = inject(Router);
  errorMessage = signal('');

  save(trip: Trip): void {
    this.errorMessage.set('');
    this.tripService.addTrip(trip).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => this.errorMessage.set(apiMessage(err))
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}

// Builds a readable message from the API's JSON error body.
export function apiMessage(err: HttpErrorResponse): string {
  const body = err.error;
  if (body && body.message) {
    return body.errors?.length ? `${body.message}: ${body.errors.join(', ')}` : body.message;
  }
  return 'The server could not be reached. Is Express running on port 3000?';
}
