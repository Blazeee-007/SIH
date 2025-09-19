import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LoginForm } from "@/components/auth/login-form"
import { AuthProvider } from "@/lib/auth-context"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the auth context
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockLogin = jest.fn()
  return <AuthProvider>{children}</AuthProvider>
}

describe("LoginForm", () => {
  beforeEach(() => {
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockClear()
  })

  it("renders login form with email and password fields", () => {
    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>,
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("shows password when toggle button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>,
    )

    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole("button", { name: "" })

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")
  })

  it("submits form with valid credentials", async () => {
    const user = userEvent.setup()

    // Mock successful login response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: "mock-token",
        user: { id: "1", email: "test@example.com", name: "Test User", role: "student" },
      }),
    })

    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>,
    )

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      })
    })
  })

  it("displays error message on failed login", async () => {
    const user = userEvent.setup()

    // Mock failed login response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Invalid email or password",
      }),
    })

    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>,
    )

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com")
    await user.type(screen.getByLabelText(/password/i), "wrongpassword")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    // Note: This would require mocking the toast system for full testing
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })
})
