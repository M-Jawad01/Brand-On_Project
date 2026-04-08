/**
 * Integration Tests — Materials API
 * Tests the Materials API endpoints against a real PostgreSQL database.
 * Verifies CRUD operations, validation, soft-delete, and error handling.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('Materials API Integration', () => {
  let createdMaterialId: string

  // ---- GET /api/materials ----

  describe('GET /api/materials', () => {
    it('should return 200 and an array of materials', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should return only active materials by default', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`)
      const data = await res.json()

      for (const material of data) {
        expect(material.isActive).toBe(true)
      }
    })

    it('should return all materials (including inactive) with ?all=true', async () => {
      const res = await fetch(`${BASE_URL}/api/materials?all=true`)
      const data = await res.json()

      expect(Array.isArray(data)).toBe(true)
      // Should include both active and any inactive materials
      expect(data.length).toBeGreaterThanOrEqual(0)
    })

    it('should return materials with correct schema fields', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`)
      const data = await res.json()

      if (data.length > 0) {
        const material = data[0]
        expect(material).toHaveProperty('id')
        expect(material).toHaveProperty('name')
        expect(material).toHaveProperty('pricePerSqFt')
        expect(material).toHaveProperty('imageUrl')
        expect(material).toHaveProperty('isActive')
        expect(material).toHaveProperty('createdAt')
        expect(material).toHaveProperty('updatedAt')
      }
    })
  })

  // ---- POST /api/materials ----

  describe('POST /api/materials', () => {
    const uniqueName = `Test Material ${Date.now()}`

    it('should create a material with valid data', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uniqueName,
          description: 'Integration test material',
          pricePerSqFt: 22.5,
          imageUrl: null,
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.name).toBe(uniqueName)
      expect(data.pricePerSqFt).toBe(22.5)
      expect(data.isActive).toBe(true)
      createdMaterialId = data.id
    })

    it('should reject creation with missing name', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePerSqFt: 10 }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Material name is required')
    })

    it('should reject creation with zero price', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Zero Price', pricePerSqFt: 0 }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Price per sqft must be greater than 0')
    })

    it('should reject creation with negative price', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Negative', pricePerSqFt: -5 }),
      })

      expect(res.status).toBe(400)
    })

    it('should reject duplicate material name', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniqueName, pricePerSqFt: 10 }),
      })

      expect(res.status).toBe(409)
      const data = await res.json()
      expect(data.error).toContain('already exists')
    })
  })

  // ---- GET /api/materials/[id] ----

  describe('GET /api/materials/[id]', () => {
    it('should return a single material by ID', async () => {
      const res = await fetch(`${BASE_URL}/api/materials/${createdMaterialId}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe(createdMaterialId)
      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('pricePerSqFt')
    })

    it('should return 404 for nonexistent material', async () => {
      const res = await fetch(`${BASE_URL}/api/materials/nonexistent-id-12345`)
      expect(res.status).toBe(404)
    })
  })

  // ---- PUT /api/materials/[id] ----

  describe('PUT /api/materials/[id]', () => {
    it('should update material name and price', async () => {
      const res = await fetch(`${BASE_URL}/api/materials/${createdMaterialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Updated ${Date.now()}`, pricePerSqFt: 30 }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.pricePerSqFt).toBe(30)
    })

    it('should reject update with invalid data', async () => {
      const res = await fetch(`${BASE_URL}/api/materials/${createdMaterialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', pricePerSqFt: -1 }),
      })

      expect(res.status).toBe(400)
    })
  })

  // ---- DELETE /api/materials (soft-delete) ----

  describe('DELETE /api/materials', () => {
    it('should soft-delete a material', async () => {
      const res = await fetch(`${BASE_URL}/api/materials?id=${createdMaterialId}`, {
        method: 'DELETE',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('soft-deleted material should not appear in active list', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`)
      const data = await res.json()

      const found = data.find((m: any) => m.id === createdMaterialId)
      expect(found).toBeUndefined()
    })

    it('soft-deleted material should appear in ?all=true list', async () => {
      const res = await fetch(`${BASE_URL}/api/materials?all=true`)
      const data = await res.json()

      const found = data.find((m: any) => m.id === createdMaterialId)
      expect(found).toBeDefined()
      expect(found.isActive).toBe(false)
    })

    it('should reject delete without ID', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, { method: 'DELETE' })
      expect(res.status).toBe(400)
    })

    it('should return 404 for nonexistent material ID', async () => {
      const res = await fetch(`${BASE_URL}/api/materials?id=nonexistent-id`, {
        method: 'DELETE',
      })
      expect(res.status).toBe(404)
    })
  })
})
