/**
 * Integration Tests — Gallery API
 * Tests the Gallery API endpoints against a real PostgreSQL database.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('Gallery API Integration', () => {
  let createdItemId: string

  // ---- POST /api/gallery ----

  describe('POST /api/gallery', () => {
    it('should create a gallery item with all fields', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Gallery Test ${Date.now()}`,
          description: 'Integration test gallery item',
          imageUrl: '/images/test-gallery.jpg',
          category: 'Test Category',
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.title).toContain('Gallery Test')
      expect(data.category).toBe('Test Category')
      expect(data.imageUrl).toBe('/images/test-gallery.jpg')
      createdItemId = data.id
    })

    it('should create a gallery item without optional category', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'No Category Item',
          imageUrl: '/images/no-cat.jpg',
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.category).toBeNull()
    })

    it('should reject creation without title', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: '/images/no-title.jpg' }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Title is required')
    })

    it('should reject creation without imageUrl', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'No Image' }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Image URL is required')
    })
  })

  // ---- GET /api/gallery ----

  describe('GET /api/gallery', () => {
    it('should return an array of gallery items', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it('should return items in descending order by createdAt', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`)
      const data = await res.json()

      if (data.length >= 2) {
        const first = new Date(data[0].createdAt).getTime()
        const second = new Date(data[1].createdAt).getTime()
        expect(first).toBeGreaterThanOrEqual(second)
      }
    })

    it('should include all expected fields', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`)
      const data = await res.json()

      const item = data[0]
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('imageUrl')
      expect(item).toHaveProperty('category')
      expect(item).toHaveProperty('createdAt')
    })
  })

  // ---- DELETE /api/gallery ----

  describe('DELETE /api/gallery', () => {
    it('should delete a gallery item by ID', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery?id=${createdItemId}`, {
        method: 'DELETE',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject delete without ID', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, { method: 'DELETE' })
      expect(res.status).toBe(400)
    })

    it('deleted item should not appear in GET list', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`)
      const data = await res.json()

      const found = data.find((item: any) => item.id === createdItemId)
      expect(found).toBeUndefined()
    })
  })
})
