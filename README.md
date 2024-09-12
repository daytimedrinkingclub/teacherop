# TeacherOP

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm
- PostgreSQL database
- Redis
- Anthropic API key

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/daytimedrinkingclub/teacherop.git
   cd teacherop
   ```

2. Install Dependencies:

   ```sh
   npm i
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection details and other necessary variables
4. Run database migrations:

   ```sh
   node ace migration:run
   ```

5. Start the development server and background jobs:
   ```sh
   npm run dev
   npm run jobs #separate process
   ```

The application should be running at http://localhost:3333

## Folder Structure

```
teacherop/
├── app/ ────────────── # Contains the core application logic
│   ├── controllers/
│   ├── jobs/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   └── validators/
├── config/ ─────────── # All the configuration files
├── database/ ───────── # DB migrations, seeds and factories
│   └── migrations/
├── inertia/ ────────── # All the frontend code
│   ├── app/
│   ├── css/
│   ├── lib/
│   └── pages/
├── providers/ ──────── # All the singleton classes that are used through out the app
├── start/
│   └── route.ts ────── # All the available routes
└── tests/
```
