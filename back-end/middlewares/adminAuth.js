import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token
    if (!token)
      return res.status(401).json({ message: "Unauthorized, no token" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const admin = await Admin.findById(decoded.id).select("-password")
    if (!admin)
      return res.status(401).json({ message: "Admin not found" })

    req.admin = admin
    next()
  } catch (err) {
    console.error("Protect Admin Error:", err)
    return res.status(401).json({ message: "Invalid admin token" })
  }
}

export const authorizeAdmin = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.admin.role)) return res.status(403).json({message:"Access Denied"})
        next()
    }
}