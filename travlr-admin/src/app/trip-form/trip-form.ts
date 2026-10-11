import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trip } from '../models/trip';

// The form used by both Add Trip and Edit Trip.
@Component({
  selector: 'app-trip-form',
  imports: [ReactiveFormsModule],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.css'
})
export class TripForm {
  private fb = inject(FormBuilder);

  trip = input<Trip | null>(null); // filled in when editing
  submitLabel = input('Save');
  errorMessage = input('');
  lockCode = input(false); // the trip code is the key in the URL, so it is locked while editing
  save = output<Trip>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required], // yyyy-mm-dd from the date picker
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const t = this.trip();
      if (t) {
        this.form.patchValue({ ...t, start: t.start ? t.start.substring(0, 10) : '' });
      }
    });
  }

  isInvalid(field: keyof Trip): boolean {
    const c = this.form.get(field as string);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as Trip);
  }
}
