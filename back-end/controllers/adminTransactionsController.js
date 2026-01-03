import Transaction from "../models/Transaction.js";
import Project from "../models/Project.js";

export const createTransaction = async (req, res) => {
  try {
    const { projectId, amount, userId, paymentMethod } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const transaction = await Transaction.create({
      projectId,
      amount,
      userId,
      paymentMethod,
      status: "completed"
    })

    project.collectedAmount = (project.collectedAmount || 0) + amount
    await project.save()

    res.json(transaction)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllTransactions = async(req,res) => {
    const transactions = await Transaction.find()
    .populate("projectId","name")
    .populate("userId", "name email")
    res.json(transactions)
}

export const getTransactionById = async(req,res) => {
    const transaction = await Transaction.findById(req.params.id)
    .populate("projectId","name")
    .populate("userId", "name email")
    res.json(transaction)
}

export const updateTransaction = async(req,res) => {
    const update = await Transaction.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.json(update)
}

export const deleteTransaction = async(req,res) => {
    await Transaction.findByIdAndDelete(req.params.id)
    res.json({message:"Transaction deleted"})
}