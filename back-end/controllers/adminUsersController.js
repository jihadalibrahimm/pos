import User from "../models/User.js"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// CREATE user (password auto)
export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body

    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const tempPassword = "123456"
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// UPDATE user (role only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const { name, email, role } = req.body

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password")

    if (!updated) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
