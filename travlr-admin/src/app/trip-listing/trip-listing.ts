import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripCard } from '../trip-card/trip-card';
import { AuthenticationService } from '../services/authentication.service';

// Shows every trip as a card. Loads the data from the API through the service.
@Component({
  selector: 'app-trip-listing',
  imports: [TripCard, RouterLink],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  private tripService = inject(TripDataService);
  private router = inject(Router);
  protected auth = inject(AuthenticationService);

  trips = signal<Trip[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.tripService.getTrips().subscribe({
      next: (trips) => {
        this.trips.set(trips);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load the trips. Is the Express server running on port 3000?');
        this.loading.set(false);
      }
    });
  }

  editTrip(trip: Trip): void {
    this.router.navigate(['/edit-trip', trip.code]);
  }

  deleteTrip(trip: Trip): void {
    if (!confirm(`Delete the trip "${trip.name}" (${trip.code})?`)) {
      return;
    }
    this.tripService.deleteTrip(trip.code).subscribe({
      next: () => this.trips.update((list) => list.filter((t) => t.code !== trip.code)),
      error: () => this.errorMessage.set(`Could not delete ${trip.code}.`)
    });
  }
}
