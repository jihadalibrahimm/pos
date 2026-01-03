import Admin from '../models/Admin.js'
import bcrypt from "bcryptjs"
import { sendAdminToken } from '../utilities/generateAdminToken.js'

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (await Admin.findOne({ email })) {
      return res.status(400).json({ message: "Email exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    sendAdminToken(admin, res)

    res.status(201).json({
      message: "Admin Created",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    return sendAdminToken(admin, res) // 👈 return مهم
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminLogout = (req, res) => {
  res.clearCookie("admin_token")
  res.json({ message: "Logged out" })
}

export const getAdminProfile = (req, res) => {
  res.json(req.admin)
}