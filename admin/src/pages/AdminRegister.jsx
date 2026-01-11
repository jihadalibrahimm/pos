import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiUser, FiLock, FiShield } from "react-icons/fi"
import { MdOutlineMail } from "react-icons/md"
import AdminAuthContext from "../context/AdminAuthContext"

function AdminRegister() {
  const { register, error } = useContext(AdminAuthContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      setLocalError(error)
      const timer = setTimeout(() => {
        setLocalError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    const success = await register(
      name.trim(),
      email.trim(),
      password,
      role
    )

    setLoading(false)

    if (success) {
      navigate("/dashboard", { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2
      bg-gradient-to-br from-slate-100 pt-10 via-slate-50 to-zinc-100">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-200
          rounded-2xl shadow-xl p-6">

        {/* Header */}
        <div className="text-center mb-5">
          <FiShield className="text-yellow-500 text-5xl mx-auto mb-2" />
          <h1 className="text-2xl font-semibold text-slate-800">
            Create Admin Account
          </h1>
          <p className="text-slate-500 text-sm">
            Register a new admin user
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <Input icon={<FiUser />} value={name} setValue={setName} placeholder="Full name" />

          {/* Email */}
          <Input
            icon={<MdOutlineMail />}
            value={email}
            setValue={setEmail}
            placeholder="admin@example.com"
            type="email"
          />

          {/* Password */}
          <Input
            icon={<FiLock />}
            value={password}
            setValue={setPassword}
            placeholder="••••••••"
            type="password"
          />

          {/* Role */}
          <div className="border border-slate-300 bg-slate-50 p-3 rounded-lg">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700"
            >
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>

          {/* Error */}
          {localError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-2 text-center"
            >
              <p className="text-red-600 text-sm font-medium">
                {localError}
              </p>
            </motion.div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition
              bg-gradient-to-r from-yellow-400 to-orange-500 text-white
              ${loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-yellow-500 hover:to-orange-600"
              }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>
      </motion.div>
    </div>
  )
}

/* 🔹 Component صغير لتخفيف التكرار */
function Input({ icon, value, setValue, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-3 border border-slate-300
      bg-slate-50 p-3 rounded-lg focus-within:border-indigo-500 transition">
      <span className="text-slate-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full bg-transparent outline-none
          text-slate-800 placeholder-slate-400"
      />
    </div>
  )
}

export default AdminRegister