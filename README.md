# Travlr Getaways (CS-465, Module Six)

Three parts:
- Express website + REST API (this folder), port 3000
- Angular admin SPA (`travlr-admin/`), port 4200
- MongoDB database `travlr`

Run (three terminals):
1. `mongod` (or `brew services start mongodb-community`)
2. `npm install && npm run seed && npm start`   (seed once; it loads `app_api/data/trips.json`)
3. `cd travlr-admin && npm install && npx ng serve`

Open http://localhost:4200 (admin) and http://localhost:3000/travel (public site).
Unit tests: `cd travlr-admin && npx ng test`
