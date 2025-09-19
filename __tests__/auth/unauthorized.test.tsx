import { render, screen } from "@testing-library/react"
import UnauthorizedPage from "@/app/unauthorized/page"

describe("UnauthorizedPage", () => {
  it("renders unauthorized page with correct content", () => {
    render(<UnauthorizedPage />)

    expect(screen.getByText("Access Denied")).toBeInTheDocument()
    expect(screen.getByText("You don't have permission to access this page.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /go to home/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /login with different account/i })).toBeInTheDocument()
  })

  it("has correct navigation links", () => {
    render(<UnauthorizedPage />)

    const homeLink = screen.getByRole("link", { name: /go to home/i })
    const loginLink = screen.getByRole("link", { name: /login with different account/i })

    expect(homeLink).toHaveAttribute("href", "/")
    expect(loginLink).toHaveAttribute("href", "/auth/login")
  })

  it("displays alert triangle icon", () => {
    render(<UnauthorizedPage />)

    // Check for the presence of the AlertTriangle icon
    const alertIcon = screen.getByRole("img", { hidden: true })
    expect(alertIcon).toBeInTheDocument()
  })
})
