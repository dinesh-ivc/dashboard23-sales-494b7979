import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Website visit validation schemas
export const websiteVisitSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  visits: z.number().min(0, 'Visits must be a positive number'),
  source: z.string().min(1, 'Source is required'),
});

export const websiteVisitUpdateSchema = websiteVisitSchema.partial();

// Store visit validation schemas
export const storeVisitSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  visits: z.number().min(0, 'Visits must be a positive number'),
  location: z.string().min(1, 'Location is required'),
});

export const storeVisitUpdateSchema = storeVisitSchema.partial();

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be a positive number'),
});

export const productUpdateSchema = productSchema.partial();

// Validation helper function
export function validateData(schema, data) {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
}