import { generateToken, verifyToken, hashPassword, verifyPassword } from "@/lib/auth"

describe("Auth utilities", () => {
  const mockUser = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    role: "student" as const,
  }

  describe("generateToken", () => {
    it("generates a valid JWT token", async () => {
      const token = await generateToken(mockUser)
      expect(typeof token).toBe("string")
      expect(token.split(".")).toHaveLength(3) // JWT has 3 parts
    })
  })

  describe("verifyToken", () => {
    it("verifies a valid token", async () => {
      const token = await generateToken(mockUser)
      const payload = await verifyToken(token)

      expect(payload).toBeTruthy()
      expect(payload?.userId).toBe(mockUser.id)
      expect(payload?.email).toBe(mockUser.email)
      expect(payload?.role).toBe(mockUser.role)
    })

    it("returns null for invalid token", async () => {
      const payload = await verifyToken("invalid-token")
      expect(payload).toBeNull()
    })
  })

  describe("password utilities", () => {
    const password = "testpassword123"

    it("hashes password correctly", async () => {
      const hashedPassword = await hashPassword(password)
      expect(hashedPassword).toBeTruthy()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.startsWith("$2a$")).toBe(true)
    })

    it("verifies password correctly", async () => {
      const hashedPassword = await hashPassword(password)
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it("rejects incorrect password", async () => {
      const hashedPassword = await hashPassword(password)
      const isValid = await verifyPassword("wrongpassword", hashedPassword)
      expect(isValid).toBe(false)
    })
  })
})
