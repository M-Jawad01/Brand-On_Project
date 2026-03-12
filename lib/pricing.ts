/**
 * Design Pattern: Strategy
 *
 * Purpose: Allow different pricing calculation methods to be used
 * interchangeably without changing the code that calls them. This makes
 * it easy to add new pricing rules (e.g., bulk discounts, rush fees)
 * without modifying existing code.
 *
 * How it works:
 * - PricingStrategy is an interface that defines the contract: calculate(params) → number
 * - Each concrete strategy (StandardPricing, BulkDiscountPricing, etc.) implements it differently
 * - PriceCalculator accepts any strategy and delegates the calculation to it
 * - The caller picks which strategy to use at runtime
 */

// ---- Strategy Interface ----

export interface PricingParams {
  pricePerSqFt: number
  widthFt: number
  heightFt: number
  quantity: number
}

export interface PricingStrategy {
  name: string
  calculate(params: PricingParams): number
}

// ---- Concrete Strategies ----

/**
 * Standard pricing: price = pricePerSqFt × width × height × quantity
 */
export class StandardPricing implements PricingStrategy {
  name = 'Standard'

  calculate({ pricePerSqFt, widthFt, heightFt, quantity }: PricingParams): number {
    const area = widthFt * heightFt
    return Math.round(pricePerSqFt * area * quantity * 100) / 100
  }
}

/**
 * Bulk discount: 10% off when quantity is 5 or more
 */
export class BulkDiscountPricing implements PricingStrategy {
  name = 'Bulk Discount (10% off for 5+)'

  calculate({ pricePerSqFt, widthFt, heightFt, quantity }: PricingParams): number {
    const area = widthFt * heightFt
    const basePrice = pricePerSqFt * area * quantity
    const discount = quantity >= 5 ? 0.10 : 0
    return Math.round(basePrice * (1 - discount) * 100) / 100
  }
}

/**
 * Rush order: 25% surcharge for expedited production
 */
export class RushOrderPricing implements PricingStrategy {
  name = 'Rush Order (+25%)'

  calculate({ pricePerSqFt, widthFt, heightFt, quantity }: PricingParams): number {
    const area = widthFt * heightFt
    const basePrice = pricePerSqFt * area * quantity
    return Math.round(basePrice * 1.25 * 100) / 100
  }
}

// ---- Context ----

/**
 * PriceCalculator is the "context" that uses a strategy.
 * The strategy can be swapped at any time using setStrategy().
 */
export class PriceCalculator {
  private strategy: PricingStrategy

  constructor(strategy: PricingStrategy = new StandardPricing()) {
    this.strategy = strategy
  }

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy
  }

  getStrategyName(): string {
    return this.strategy.name
  }

  calculate(params: PricingParams): number {
    return this.strategy.calculate(params)
  }
}
