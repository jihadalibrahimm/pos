import React, { useState, useEffect } from "react"
import API from "../api/axios"
import { AnimatePresence, motion } from "framer-motion"
import { FiDollarSign, FiUser, FiFolder } from "react-icons/fi"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { toast } from "react-toastify"

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    projectId: "",
    userId: "",
    amount: "",
    paymentMethod: "cash",
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

   const paymentStyles = {
    cash: "bg-green-100 text-green-700",
    card: "bg-blue-100 text-blue-700",
    online: "bg-purple-100 text-purple-700",
  }

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [txRes, projectsRes, usersRes] = await Promise.all([
        API.get("/admin/transactions"),
        API.get("/admin/projects"),
        API.get("/admin/users")
      ])
      setTransactions(txRes.data)
      setProjects(projectsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!form.projectId || !form.userId || !form.amount) {
    toast.error("Please fill all required fields")
    return
  }

  try {
    let res
    const payload = { ...form, amount: Number(form.amount) }

    if (editingId) {
      res = await API.put(`/admin/transactions/${editingId}`, payload)
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === editingId ? res.data : tx))
      )
      toast.success("Transaction updated")
    } else {
      res = await API.post("/admin/transactions", payload)
      // Use populated transaction returned from backend
      setTransactions((prev) => [res.data, ...prev])
      toast.success("Transaction added")
    }

    setForm({ projectId: "", userId: "", amount: "", paymentMethod: "cash" })
    setEditingId(null)
  } catch (err) {
    const msg = err.response?.data?.message || "Operation failed"
    toast.error(msg)
  }
}

  const handleEdit = (tx) => {
    setForm({
      projectId: tx.projectId?._id || "",
      userId: tx.userId?._id || "",
      amount: tx.amount,
      paymentMethod: tx.paymentMethod,
    })
    setEditingId(tx._id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return
    try {
      await API.delete(`/admin/transactions/${id}`)
      setTransactions((prev) => prev.filter((tx) => tx._id !== id))
      toast.success("Transaction deleted")
    } catch {
      toast.error("Failed to delete transaction")
    }
  }

  if (loading) return <div className="p-10 text-xl">Loading...</div>

  return (
    <div className="p-6 pt-24 min-h-screen bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9]">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6 text-indigo-700">
        <FiDollarSign /> Transactions
      </h1>

      {/* FORM */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-lg grid md:grid-cols-5 gap-4 mb-8"
      >
        {/* Project dropdown */}
        <select
          value={form.projectId}
          onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        {/* User dropdown */}
        <select
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
          ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />

        {/* Payment method */}
        <select
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-indigo-600
          text-white py-2 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
        >
          <FaPlus /> {editingId ? "Update" : "Add"}
        </button>
      </motion.form>

      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-semibold flex items-center gap-2">
                  <FiFolder /> {tx.projectId?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FiUser /> {tx.userId?.name || "N/A"} ({tx.userId?.email || "N/A"})
                </p>
                <p className="flex items-center gap-1 text-gray-700">
                  <FiDollarSign /> {tx.amount} USD
                </p>
                {/*  Payment Method – styled */}
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${paymentStyles[tx.paymentMethod] || "bg-gray-100 text-gray-600"}`}
                >
                  {tx.paymentMethod}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tx)}
                  className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 cursor-pointer transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-600 hover:text-white cursor-pointer transition"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {transactions.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No transactions found</p>
        )}
      </div>
    </div>
  )
}

export default Transactions
