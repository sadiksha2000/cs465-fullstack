import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripForm } from './trip-form';
import { MOCK_TRIPS } from '../../testing/mock-trips';

describe('TripForm', () => {
  let fixture: ComponentFixture<TripForm>;
  let comp: TripForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TripForm] }).compileComponents();
    fixture = TestBed.createComponent(TripForm);
    comp = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('does not emit save while required fields are empty', () => {
    const saved = vi.fn();
    comp.save.subscribe(saved);
    comp.submit();
    expect(saved).not.toHaveBeenCalled();
    expect(comp.form.invalid).toBe(true);
  });

  it('fills the form from the trip it is given (edit mode)', async () => {
    fixture.componentRef.setInput('trip', MOCK_TRIPS[0]);
    await fixture.whenStable();
    expect(comp.form.controls.name.value).toBe('Gale Reef');
    expect(comp.form.controls.start.value).toBe('2026-11-14');
  });

  it('emits the form values when everything is filled in', async () => {
    const saved = vi.fn();
    comp.save.subscribe(saved);
    fixture.componentRef.setInput('trip', MOCK_TRIPS[1]);
    await fixture.whenStable();
    comp.form.controls.name.setValue('Renamed Reef');
    comp.submit();
    expect(saved).toHaveBeenCalledTimes(1);
    expect(saved.mock.calls[0][0].name).toBe('Renamed Reef');
    expect(saved.mock.calls[0][0].code).toBe('DAWR261205');
  });
});
