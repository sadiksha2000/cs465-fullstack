import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripForm } from '../trip-form/trip-form';
import { apiMessage } from '../add-trip/add-trip';

// Edit Trip page: loads one trip (GET) and saves the changes (PUT).
@Component({
  selector: 'app-edit-trip',
  imports: [TripForm],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  private tripService = inject(TripDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  trip = signal<Trip | null>(null);
  errorMessage = signal('');
  code = '';

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code') ?? '';
    this.tripService.getTrip(this.code).subscribe({
      next: (trip) => this.trip.set(trip),
      error: (err: HttpErrorResponse) => this.errorMessage.set(apiMessage(err))
    });
  }

  save(updated: Trip): void {
    this.errorMessage.set('');
    this.tripService.updateTrip(this.code, updated).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => this.errorMessage.set(apiMessage(err))
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
