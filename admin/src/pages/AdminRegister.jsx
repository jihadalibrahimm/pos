import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiUser, FiUserPlus, FiLock, FiShield } from "react-icons/fi"
import { MdOutlineMail } from "react-icons/md";
import AdminAuthContext from "../context/AdminAuthContext"

function AdminRegister() {
  const { register, error } = useContext(AdminAuthContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await register(name, email, password, role)

    if (success) {
      setTimeout(() => navigate("/dashboard"), 500)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#f0e5d2] to-[#e2d1b8] p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-[#C9A86A]/30"
      >
        <div className="text-center mb-6">
          <FiShield className="mx-auto text-[#C9A86A] text-5xl mb-2" />
          <h1 className="text-2xl font-bold">Create Admin Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border p-3 rounded-lg bg-gray-50">
            <FiUser />
            <input
              type="text"
              placeholder="Full name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 border p-3 rounded-lg bg-gray-50">
            <MdOutlineMail />
            <input
              type="email"
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 border p-3 rounded-lg bg-gray-50">
            <FiLock />
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-lg border"
          >
            <option value="admin">Admin</option>
            <option value="super-admin">Super Admin</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-[#C9A86A] hover:bg-[#C9A86A]/80 cursor-pointer text-white py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AdminRegister
