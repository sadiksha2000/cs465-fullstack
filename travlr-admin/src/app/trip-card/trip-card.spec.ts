import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripCard } from './trip-card';
import { MOCK_TRIPS } from '../../testing/mock-trips';

describe('TripCard', () => {
  let fixture: ComponentFixture<TripCard>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TripCard] }).compileComponents();
    fixture = TestBed.createComponent(TripCard);
    fixture.componentRef.setInput('trip', MOCK_TRIPS[0]);
    fixture.componentRef.setInput('canEdit', true);
    await fixture.whenStable();
    el = fixture.nativeElement as HTMLElement;
  });

  it('hides Edit and Delete when nobody is logged in', async () => {
    fixture.componentRef.setInput('canEdit', false);
    await fixture.whenStable();
    expect(el.querySelector('.btn-primary')).toBeNull();
    expect(el.querySelector('.btn-outline-danger')).toBeNull();
    expect(el.textContent).toContain('Gale Reef'); // the trip itself is still public
  });

  it('shows the trip details', () => {
    expect(el.querySelector('.card-title')?.textContent).toContain('Gale Reef');
    expect(el.textContent).toContain('GALR261114');
    expect(el.textContent).toContain('Test Beach Resort');
    expect(el.textContent).toContain('USD 1899.00');
    expect(el.textContent).toContain('November 14, 2026');
  });

  it('points the picture at the Express images folder', () => {
    const img = el.querySelector('img') as HTMLImageElement;
    expect(img.src).toBe('http://localhost:3000/images/reef1.jpg');
  });

  it('emits the trip when Edit is clicked', () => {
    let emitted: unknown;
    fixture.componentInstance.edit.subscribe((t) => (emitted = t));
    (el.querySelector('.btn-primary') as HTMLButtonElement).click();
    expect(emitted).toEqual(MOCK_TRIPS[0]);
  });

  it('emits the trip when Delete is clicked', () => {
    let emitted: unknown;
    fixture.componentInstance.remove.subscribe((t) => (emitted = t));
    (el.querySelector('.btn-outline-danger') as HTMLButtonElement).click();
    expect(emitted).toEqual(MOCK_TRIPS[0]);
  });
});
