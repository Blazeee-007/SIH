# Prashikshan - Academia-Industry Internship Platform

A comprehensive web application connecting students with industry mentors through meaningful internship experiences.

## Features

### 🔐 Authentication System
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Mentor, Student)
- **Password security** with bcrypt hashing
- **Session management** with HTTP-only cookies
- **Route protection** with middleware

### 👥 User Roles
- **Students**: Apply for internships, track progress, submit tasks
- **Mentors**: Manage internships, review applications, provide feedback
- **Admins**: Oversee platform, manage users, view analytics

### 🎯 Core Functionality
- **Dashboard analytics** for all user types
- **Application management** system
- **Task tracking** and submission
- **Feedback and evaluation** system
- **Profile management** for all users

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: JWT with jose library
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for analytics
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd prashikshan-platform
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
# Create .env.local file
JWT_SECRET=your-super-secret-jwt-key-change-in-production-must-be-at-least-32-characters-long
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Test Accounts

The application comes with pre-configured test accounts:

- **Admin**: admin@prashikshan.com / password123
- **Mentor**: mentor@prashikshan.com / password123  
- **Student**: student@prashikshan.com / password123

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and pages
│   ├── mentor/            # Mentor dashboard and pages
│   ├── student/           # Student dashboard and pages
│   ├── auth/              # Authentication pages
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── mentor/            # Mentor-specific components
│   ├── student/           # Student-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts            # JWT authentication logic
│   ├── auth-context.tsx   # React auth context
│   └── auth-client.ts     # Client-side auth utilities
└── middleware.ts          # Next.js middleware for route protection
\`\`\`

## Security Features

- **JWT tokens** with 7-day expiration
- **HTTP-only cookies** for token storage
- **Password hashing** with bcrypt (12 salt rounds)
- **Role-based access control** with middleware protection
- **CSRF protection** with SameSite cookies
- **Secure cookies** in production environment

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **Authentication**: All auth logic is in `lib/auth.ts`
2. **API Routes**: Add new routes in `app/api/`
3. **Components**: Add reusable components in `components/ui/`
4. **Pages**: Add new pages in appropriate role directories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
