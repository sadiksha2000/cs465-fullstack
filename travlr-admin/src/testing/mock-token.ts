// Builds a fake (unsigned) token for tests. The app only reads the middle
// part, so this is enough to test login state without a real server.
export function makeToken(secondsFromNow: number, name = 'Test Admin'): string {
  const enc = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const exp = Math.floor(Date.now() / 1000) + secondsFromNow;
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc({ name, email: 'admin@test.com', exp })}.signature`;
}
