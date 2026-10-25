# Travlr Getaways (CS 465 Full Stack Development I)

Travlr Getaways is a MEAN stack (MongoDB, Express, Angular, Node.js) travel booking application. It has a public customer website and a secure administrator single-page application, and both use the same REST API and database.

**Author:** Sadiksha Pathak

## Project Structure

- `app.js`, `app_server/` : Express customer-facing website (routes, controllers, Handlebars views)
- `app_api/` : REST API (routes, controllers, Mongoose models, seed data, login security)
- `travlr-admin/` : Angular administrator SPA
- `public/` : static files and images

## Run It

1. Start MongoDB (`mongod` or `brew services start mongodb-community`).
2. In the project folder: `npm install && npm run seed && npm start` (seed once; it loads `app_api/data/trips.json`).
3. In another terminal: `cd travlr-admin && npm install && npx ng serve`.

Open http://localhost:4200 for the admin app and http://localhost:3000/travel for the public site.

## Security

- Passwords are stored as salted PBKDF2 hashes, never as plain text.
- `POST /api/login` returns a signed JSON Web Token that expires in 1 hour.
- `GET /api/trips` is public. `POST`, `PUT` and `DELETE` need the header `Authorization: Bearer <token>`, otherwise the API answers 401.
- `POST /api/register`: the first user can be created without a token; after that a token is required.
- Set the `JWT_SECRET` environment variable to a long random value for real use.

Unit tests: `cd travlr-admin && npx ng test`

# Module Eight Journal

## Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

The customer-facing website uses Express with Handlebars. When a visitor asks for a page, the server asks the API for the trips, fills a template with that data, and sends back finished HTML. The browser only displays it, and every click loads a whole new page. That approach is simple, fast to load, and easy for search engines to read, which suits a public site where people mostly browse. Plain JavaScript in the browser added small touches, such as the page scripts and the fetch calls, but the server still did most of the work.

The admin side is an Angular single-page application. It downloads once, then runs in the browser and talks to the API for data only. Routing swaps components in and out without reloading the page, so adding, editing or deleting a trip updates the card list right away. The cost is a heavier first load and more moving parts, such as a build step, routing, services and login state. I would use Express HTML for pages people only read, and a SPA for tools people use often and change data in.

**Why did the backend use a NoSQL MongoDB database?**

The trip data is a set of self-contained records (code, name, resort, dates, price, description, image), and MongoDB stores each one as a single document with no joins needed. It stores data as JSON-like documents, so the same shape travels from the database through Express to Angular without conversion. Mongoose adds a schema with required fields and types, so I still get validation. A NoSQL database is also flexible: if Travlr adds new trip fields later, existing documents are not broken, and it fits naturally with the rest of the MEAN stack.

## Functionality

**How is JSON different from JavaScript and how does JSON tie together the frontend and backend development pieces?**

JavaScript is a programming language that can hold logic such as functions, loops and conditions. JSON is only a text format for data: keys and values, with no functions, no comments and strict quoting rules. JavaScript can turn a JSON string into an object and back again. JSON is the common language of the whole project. MongoDB returns documents, Express sends them as JSON, the Handlebars controller reads that JSON to fill templates, and Angular receives the same JSON through HttpClient and maps it to a Trip model. Requests from the admin app (such as adding a trip) go back in the same format, and the login token is sent as JSON too. Because every tier agrees on this format, each piece can change independently as long as the JSON stays the same.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

I refactored several times. First, I moved the website from static HTML to Handlebars templates, so trips render from data instead of being typed in. Next, I separated the website from the data: the website controller stopped reading the database and instead calls the REST API, which meant one set of data code served both the website and the Angular app. In the API, I moved the trip logic into a controller and added proper status codes (201, 400, 404, 409, 204). In Angular, I pulled all HTTP calls into one trip data service, and I built one trip form component that both the Add and Edit pages use. In Module Seven I refactored again for security: login and register controllers, a token check middleware that protects the POST, PUT and DELETE routes, an HTTP interceptor that adds the token automatically, and a route guard that protects the add and edit pages.

Reusable UI components pay off in several ways. The trip card and trip form are written once and used in many places, so a fix or design change happens in one file. They keep the look consistent, make testing easier because each component can be tested alone with mock data, and make new features faster to build, since a new page can assemble components that already exist.

## Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**

An endpoint is a URL that represents a resource, such as /api/trips, and the HTTP method says what to do with it: GET reads, POST creates, PUT updates and DELETE removes. Each combination needs its own tests, and each should be tested for both success and failure: 200 and 201 when everything is right, and 400 for bad input, 404 for a missing trip, 409 for a duplicate code, and 401 for a missing or expired token. I tested these in Postman, in Angular unit tests with mock data, and end to end in the browser.

Security makes testing harder because many endpoints can no longer be called by themselves. In Postman I first had to log in to get a token, then copy it into the Authorization header for every protected request, and the token expires after an hour. I also had to test the negative cases, such as calling POST, PUT or DELETE with no token and confirming the API refused. In Angular, I had to test that the interceptor adds the token, that the guard redirects a logged-out user, and that the Edit and Delete buttons are hidden when nobody is signed in. Passwords are stored as salted hashes and the login message is the same for an unknown email and a wrong password. Security is not one feature but a layer on every part of the stack, and each layer needs its own tests.

## Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

My goal is a career as a software developer, and this course gave me a complete project I can show an employer. I built every tier myself: a MongoDB database with a Mongoose schema, an Express REST API, a server-rendered customer website, an Angular single-page application, and a secure login with JSON Web Tokens. I learned to design before coding by using component and sequence diagrams in a software design document, to build and test an API with Postman, to write unit tests for Angular with mock data, and to use Git branches for each module. I also learned to debug problems that cross layers, such as CORS errors and 401 responses. These are skills that employers list for full stack roles, and the finished GitHub repository shows that I can plan, build, secure and test a real application from start to finish.
