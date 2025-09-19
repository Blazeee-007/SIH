import * as jose from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production-must-be-at-least-32-characters-long",
)
const JWT_EXPIRES_IN = "7d"

export interface User {
  id: string
  email: string
  name: string
  role: "student" | "mentor" | "admin"
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// Generate JWT token
export async function generateToken(user: User): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)

  return jwt
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Mock user database (replace with real database in production)
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@prashikshan.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "mentor@prashikshan.com",
    name: "Mentor User",
    role: "mentor",
  },
  {
    id: "3",
    email: "student@prashikshan.com",
    name: "Student User",
    role: "student",
  },
]

// Mock password storage (in production, store hashed passwords in database)
const mockPasswords: Record<string, string> = {
  "admin@prashikshan.com": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G", // password123
  "mentor@prashikshan.com": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G", // password123
  "student@prashikshan.com": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G", // password123
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = mockUsers.find((u) => u.email === email)
  if (!user) return null

  const hashedPassword = mockPasswords[email]
  if (!hashedPassword) return null

  const isValidPassword = await verifyPassword(password, hashedPassword)
  if (!isValidPassword) return null

  return user
}

// Register new user
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "student" | "mentor",
): Promise<User | null> {
  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) return null

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email,
    name,
    role,
  }

  // Hash password and store
  const hashedPassword = await hashPassword(password)
  mockUsers.push(newUser)
  mockPasswords[email] = hashedPassword

  return newUser
}

// Get user by ID
export function getUserById(userId: string): User | null {
  return mockUsers.find((u) => u.id === userId) || null
}
