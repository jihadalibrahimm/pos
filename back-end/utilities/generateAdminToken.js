import jwt from "jsonwebtoken"
import { getCookieOptions } from "./cookieOptions.js"

export const sendAdminToken = (admin, res) => {
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.cookie("admin_token", token, getCookieOptions())

  res.status(200).json({
    success: true,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  })
}