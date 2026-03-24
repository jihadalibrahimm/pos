import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase().optional(),
  points: z.coerce.number().int().min(0).optional(),
})

export const productCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(120),
  sellingPrice: z.coerce.number().positive(),
  purchasePrice: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().min(0),
  minStock: z.coerce.number().int().min(0).optional(),
})

export const productUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  category: z.string().trim().min(2).max(120).optional(),
  sellingPrice: z.coerce.number().positive().optional(),
  purchasePrice: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  minStock: z.coerce.number().int().min(0).optional(),
})

const invoiceItemSchema = z.object({
  productId: z.string().trim().min(1),
  qty: z.coerce.number().int().positive().max(1000),
})

export const createInvoiceSchema = z.object({
  items: z.array(invoiceItemSchema).min(1),
  discount: z.coerce.number().min(0).optional(),
  tax: z.coerce.number().min(0).optional(),
  paymentMethod: z.enum(["cash", "card"]),
  customer: z.string().trim().optional().nullable(),
})
