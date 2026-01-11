import Transaction from "../models/Transaction.js"
import Project from "../models/Project.js"
import User from "../models/User.js"
import mongoose from "mongoose"

export const createTransaction = async (req, res) => {
  try {
    const { projectId, userId, amount, paymentMethod } = req.body

    if (!projectId || !userId || !amount) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" })
    }

    const numericAmount = Number(amount)
    if (isNaN(numericAmount)) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const transaction = await Transaction.create({
      projectId,
      userId,
      amount: numericAmount,
      paymentMethod,
      status: "completed",
    })

    // ✅ تحديث آمن بدون كسر validation
    await Project.findByIdAndUpdate(
      projectId,
      { $inc: { collectAmount: numericAmount } }
    )

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("projectId", "name")
      .populate("userId", "name email")

    res.status(201).json(populatedTransaction)
  } catch (err) {
    console.error("CREATE TRANSACTION ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

/* ================= GET ALL ================= */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("projectId", "name")
      .populate("userId", "name email")

    res.json(transactions)
  } catch (err) {
    console.error("GET ALL TRANSACTIONS ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

/* ================= GET BY ID ================= */
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const transaction = await Transaction.findById(id)
      .populate("projectId", "name")
      .populate("userId", "name email")

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.json(transaction)
  } catch (err) {
    console.error("GET TRANSACTION ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

/* ================= UPDATE ================= */
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const updateData = { ...req.body }

    if (updateData.amount !== undefined) {
      const numericAmount = Number(updateData.amount)
      if (isNaN(numericAmount)) {
        return res.status(400).json({ message: "Invalid amount" })
      }
      updateData.amount = numericAmount
    }

    // تأكد من وجود المشروع واليوزر لو تم تغييرهم
    if (updateData.projectId && !mongoose.Types.ObjectId.isValid(updateData.projectId)) {
      return res.status(400).json({ message: "Invalid projectId" })
    }
    if (updateData.userId && !mongoose.Types.ObjectId.isValid(updateData.userId)) {
      return res.status(400).json({ message: "Invalid userId" })
    }

    const updated = await Transaction.findByIdAndUpdate(id, updateData, { new: true })
      .populate("projectId", "name")
      .populate("userId", "name email")

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.json(updated)
  } catch (err) {
    console.error("UPDATE TRANSACTION ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

/* ================= DELETE ================= */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const deleted = await Transaction.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.json({ message: "Transaction deleted" })
  } catch (err) {
    console.error("DELETE TRANSACTION ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}
