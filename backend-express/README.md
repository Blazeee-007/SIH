# Prashikshan Express Backend

A standalone, offline-capable Node.js/Express backend for the Prashikshan Academia-Industry Internship Platform.

## Features

- **Offline-First**: Uses SQLite for complete offline operation
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin, Mentor, and Student roles
- **RESTful API**: Well-structured API endpoints
- **File Upload**: Support for resume and task submissions
- **Logging**: Winston-based logging system
- **Security**: Helmet, rate limiting, CORS protection
- **Testing**: Jest test suite included

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database

```bash
npm run db:init
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## Project Structure

```
backend-express/
├── src/
│   ├── server.js              # Application entry point
│   ├── app.js                 # Express app configuration
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── database/              # Database setup and migrations
│   ├── middleware/            # Custom middleware
│   ├── models/                # Data models and queries
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── validators/            # Input validation
├── tests/                     # Test files
├── data/                      # SQLite database storage
├── uploads/                   # File uploads
├── logs/                      # Application logs
└── docs/                      # API documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - List users (Admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Internships
- `GET /api/internships` - List internships
- `POST /api/internships` - Create internship (Mentor)
- `GET /api/internships/:id` - Get internship details
- `PUT /api/internships/:id` - Update internship (Mentor)
- `DELETE /api/internships/:id` - Delete internship (Mentor)

### Applications
- `POST /api/applications` - Apply to internship (Student)
- `GET /api/applications` - List applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application status (Mentor)

### Tasks
- `POST /api/tasks` - Create task (Mentor)
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Submissions
- `POST /api/submissions` - Submit task (Student)
- `GET /api/submissions` - List submissions
- `GET /api/submissions/:id` - Get submission details
- `PUT /api/submissions/:id/grade` - Grade submission (Mentor)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run db:init` - Initialize database
- `npm run db:seed` - Seed database with test data
- `npm run db:reset` - Reset database
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## Default Test Users

After running `npm run db:seed`:

- **Admin**: admin@prashikshan.com / password123
- **Mentor**: mentor@prashikshan.com / password123
- **Student**: student@prashikshan.com / password123

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- HTTP security headers (Helmet)
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error logs
- `combined.log` - All logs
- Console output in development mode

## Testing

Run tests with:

```bash
npm test
```

Coverage report:

```bash
npm test -- --coverage
```

## Database

SQLite database located at `data/prashikshan.db`

Backup your database:

```bash
cp data/prashikshan.db data/backups/backup-$(date +%Y%m%d-%H%M%S).db
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `JWT_SECRET` with a secure random string
3. Configure proper CORS origins
4. Set up process manager (PM2, systemd)
5. Enable HTTPS
6. Set up regular database backups

## License

MIT
