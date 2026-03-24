import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Admin from "../models/Admin.js"

export const protectAny = async (req, res, next) => {
  try {
    const userToken = req.cookies.token
    const adminToken = req.cookies.admin_token

    if (!userToken && !adminToken) {
      return res.status(401).json({ message: "Unauthorized, no token" })
    }

    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select("-password")
      if (user) {
        req.user = user
        req.auth = { id: user._id, role: user.role, type: "user" }
        return next()
      }
    }

    if (adminToken) {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET)
      const admin = await Admin.findById(decoded.id).select("-password")
      if (admin) {
        req.admin = admin
        req.auth = { id: admin._id, role: admin.role, type: "admin" }
        return next()
      }
    }

    return res.status(401).json({ message: "Invalid token" })
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const authorizeAny = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    return res.status(403).json({ message: "Access Denied" })
  }
  return next()
}
