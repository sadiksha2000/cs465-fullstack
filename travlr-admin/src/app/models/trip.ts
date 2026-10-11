// Shape of one trip document returned by the Express API (/api/trips).
export interface Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;
  start: string; // ISO date string, for example 2026-11-14T00:00:00.000Z
  resort: string;
  perPerson: string;
  image: string;
  description: string;
}
