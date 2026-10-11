import { Trip } from '../app/models/trip';

// Mock data used by the unit tests, so no real server or database is needed.
export const MOCK_TRIPS: Trip[] = [
  {
    _id: '1',
    code: 'GALR261114',
    name: 'Gale Reef',
    length: '5 nights',
    start: '2026-11-14T00:00:00.000Z',
    resort: 'Test Beach Resort',
    perPerson: 'USD 1899.00',
    image: 'reef1.jpg',
    description: 'Mock description one.'
  },
  {
    _id: '2',
    code: 'DAWR261205',
    name: "Dawson's Reef",
    length: '7 nights',
    start: '2026-12-05T00:00:00.000Z',
    resort: 'Test Bay Resort',
    perPerson: 'USD 2399.00',
    image: 'reef2.jpg',
    description: 'Mock description two.'
  }
];
