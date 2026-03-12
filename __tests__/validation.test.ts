import {
  validateOrderInput,
  validateMaterialInput,
  OrderInput,
  MaterialInput,
} from '@/lib/validation'

describe('Validation Helpers', () => {
  // ---- Order Validation Tests ----

  describe('validateOrderInput', () => {
    const validOrder: OrderInput = {
      customerName: 'Ali Khan',
      customerPhone: '0300-1234567',
      customerEmail: 'ali@example.com',
      materialId: 'mat_001',
      widthFt: 4,
      heightFt: 3,
      quantity: 2,
      totalPrice: 360,
    }

    test('accepts a complete valid order', () => {
      const result = validateOrderInput(validOrder)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('rejects missing customer name', () => {
      const result = validateOrderInput({ ...validOrder, customerName: '' })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer name is required')
    })

    test('rejects missing phone', () => {
      const result = validateOrderInput({ ...validOrder, customerPhone: undefined })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer phone is required')
    })

    test('rejects missing material', () => {
      const result = validateOrderInput({ ...validOrder, materialId: '' })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Material selection is required')
    })

    test('rejects zero width', () => {
      const result = validateOrderInput({ ...validOrder, widthFt: 0 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Width must be greater than 0')
    })

    test('rejects negative height', () => {
      const result = validateOrderInput({ ...validOrder, heightFt: -1 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Height must be greater than 0')
    })

    test('rejects zero quantity', () => {
      const result = validateOrderInput({ ...validOrder, quantity: 0 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Quantity must be at least 1')
    })

    test('rejects zero total price', () => {
      const result = validateOrderInput({ ...validOrder, totalPrice: 0 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Total price must be greater than 0')
    })

    test('rejects invalid email format', () => {
      const result = validateOrderInput({ ...validOrder, customerEmail: 'not-an-email' })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
    })

    test('allows missing email (optional field)', () => {
      const { customerEmail, ...orderWithoutEmail } = validOrder
      const result = validateOrderInput(orderWithoutEmail)
      expect(result.valid).toBe(true)
    })

    test('collects multiple errors at once', () => {
      const result = validateOrderInput({})
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThanOrEqual(4)
    })

    test('trims whitespace-only customer name', () => {
      const result = validateOrderInput({ ...validOrder, customerName: '   ' })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer name is required')
    })
  })

  // ---- Material Validation Tests ----

  describe('validateMaterialInput', () => {
    const validMaterial: MaterialInput = {
      name: 'Vinyl Banner',
      pricePerSqFt: 15,
      description: 'Durable outdoor vinyl',
    }

    test('accepts a valid material', () => {
      const result = validateMaterialInput(validMaterial)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('rejects missing name', () => {
      const result = validateMaterialInput({ ...validMaterial, name: '' })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Material name is required')
    })

    test('rejects zero price', () => {
      const result = validateMaterialInput({ ...validMaterial, pricePerSqFt: 0 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price per sqft must be greater than 0')
    })

    test('rejects negative price', () => {
      const result = validateMaterialInput({ ...validMaterial, pricePerSqFt: -5 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price per sqft must be greater than 0')
    })

    test('allows missing description (optional field)', () => {
      const result = validateMaterialInput({ name: 'Flex', pricePerSqFt: 10 })
      expect(result.valid).toBe(true)
    })
  })
})
