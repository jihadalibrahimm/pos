import { z } from "zod"

const email = z.email().trim().toLowerCase()
const password = z.string().min(8, "Password must be at least 8 characters").max(128)

export const userRegisterSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  password,
})

export const userLoginSchema = z.object({
  email,
  password: z.string().min(1),
})

export const adminRegisterSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  password,
  role: z.enum(["super-admin", "admin"]),
})

export const adminLoginSchema = z.object({
  email,
  password: z.string().min(1),
})
