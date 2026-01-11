import jwt from "jsonwebtoken"

export const sendAdminToken = (admin, res) => {
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: false,        // مهم محلياً
    sameSite: "lax",
    path: "/",              // 🔥🔥🔥 هذا السطر مهم جدًا
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

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