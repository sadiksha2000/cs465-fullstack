# Travlr Getaways (CS-465, Module Seven)

Three parts:
- Express website + REST API (this folder), port 3000
- Angular admin SPA (`travlr-admin/`), port 4200
- MongoDB database `travlr`

Run (three terminals):
1. `mongod` (or `brew services start mongodb-community`)
2. `npm install && npm run seed && npm start`   (seed once; it loads `app_api/data/trips.json`)
3. `cd travlr-admin && npm install && npx ng serve`

Open http://localhost:4200 (admin) and http://localhost:3000/travel (public site).

## Security (Module Seven)
- Passwords are stored as a salted PBKDF2 hash, never as plain text.
- `POST /api/login` checks email and password (Passport local strategy) and returns a signed JSON Web Token that expires in 1 hour.
- `GET /api/trips` is public. `POST`, `PUT` and `DELETE` on `/api/trips` need the header `Authorization: Bearer <token>`; otherwise the API answers 401.
- `POST /api/register`: the very first user can be created without a token; after that a valid token is required.
- Set the environment variable `JWT_SECRET` to your own long random value for real use.

Unit tests: `cd travlr-admin && npx ng test`
