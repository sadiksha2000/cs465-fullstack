import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Trip } from '../models/trip';
import { IMAGE_BASE_URL } from '../services/trip-data.service';

// Displays ONE trip as a Bootstrap card. The list component gives it the
// trip, and the card tells the list when Edit or Delete is clicked.
@Component({
  selector: 'app-trip-card',
  imports: [DatePipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  trip = input.required<Trip>();
  canEdit = input(false); // Edit and Delete are shown only to a logged-in administrator
  edit = output<Trip>();
  remove = output<Trip>();

  imageUrl(): string {
    return `${IMAGE_BASE_URL}/${this.trip().image}`;
  }
}
