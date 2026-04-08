/**
 * Integration Tests — Contact & Auth APIs
 * Tests the Contact form API and Admin Login API endpoints.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('Contact API Integration', () => {
  describe('POST /api/contact', () => {
    it('should accept a valid contact form submission', async () => {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Contact Test User',
          phone: '0300-9876543',
          email: 'contact@test.com',
          message: 'This is a test message for integration testing.',
        }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.message).toContain('received')
    })

    it('should accept submission without optional email', async () => {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'No Email User',
          phone: '0300-1111111',
          message: 'Message without email.',
        }),
      })

      expect(res.status).toBe(200)
    })

    it('should reject submission with missing name', async () => {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          phone: '0300-1111111',
          message: 'No name provided.',
        }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Name is required')
    })

    it('should reject submission with missing phone', async () => {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test',
          phone: '',
          message: 'No phone provided.',
        }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Phone is required')
    })

    it('should reject submission with missing message', async () => {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test',
          phone: '0300-1111111',
          message: '',
        }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Message is required')
    })
  })
})

describe('Admin Auth API Integration', () => {
  describe('POST /api/admin/login', () => {
    it('should reject login with wrong password', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'definitely-wrong-password' }),
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error).toContain('Invalid')
    })

    it('should reject login with empty password', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '' }),
      })

      expect(res.status).toBe(401)
    })

    it('should reject login without password field', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(res.status).toBe(401)
    })
  })

  describe('Admin Route Protection', () => {
    it('should redirect unauthenticated admin page access', async () => {
      const res = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' })
      // Should redirect (307) to login
      expect(res.status).toBe(307)
    })

    it('should allow access to admin login page without auth', async () => {
      const res = await fetch(`${BASE_URL}/admin/login`)
      expect(res.status).toBe(200)
    })
  })
})
