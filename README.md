# classes - Authentication Template

A production-ready authentication template built with NestJS (backend) and React + TypeScript (frontend) in a Turborepo monorepo.

## Features

- **Google OAuth 2.0** - Secure authentication with Google
- **JWT Sessions** - Stateless authentication with access & refresh tokens
- **Protected Routes** - Client-side route protection
- **User Profile** - Display user information and account details
- **TypeScript** - Full type safety across the stack
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production-ready database

## Project Structure

```
classes-vercel/
├── apps/
│   ├── api/          # NestJS backend API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/      # Authentication module
│   │   │   │   └── users/     # User management module
│   │   │   └── main.ts
│   │   └── prisma/
│   │       └── schema.prisma  # Database schema
│   │
│   └── web/          # React frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── Header.tsx
│       │   │   ├── Layout.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   ├── contexts/
│       │   │   └── AuthContext.tsx
│       │   ├── pages/
│       │   │   ├── Landing.tsx
│       │   │   ├── Login.tsx
│       │   │   ├── Callback.tsx
│       │   │   └── Profile.tsx
│       │   └── App.tsx
│       └── vite.config.ts
│
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials ([Get them here](https://console.cloud.google.com/apis/credentials))

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

**Backend (`apps/api/.env`):**

```env
PORT=3001
APP_NAME=classes_API
NODE_ENV=development
API_BASE_URL=http://localhost:3001
APP_BASE_URL=http://localhost:5173

DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DIRECT_URL=postgresql://user:password@localhost:5432/dbname

JWT_SECRET=your-secure-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Frontend (`apps/web/.env`):**

```env
VITE_API_URL=http://localhost:3001
```

3. Set up the database:

```bash
cd apps/api
pnpm prisma migrate dev
```

4. Run the development servers:

```bash
# From root directory
pnpm dev

# Or run individually
pnpm dev --filter=api   # Backend only
pnpm dev --filter=web   # Frontend only
```

The API will run on `http://localhost:3001` and the web app on `http://localhost:5173`.

## Authentication Flow

1. **User visits landing page** → Click "Get Started"
2. **Redirected to login page** → Click "Sign in with Google"
3. **Google OAuth consent** → User authorizes the app
4. **Callback processing** → Backend validates and creates session
5. **JWT tokens issued** → Access token & refresh token stored in cookies
6. **Redirect to profile** → User can view their profile information

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/callback/google` - Google OAuth callback
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Clear session and logout

### Users (Protected)

- `GET /users/me` - Get current user profile

## Frontend Routes

- `/` - Landing page (public)
- `/login` - Login page (public)
- `/callback` - OAuth callback handler (public)
- `/profile` - User profile page (protected)

## Database Schema

```prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  name          String?
  googleId      String?   @unique
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
}

model Session {
  id           String   @id @default(uuid())
  userId       Int
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
}
```

## Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Passport** - Authentication middleware
- **JWT** - JSON Web Tokens

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Tooling

- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Extending the Template

This is a minimal authentication template. You can extend it by:

1. **Adding new features** - Create new modules in `apps/api/src/modules/`
2. **Adding pages** - Create new pages in `apps/web/src/pages/`
3. **Database changes** - Update `schema.prisma` and run migrations
4. **Email verification** - Implement email sending and verification flow
5. **Password authentication** - Add local strategy for email/password login
6. **Role-based access** - Add roles and permissions to the User model

## Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=api
pnpm build --filter=web
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
