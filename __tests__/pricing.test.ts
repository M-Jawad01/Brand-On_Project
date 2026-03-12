import {
  StandardPricing,
  BulkDiscountPricing,
  RushOrderPricing,
  PriceCalculator,
  PricingParams,
} from '@/lib/pricing'

describe('Pricing Strategy Pattern', () => {
  const baseParams: PricingParams = {
    pricePerSqFt: 15,
    widthFt: 4,
    heightFt: 3,
    quantity: 1,
  }

  // ---- StandardPricing Tests ----

  describe('StandardPricing', () => {
    const strategy = new StandardPricing()

    test('calculates price as pricePerSqFt × width × height × quantity', () => {
      // 15 × 4 × 3 × 1 = 180
      expect(strategy.calculate(baseParams)).toBe(180)
    })

    test('scales linearly with quantity', () => {
      // 15 × 4 × 3 × 5 = 900
      expect(strategy.calculate({ ...baseParams, quantity: 5 })).toBe(900)
    })

    test('handles decimal dimensions', () => {
      // 15 × 2.5 × 3.5 × 1 = 131.25
      expect(strategy.calculate({ ...baseParams, widthFt: 2.5, heightFt: 3.5 })).toBe(131.25)
    })

    test('returns 0 for zero dimensions', () => {
      expect(strategy.calculate({ ...baseParams, widthFt: 0 })).toBe(0)
      expect(strategy.calculate({ ...baseParams, heightFt: 0 })).toBe(0)
    })

    test('returns 0 for zero quantity', () => {
      expect(strategy.calculate({ ...baseParams, quantity: 0 })).toBe(0)
    })

    test('handles large orders', () => {
      // 50 × 20 × 10 × 100 = 1,000,000
      expect(strategy.calculate({
        pricePerSqFt: 50, widthFt: 20, heightFt: 10, quantity: 100,
      })).toBe(1000000)
    })
  })

  // ---- BulkDiscountPricing Tests ----

  describe('BulkDiscountPricing', () => {
    const strategy = new BulkDiscountPricing()

    test('no discount for quantity less than 5', () => {
      // 15 × 4 × 3 × 4 = 720 (no discount)
      expect(strategy.calculate({ ...baseParams, quantity: 4 })).toBe(720)
    })

    test('applies 10% discount for quantity of 5', () => {
      // 15 × 4 × 3 × 5 = 900, 10% off = 810
      expect(strategy.calculate({ ...baseParams, quantity: 5 })).toBe(810)
    })

    test('applies 10% discount for quantity greater than 5', () => {
      // 15 × 4 × 3 × 10 = 1800, 10% off = 1620
      expect(strategy.calculate({ ...baseParams, quantity: 10 })).toBe(1620)
    })

    test('no discount for single item', () => {
      // Same as standard: 15 × 4 × 3 × 1 = 180
      expect(strategy.calculate(baseParams)).toBe(180)
    })
  })

  // ---- RushOrderPricing Tests ----

  describe('RushOrderPricing', () => {
    const strategy = new RushOrderPricing()

    test('applies 25% surcharge', () => {
      // 15 × 4 × 3 × 1 = 180, +25% = 225
      expect(strategy.calculate(baseParams)).toBe(225)
    })

    test('surcharge applies to any quantity', () => {
      // 15 × 4 × 3 × 3 = 540, +25% = 675
      expect(strategy.calculate({ ...baseParams, quantity: 3 })).toBe(675)
    })
  })

  // ---- PriceCalculator Context Tests ----

  describe('PriceCalculator', () => {
    test('uses StandardPricing by default', () => {
      const calculator = new PriceCalculator()
      expect(calculator.getStrategyName()).toBe('Standard')
      expect(calculator.calculate(baseParams)).toBe(180)
    })

    test('can be created with a specific strategy', () => {
      const calculator = new PriceCalculator(new RushOrderPricing())
      expect(calculator.getStrategyName()).toBe('Rush Order (+25%)')
      expect(calculator.calculate(baseParams)).toBe(225)
    })

    test('can switch strategies at runtime', () => {
      const calculator = new PriceCalculator()

      // Start with standard
      expect(calculator.calculate(baseParams)).toBe(180)

      // Switch to rush
      calculator.setStrategy(new RushOrderPricing())
      expect(calculator.calculate(baseParams)).toBe(225)

      // Switch to bulk discount with qty 5
      calculator.setStrategy(new BulkDiscountPricing())
      expect(calculator.calculate({ ...baseParams, quantity: 5 })).toBe(810)
    })

    test('different strategies produce different results for same input', () => {
      const params = { ...baseParams, quantity: 5 }
      const standard = new PriceCalculator(new StandardPricing()).calculate(params)
      const bulk = new PriceCalculator(new BulkDiscountPricing()).calculate(params)
      const rush = new PriceCalculator(new RushOrderPricing()).calculate(params)

      expect(standard).toBe(900)   // base price
      expect(bulk).toBe(810)       // 10% off
      expect(rush).toBe(1125)      // 25% surcharge
      expect(bulk).toBeLessThan(standard)
      expect(rush).toBeGreaterThan(standard)
    })
  })
})
