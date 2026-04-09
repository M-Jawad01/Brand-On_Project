/**
 * Validation helpers for order and material data.
 * Used by API routes to validate incoming requests.
 */

export interface OrderInput {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  materialId?: string
  widthFt?: number
  heightFt?: number
  quantity?: number
  totalPrice?: number
}

export interface MaterialInput {
  name?: string
  pricePerSqFt?: number
  description?: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateOrderInput(input: OrderInput): ValidationResult {
  const errors: string[] = []

  if (!input.customerName?.trim()) {
    errors.push('Customer name is required')
  } else if (input.customerName.trim().length > 100) {
    errors.push('Customer name must be 100 characters or less')
  }

  if (!input.customerPhone?.trim()) {
    errors.push('Customer phone is required')
  } else if (!/^[\d\s\-+()]{7,20}$/.test(input.customerPhone.trim())) {
    errors.push('Invalid phone number format')
  }

  if (!input.materialId?.trim()) {
    errors.push('Material selection is required')
  }

  if (!input.widthFt || input.widthFt <= 0) {
    errors.push('Width must be greater than 0')
  } else if (input.widthFt > 1000) {
    errors.push('Width cannot exceed 1000 ft')
  }

  if (!input.heightFt || input.heightFt <= 0) {
    errors.push('Height must be greater than 0')
  } else if (input.heightFt > 1000) {
    errors.push('Height cannot exceed 1000 ft')
  }

  if (input.quantity !== undefined && (input.quantity < 1 || input.quantity > 500)) {
    errors.push('Quantity must be between 1 and 500')
  }

  if (!input.totalPrice || input.totalPrice <= 0) {
    errors.push('Total price must be greater than 0')
  }

  if (input.customerEmail && !isValidEmail(input.customerEmail)) {
    errors.push('Invalid email format')
  }

  return { valid: errors.length === 0, errors }
}

export function validateMaterialInput(input: MaterialInput): ValidationResult {
  const errors: string[] = []

  if (!input.name?.trim()) {
    errors.push('Material name is required')
  } else if (input.name.trim().length > 100) {
    errors.push('Material name must be 100 characters or less')
  }

  if (input.pricePerSqFt === undefined || input.pricePerSqFt <= 0) {
    errors.push('Price per sqft must be greater than 0')
  } else if (input.pricePerSqFt > 999999) {
    errors.push('Price per sqft cannot exceed 999,999')
  }

  return { valid: errors.length === 0, errors }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email) && email.length <= 254
}
