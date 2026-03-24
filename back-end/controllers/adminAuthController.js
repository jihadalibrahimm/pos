import Admin from "../models/Admin.js"
import bcrypt from "bcryptjs"
import { sendAdminToken } from "../utilities/generateAdminToken.js"
import { getCookieOptions } from "../utilities/cookieOptions.js"

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const adminCount = await Admin.countDocuments()
    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin self-registration is disabled" })
    }

    const exists = await Admin.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role === "super-admin" ? "super-admin" : "admin",
    })

    return sendAdminToken(admin, res)
  } catch (err) {
    console.error("ADMIN REGISTER ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    return sendAdminToken(admin, res)
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export const adminLogout = (req, res) => {
  res.clearCookie("admin_token", getCookieOptions())

  res.json({ message: "Logged out" })
}

export const getAdminProfile = (req, res) => {
  res.json(req.admin)
}
