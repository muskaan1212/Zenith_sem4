# Backend Documentation

## 1. Project Overview (Backend Focus)

The backend of this project is built with **Node.js** and **Express.js**. Its main purpose is to:

- receive requests from the React frontend
- process data
- manage business logic
- return responses in JSON or server-rendered HTML
- handle authentication, sessions, and real-time communication

This project uses a **client-server architecture**:

- The **React frontend** works as the client.
- The **Express backend** works as the server.
- The client sends requests to the server.
- The server processes them and sends responses back.

### Purpose of the Backend

The backend is responsible for:

- handling API requests like appointments, records, feedback, and prescriptions
- managing authentication and authorization
- managing sessions and cookies
- connecting to MongoDB using Mongoose
- rendering selected pages with EJS
- handling real-time communication using Socket.IO

### How It Connects with the React Frontend

The React frontend runs on:

- `http://localhost:3000`

The Express backend runs on:

- `http://localhost:3001`

The frontend sends HTTP requests to backend routes such as:

- `/appointments`
- `/feedback`
- `/prescriptions`
- `/session/check`
- `/auth/login`
- `/db/notes`

The backend returns:

- JSON data for React pages
- EJS-rendered HTML for selected SSR pages
- real-time events through Socket.IO

### Overall Architecture

Client-server flow:

1. User interacts with the React frontend.
2. React sends a request to Express.
3. Middleware runs first.
4. The route handles the request.
5. The route may read JSON files or MongoDB data.
6. The backend sends a response back to React.

Example:

1. User fills login form in React.
2. React sends `POST /auth/login`.
3. Express checks the request body.
4. Backend verifies the password using bcrypt.
5. Backend creates a JWT token.
6. React receives token and uses it for protected routes.

**(Important for Viva)**  
This project keeps **React as the main frontend (CSR)** and uses **EJS only for 1–2 selected pages (SSR)**. This shows both rendering approaches clearly.

---

## 2. Backend Folder Structure

Backend folder:

- [zenith-backend](/Users/muskaan/Desktop/Zenith/zenith-backend)

### Main Files and Folders

#### [server.js](/Users/muskaan/Desktop/Zenith/zenith-backend/server.js)

This is the main backend entry point.

It:

- creates the HTTP server
- loads the Express app
- connects MongoDB
- attaches Socket.IO
- starts the backend on port `3001`

#### [app.js](/Users/muskaan/Desktop/Zenith/zenith-backend/app.js)

This file configures the Express application.

It:

- sets EJS as the view engine
- loads middleware
- mounts all routes
- defines health routes
- handles 404 errors
- uses the global error middleware

#### [routes/](/Users/muskaan/Desktop/Zenith/zenith-backend/routes)

This folder contains route files.

Each file groups related backend endpoints.

Important route files:

- [appointments.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/appointments.js): existing appointment API
- [records.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/records.js): file upload and record streaming
- [feedback.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/feedback.js): feedback APIs
- [prescriptions.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/prescriptions.js): prescription APIs
- [auth.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/auth.js): register, login, passport login, profile
- [session.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/session.js): session set, check, logout
- [concepts.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/concepts.js): middleware, body parser, blocking/non-blocking, error, socket status demos
- [db-notes.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/db-notes.js): MongoDB + Mongoose CRUD
- [view-routes.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/view-routes.js): EJS pages

#### [middleware/](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware)

This folder contains reusable middleware functions.

- [request-logger.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/request-logger.js): logs every request
- [lifecycle-tracker.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/lifecycle-tracker.js): tracks request flow step by step
- [error-handler.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/error-handler.js): handles errors centrally
- [auth.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/auth.js): JWT signing and protected route middleware
- [passport.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/passport.js): Passport local strategy setup

#### [models/](/Users/muskaan/Desktop/Zenith/zenith-backend/models)

This folder stores Mongoose models.

- [User.js](/Users/muskaan/Desktop/Zenith/zenith-backend/models/User.js): user schema for authentication
- [ConceptNote.js](/Users/muskaan/Desktop/Zenith/zenith-backend/models/ConceptNote.js): concept note schema for CRUD demo

#### [config/](/Users/muskaan/Desktop/Zenith/zenith-backend/config)

This folder stores configuration files.

- [db.js](/Users/muskaan/Desktop/Zenith/zenith-backend/config/db.js): MongoDB connection using Mongoose

#### [views/](/Users/muskaan/Desktop/Zenith/zenith-backend/views)

This folder contains EJS templates.

- [server-report.ejs](/Users/muskaan/Desktop/Zenith/zenith-backend/views/server-report.ejs)
- [admin-ejs.ejs](/Users/muskaan/Desktop/Zenith/zenith-backend/views/admin-ejs.ejs)

These pages are rendered on the server.

#### [public/](/Users/muskaan/Desktop/Zenith/zenith-backend/public)

This folder contains static files served by Express.

- [ejs.css](/Users/muskaan/Desktop/Zenith/zenith-backend/public/ejs.css): styling for EJS pages

#### Other Useful Files

- [.env.example](/Users/muskaan/Desktop/Zenith/zenith-backend/.env.example): sample environment variables
- [socket/register-socket-handlers.js](/Users/muskaan/Desktop/Zenith/zenith-backend/socket/register-socket-handlers.js): Socket.IO setup

---

## 3. Request Flow in Express

A request in Express generally follows this path:

1. Client sends request
2. Express receives request
3. Middleware runs
4. Route handler runs
5. Response is sent back

In this project, request flow is also tracked using:

- [lifecycle-tracker.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/lifecycle-tracker.js)

Example flow from `/concepts/request-flow`:

1. `request-arrived`
2. `application-start`
3. `cors-middleware`
4. `concepts-router-entered`
5. `request-flow-handler`

This means:

- the request first entered Express
- app-level middleware ran
- CORS middleware ran
- router-level middleware ran
- finally the route handler sent the response

### Middleware Lifecycle

Middleware lifecycle means the order in which middleware functions run.

In this backend:

1. request logger runs
2. lifecycle tracker runs
3. body parser runs
4. cookie/session middleware runs
5. CORS middleware runs
6. route-level middleware runs
7. route handler runs
8. if error happens, error middleware runs

**(Important for Viva)**  
Middleware runs in the order it is registered. This is a very common viva question.

---

## 4. Middleware Implementation

Middleware is a function that has access to:

- `req`
- `res`
- `next()`

It can:

- change request data
- stop the request
- pass control to next middleware
- send a response

### Application-Level Middleware

Used in [app.js](/Users/muskaan/Desktop/Zenith/zenith-backend/app.js).

Examples:

- request logger
- lifecycle tracker
- `express.json()`
- `express.urlencoded()`
- `cookie-parser`
- `express-session`
- CORS middleware

These run for many or all incoming requests.

### Router-Level Middleware

Used inside route files like:

- [routes/auth.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/auth.js)
- [routes/session.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/session.js)
- [routes/concepts.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/concepts.js)

Example:

- `router.use(lifecycleTracker('auth-router-entered'))`

This means every route in that router records its own flow step.

### Error-Handling Middleware

Used in:

- [middleware/error-handler.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/error-handler.js)

It catches errors passed using `next(error)`.

Example route:

- `/concepts/error-demo`

This intentionally throws an error so the custom error middleware can handle it.

### Third-Party Middleware

This project uses several third-party middleware packages:

- `express-session`
- `cookie-parser`
- `multer`
- `passport`
- `express.json()`
- `express.urlencoded()`

Purpose:

- `cookie-parser`: reads cookies
- `express-session`: manages sessions
- `multer`: handles file upload
- `passport`: authentication support

### Blocking vs Non-Blocking Code

Blocking example:

- `/concepts/blocking-demo`

This route uses a synchronous loop. While it runs, the event loop is busy.

Non-blocking example:

- `/concepts/non-blocking-demo`

This route uses async file reading with `fs.promises.readFile()`. The event loop is free to handle other requests.

**(Important for Viva)**  
Node.js performs best with **non-blocking asynchronous operations**.

### Body Parser Usage

Body parser is used through:

- `express.json()`
- `express.urlencoded({ extended: true })`

These parse incoming request bodies.

Example route:

- `/concepts/body-parser-demo`

If JSON is sent from the frontend, Express converts it into `req.body`.

---

## 5. Rendering (SSR vs CSR)

### CSR Using React

The main website uses **CSR (Client-Side Rendering)** with React and Next.js.

React pages such as:

- [app/page.jsx](/Users/muskaan/Desktop/Zenith/app/page.jsx)
- [app/dashboard/page.jsx](/Users/muskaan/Desktop/Zenith/app/dashboard/page.jsx)
- [app/appointments/page.jsx](/Users/muskaan/Desktop/Zenith/app/appointments/page.jsx)
- [app/concepts/page.jsx](/Users/muskaan/Desktop/Zenith/app/concepts/page.jsx)

These pages run on the frontend and fetch backend data using API calls.

### SSR Using EJS

This project also demonstrates **SSR (Server-Side Rendering)** using EJS.

EJS pages:

- `/server-report`
- `/admin-ejs`

These are rendered directly by Express on the server.

### Why Only Selected Pages Use EJS

This project intentionally keeps:

- React as the main frontend
- EJS only for selected backend demo pages

This is done because:

- the project should not convert the full React app to EJS
- we only need SSR examples for learning and viva
- this clearly shows the difference between CSR and SSR

**(Important for Viva)**  
React remains the main user-facing frontend. EJS is included only to demonstrate server-side rendering concepts.

---

## 6. Template Engine (EJS)

### How EJS Is Configured

In [app.js](/Users/muskaan/Desktop/Zenith/zenith-backend/app.js):

- `app.set('view engine', 'ejs')`
- `app.set('views', path.join(__dirname, 'views'))`

This tells Express:

- use EJS as the template engine
- load templates from the `views` folder

### How Dynamic Data Is Passed

In [routes/view-routes.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/view-routes.js), data is passed like this conceptually:

- title
- generated time
- request flow
- database status
- card arrays

Then EJS receives that data and renders HTML dynamically.

### Loops in EJS

Used in:

- [server-report.ejs](/Users/muskaan/Desktop/Zenith/zenith-backend/views/server-report.ejs)
- [admin-ejs.ejs](/Users/muskaan/Desktop/Zenith/zenith-backend/views/admin-ejs.ejs)

Loops are used to:

- display request flow steps
- display report items
- display admin cards

### Conditionals in EJS

Conditionals are used to:

- show database connected or disconnected message
- show a warning when MongoDB is offline

This is useful for server-rendered decision making.

---

## 7. Database (MongoDB + Mongoose)

### Why NoSQL Is Used

This project uses **MongoDB**, which is a **NoSQL database**.

Why NoSQL:

- flexible schema
- stores JSON-like documents
- easy to use with JavaScript objects
- good fit for Node.js applications

Difference:

- **SQL** stores data in rows and tables
- **NoSQL** stores data in flexible documents

There is also a viva note about this in:

- [models/ConceptNote.js](/Users/muskaan/Desktop/Zenith/zenith-backend/models/ConceptNote.js)

### MongoDB Connection Setup

Connection is handled in:

- [config/db.js](/Users/muskaan/Desktop/Zenith/zenith-backend/config/db.js)

It:

- reads the MongoDB URI
- tries to connect using Mongoose
- stores connection status
- keeps backend alive even if MongoDB is offline

This is important because the existing React app should continue working even if MongoDB is not running.

### Mongoose Schemas and Models

Models:

- [User.js](/Users/muskaan/Desktop/Zenith/zenith-backend/models/User.js)
- [ConceptNote.js](/Users/muskaan/Desktop/Zenith/zenith-backend/models/ConceptNote.js)

`User` model stores:

- name
- email
- password hash
- role

`ConceptNote` model stores:

- title
- category
- content
- tags
- createdBy

### CRUD Operations

CRUD means:

- Create
- Read
- Update
- Delete

Implemented in:

- [routes/db-notes.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/db-notes.js)

Routes:

- `GET /db/notes` → read all notes
- `POST /db/notes` → create note
- `PUT /db/notes/:id` → update note
- `DELETE /db/notes/:id` → delete note

### How Data Flows from Frontend to Database

Flow:

1. React form sends request
2. Express route receives request
3. Body parser reads `req.body`
4. Mongoose model validates data
5. MongoDB stores document
6. Response is sent back to React

If MongoDB is offline:

- backend returns a clean `503` message
- React does not crash

**(Important for Viva)**  
Mongoose is an **ODM (Object Document Mapper)**. It lets us work with MongoDB using JavaScript objects and schemas.

---

## 8. Sessions & Cookies

### How Sessions Work

A session is server-side stored user state.

In this project, sessions are used to store:

- user preferences
- visit count
- last authenticated user

### express-session Usage

Configured in:

- [app.js](/Users/muskaan/Desktop/Zenith/zenith-backend/app.js)

`express-session` creates a session object for each user.

The session ID is stored in a cookie:

- `connect.sid`

### Session Routes

#### `/session/set`

Sets session data.

Example:

- theme preference
- visit count
- saved time

#### `/session/check`

Reads session data and returns it.

Used to confirm whether a session exists.

#### `/session/logout`

Destroys the session and clears the session cookie.

### How Cookies Are Used

Cookies are small pieces of data stored in the browser.

In this project:

- the browser stores the session ID cookie
- the backend uses it to identify the session

The actual session data is stored on the server side.

**(Important for Viva)**  
Cookie stores the session identifier, not all the user data itself.

---

## 9. Authentication System

Authentication routes are in:

- [routes/auth.js](/Users/muskaan/Desktop/Zenith/zenith-backend/routes/auth.js)

### User Registration

Route:

- `POST /auth/register`

Steps:

1. receive name, email, password
2. check if user already exists
3. hash password using bcrypt
4. store user in MongoDB

### Password Hashing with bcrypt

Password is never stored as plain text.

Instead:

- bcrypt creates a hash
- only the hash is stored in database

This improves security.

### Login with JWT

Route:

- `POST /auth/login`

Steps:

1. user sends email and password
2. backend finds user
3. bcrypt compares password with stored hash
4. backend generates JWT token
5. token is returned to frontend

### Protected Routes

Protected middleware is in:

- [middleware/auth.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/auth.js)

Protected route:

- `GET /auth/profile`

How it works:

1. frontend sends token in `Authorization` header
2. backend verifies token
3. if valid, route continues
4. if invalid, backend returns `401`

### Passport.js Explanation

Passport configuration is in:

- [middleware/passport.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/passport.js)

This project uses:

- Passport Local Strategy

Demo route:

- `POST /auth/login/passport`

Purpose:

- shows another authentication approach
- useful for viva explanation

**(Important for Viva)**  
This project demonstrates both:

- direct JWT authentication
- Passport local strategy authentication

---

## 10. Real-Time Communication

### Socket.IO Setup

Socket.IO is configured in:

- [server.js](/Users/muskaan/Desktop/Zenith/zenith-backend/server.js)
- [socket/register-socket-handlers.js](/Users/muskaan/Desktop/Zenith/zenith-backend/socket/register-socket-handlers.js)

The backend uses the same HTTP server for:

- Express routes
- Socket.IO real-time communication

### Full-Duplex Communication

Full-duplex means:

- frontend can send data to backend
- backend can send data to frontend
- both can communicate continuously

This is different from normal request-response HTTP.

### socket.emit and socket.on

Examples in backend:

- `socket.emit('server:welcome', ...)`
- `socket.on('chat:send', ...)`
- `io.emit('chat:new', ...)`
- `socket.on('notification:ping', ...)`
- `socket.emit('notification:pong', ...)`

Meaning:

- `socket.on()` listens for an event
- `socket.emit()` sends an event
- `io.emit()` broadcasts to all clients

### How React Frontend Connects

Frontend connection is shown in:

- [app/concepts/page.jsx](/Users/muskaan/Desktop/Zenith/app/concepts/page.jsx)

It uses:

- `socket.io-client`

The React page:

- connects to backend
- receives welcome event
- sends chat messages
- receives live broadcast messages
- sends ping and receives pong notification

### Example Features

Two demo examples are included:

- simple real-time chat
- live notification ping/pong

**(Important for Viva)**  
Socket.IO is used to demonstrate **real-time full-duplex communication**, which is different from normal REST APIs.

---

## 11. API Endpoints Summary

### Existing Feature Routes

- `GET /appointments` → get all appointments
- `POST /appointments` → create appointment
- `GET /records` → get all uploaded records
- `POST /records` → upload record file
- `GET /records/:filename` → stream/download file
- `GET /feedback` → get feedback
- `POST /feedback` → submit feedback
- `GET /prescriptions` → get prescriptions
- `POST /prescriptions` → create prescription

### Health and System Routes

- `GET /` → backend root info
- `GET /health` → backend health summary

### Middleware Concept Routes

- `GET /concepts/request-flow` → request lifecycle demo
- `POST /concepts/body-parser-demo` → body parser demo
- `GET /concepts/blocking-demo` → blocking code demo
- `GET /concepts/non-blocking-demo` → non-blocking code demo
- `GET /concepts/error-demo` → error middleware demo
- `GET /concepts/socket-status` → current socket info

### Session Routes

- `GET /session/set` → create session data
- `GET /session/check` → read session data
- `GET /session/logout` → destroy session

### Authentication Routes

- `POST /auth/register` → create user
- `POST /auth/login` → login and get JWT
- `POST /auth/login/passport` → login using Passport local strategy
- `GET /auth/profile` → protected user profile

### Database Routes

- `GET /db/notes` → read concept notes
- `POST /db/notes` → create concept note
- `PUT /db/notes/:id` → update concept note
- `DELETE /db/notes/:id` → delete concept note

### EJS SSR Routes

- `GET /server-report` → SSR report page
- `GET /admin-ejs` → SSR admin page

---

## 12. Live Data Handling

### How Real-Time Data Is Fetched and Updated

This project uses two methods:

- REST APIs
- Socket.IO real-time events

### REST API Data Flow

Used for:

- appointments
- feedback
- prescriptions
- sessions
- auth
- MongoDB notes

Flow:

1. React sends HTTP request
2. backend processes request
3. backend sends JSON response
4. React updates UI

### Real-Time Data Flow

Used for:

- chat messages
- live notifications

Flow:

1. React connects using Socket.IO
2. frontend emits event
3. backend receives event
4. backend emits response or broadcast
5. frontend updates immediately

### REST vs Real-Time

REST:

- request-response based
- client asks for data
- good for CRUD operations

Socket.IO:

- event-based
- server can push data instantly
- good for live chat, notifications, dashboards

**(Important for Viva)**  
REST is best for normal data operations. Socket.IO is best when instant updates are required.

---

## 13. Error Handling

Error handling is centralized in:

- [middleware/error-handler.js](/Users/muskaan/Desktop/Zenith/zenith-backend/middleware/error-handler.js)

How it works:

1. route detects error
2. route calls `next(error)`
3. error-handling middleware catches it
4. backend sends structured error response

Example:

- `/concepts/error-demo`

This route intentionally passes an error to the error middleware.

Error response includes:

- error message
- request flow

This is useful for debugging and viva explanation.

---

## 14. Security Considerations

### Password Hashing

Passwords are hashed using bcrypt before saving.

This protects user passwords if database is exposed.

### Token Authentication

JWT is used for protected routes.

Benefits:

- stateless authentication
- secure route protection
- easy use with React frontend

### Session Protection

Session cookie uses:

- `httpOnly`
- `sameSite: 'lax'`

This improves security by reducing direct client-side access to the cookie.

### Safe Failure for Missing MongoDB

If MongoDB is not available:

- backend does not crash
- routes return helpful `503` messages

This keeps the app stable.

**(Important for Viva)**  
Security in this backend is shown through:

- bcrypt hashing
- JWT protection
- session cookie settings
- centralized error handling

---

## 15. Conclusion

This backend uses multiple important technologies together:

- **Express.js** for server and routes
- **Middleware** for request processing
- **EJS** for selected server-rendered pages
- **MongoDB + Mongoose** for NoSQL database support
- **express-session** and cookies for session handling
- **bcrypt** for password hashing
- **JWT** for token-based authentication
- **Passport.js** for alternative authentication demo
- **Socket.IO** for real-time communication

### How Everything Integrates Together

The React frontend remains the main user interface and communicates with the backend through APIs and sockets. The backend:

- handles normal CRUD operations
- demonstrates middleware clearly
- provides SSR examples with EJS
- supports database-driven routes
- supports sessions and authentication
- supports real-time features

This makes the project strong for viva because it shows:

- REST API design
- middleware lifecycle
- CSR and SSR difference
- NoSQL database usage
- sessions and cookies
- JWT authentication
- Passport integration
- real-time communication with Socket.IO

**Final Viva Line**  
This backend is designed not only to support the website, but also to clearly demonstrate the core Node.js and Express concepts required in a practical project.
