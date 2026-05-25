# NoteFlow — What Everything Is and Why It Was Used

---

## Programming Languages

**TypeScript**
A version of JavaScript that adds types (e.g. you declare that a variable is a string or a number).
Used for the entire project — both the frontend (what users see) and the backend (server logic).
Why: catches bugs before the app runs, and makes the code easier to understand.

**JavaScript**
The base language TypeScript is built on. Runs in the browser and on the server.
TypeScript compiles down to JavaScript in the end.

**HTML / CSS**
HTML defines the structure of pages (buttons, inputs, text).
CSS handles the visual styling (colors, spacing, layout).
In this project, HTML is written inside TypeScript files using JSX syntax, and most CSS is handled by Tailwind.

**SQL**
The language used to talk to databases (creating tables, querying data).
Used indirectly — Prisma generates the SQL automatically, but the database itself runs SQL underneath.

---

## Frontend (what the user sees)

**React**
A JavaScript library for building user interfaces.
Everything in NoteFlow — the login form, the editor, the sidebar, the dashboard — is built as React components.
A component is just a reusable piece of UI (like a button or a card).

**Next.js**
A framework built on top of React that adds routing, server-side logic, and API routes.
It means you don't need a separate backend server — Next.js handles both the frontend pages and the backend API in one project.
Used for: all pages (/login, /register, /dashboard, /documents, etc.) and all API endpoints (/api/auth/login, /api/ai, etc.)

**Tailwind CSS**
A CSS framework where instead of writing separate CSS files, you write style classes directly on the HTML elements.
Example: `className="text-sm font-bold text-gray-500"` gives you small, bold, grey text.
Used for all the styling in NoteFlow (colors, layout, dark mode, spacing).

**BlockNote**
A ready-made rich text editor library (like a mini Google Docs component).
Used in the document editor so users can write formatted text — bold, headings, bullet lists, etc. — without building an editor from scratch.

---

## Backend (server logic)

**Node.js**
A runtime that lets JavaScript/TypeScript run on the server (not just in the browser).
Next.js uses Node.js under the hood to run the backend code.

**API Routes (Next.js)**
These are backend endpoints that the frontend calls to do things.
NoteFlow's API routes:
- `/api/auth/register` — creates a new user account
- `/api/auth/login` — checks credentials and logs the user in
- `/api/auth/logout` — clears the session cookie
- `/api/auth/verify` — activates an account after email verification
- `/api/auth/forgot-password` — sends a password reset email
- `/api/auth/reset-password` — saves the new password
- `/api/documents` — create/list documents
- `/api/documents/[id]` — get/update/delete a specific document
- `/api/ai` — sends text to the AI and returns the result
- `/api/contact` — saves a contact form message

---

## Database

**PostgreSQL**
A relational database — stores data in tables with rows and columns, like a structured spreadsheet.
NoteFlow stores: users, documents, and contact messages.
Locally it runs on the computer. In production (Vercel) it runs on Neon.

**Neon**
A cloud-hosted PostgreSQL service.
Used as the production database on Vercel — it's the live database that real users' data goes into.

**Prisma**
An ORM (Object Relational Mapper) — a tool that lets you talk to the database using TypeScript instead of raw SQL.
Example: instead of writing `SELECT * FROM users WHERE email = '...'`, you write `prisma.user.findUnique({ where: { email } })`.
Also handles: database schema definition (schema.prisma), migrations (updating the database structure), and auto-generating TypeScript types for all your data models.

---

## Authentication & Security

**JWT (JSON Web Token)**
A token (a long string) that proves a user is logged in.
When you log in, the server creates a JWT and stores it in a cookie on your browser. Every request you make after that sends the cookie automatically, so the server knows who you are.
Expires after 7 days.

**jose**
A JavaScript library used to create and verify JWTs.
Used in `src/lib/auth.ts`.

**bcryptjs**
A library for hashing passwords.
Hashing means converting a password into a scrambled string that can't be reversed.
The original password is never stored in the database — only the hash.
When you log in, bcrypt hashes what you typed and compares it to the stored hash.

**Email Verification**
When you register, a random token is generated and emailed to you as a link.
The account only activates when you click it.
Prevents fake accounts with non-existent emails.

**Password Reset Tokens**
Same idea — a random token is generated, stored with a 1-hour expiry, and emailed.
When clicked, the token is validated and the user can set a new password.
The token is deleted after use so the link can't be reused.

---

## Email

**Nodemailer**
A Node.js library for sending emails.
Used to send verification emails (on register) and password reset emails (on forgot password).

**Gmail (noteflow.ro@gmail.com)**
The email account that sends the emails.
Uses a Gmail App Password (a special password for apps, not the main account password) so it's secure.

---

## AI

**Groq API**
A service that provides access to AI language models very quickly (low latency).
NoteFlow sends text to Groq and gets back an AI-processed version.

**Llama 3.1 (8B Instant)**
The actual AI model running on Groq.
Llama is an open-source model made by Meta (Facebook's parent company).
"8B" means 8 billion parameters — a measure of its size/capability.
"Instant" means the Groq-optimized fast version.

**AI Actions available in NoteFlow:**
- Improve — makes text clearer and more professional
- Summarize — shortens text into a summary
- Expand — adds more detail and examples
- Fix grammar — corrects spelling and grammar errors
- Continue — continues writing from where you left off

---

## Hosting & Deployment

**Vercel**
The platform that hosts and runs NoteFlow online.
When code is pushed to GitHub, Vercel automatically builds and deploys the new version.
Also manages environment variables (API keys, database URL, etc.) securely.

**GitHub**
A platform for storing code and tracking changes (version control).
Every change to the code is saved as a "commit" with a description.
Vercel is connected to GitHub — a push to the main branch triggers a new deployment automatically.

---

## Development Tools

**VS Code**
The code editor used to write the project.
(Visual Studio Code — made by Microsoft, free.)

**npm**
The package manager for JavaScript/TypeScript.
Used to install all the libraries the project depends on (React, Prisma, Nodemailer, etc.).
All dependencies are listed in `package.json`.

**Environment Variables (.env)**
A file that stores secret values (API keys, database passwords) that should never be committed to GitHub.
On Vercel, these are set in the dashboard under Environment Variables instead of a file.

---

## Summary Table

| What | Category | Used for |
|---|---|---|
| TypeScript | Language | All code |
| React | UI Library | Building all pages and components |
| Next.js | Framework | Routing, pages, API backend |
| Tailwind CSS | Styling | All visual design |
| BlockNote | Library | Rich text document editor |
| PostgreSQL | Database | Storing users, documents, messages |
| Neon | Cloud DB | Production database (on Vercel) |
| Prisma | ORM | Talking to the database in TypeScript |
| JWT / jose | Auth | Keeping users logged in |
| bcryptjs | Security | Hashing passwords safely |
| Nodemailer | Email | Sending verification and reset emails |
| Gmail | Email | The account that sends emails |
| Groq API | AI | Processing text with AI |
| Llama 3.1 | AI Model | The actual AI doing the work |
| Vercel | Hosting | Running the app online |
| GitHub | Version Control | Storing and tracking code changes |
| VS Code | Editor | Writing the code |
| npm | Package Manager | Installing libraries |
