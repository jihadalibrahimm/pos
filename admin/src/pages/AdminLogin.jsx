import { useEffect, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiUser, FiLock, FiShield } from "react-icons/fi"
import AdminAuthContext from "../context/AdminAuthContext"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)

  const { login, error } = useContext(AdminAuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!error) return;

    setShowError(true)
    const timer = setTimeout(() => setShowError(false), 3000)
    return () => clearTimeout(timer)
  }, [error])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(email, password)
    if (success) navigate("/dashboard")
    setLoading(false)
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-slate-100 via-slate-50 to-zinc-100
      "
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
        w-full max-w-md bg-white border 
        border-slate-200 rounded-2xl shadow-xl p-10"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex justify-center "
          >
            <FiShield className="text-yellow-500 text-5xl"/>
          </motion.div>

          <h1 className="text-2xl font-semibold text-slate-800">
            Admin Panel
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Login to manage the system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div
            className="
              flex items-center gap-3
              border border-slate-300
              bg-slate-50
              p-3 rounded-lg
              focus-within:border-indigo-500
              transition
            "
          >
            <FiUser className="text-slate-400" />
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full bg-transparent outline-none
                text-slate-800 placeholder-slate-400
              "
            />
          </div>

          {/* Password */}
          <div
            className="
              flex items-center gap-3
              border border-slate-300
              bg-slate-50
              p-3 rounded-lg
              focus-within:border-indigo-500
              transition
            "
          >
            <FiLock className="text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full bg-transparent outline-none
                text-slate-800 placeholder-slate-400
              "
            />
          </div>

          {/* Error */}
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-2 text-center"
            >
              <p className="text-red-600 text-sm font-medium">
                {error}
              </p>
            </motion.div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 bg-gradient-to-r from-yellow-400 cursor-pointer to-orange-500
            rounded-lg font-medium transition  hover:to-orange-700 
              ${loading
                ? "bg-indigo-300 cursor-not-allowed text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }
            `}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AdminLogin