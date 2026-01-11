import { createContext, useState, useEffect } from "react"
import axios from "../api/axios"
import { toast } from "react-toastify"

const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 🔹 تحقق من الجلسة عند mount
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/admin/auth/me") // backend route /me
        setAdmin(res.data) // لاحظ: getAdminProfile يرسل مباشرة req.admin
      } catch (err) {
        setAdmin(null)
        toast.error("Session expired, please login again")
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post("/admin/auth/login", { email, password })
      setAdmin(res.data.admin)
      setError(null)
      toast.success("Login successful")
      return true
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed"
      setError(msg)
      toast.error(msg)
      return false
    }
  }

  const logout = async () => {
    try {
      await axios.post("/admin/auth/logout", {}, { withCredentials: true })
      setAdmin(null)
      setError(null)
      toast.success("Logged out successfully")
      return true
    } catch {
      toast.error("Logout failed")
      return false
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post("/admin/auth/register", { name, email, password, role })
      setAdmin(res.data.admin)
      setError(null)
      toast.success("Admin registered successfully")
      return true
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed"
      setError(msg)
      toast.error(msg)
      return false
    }
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, login, logout, register }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export default AdminAuthContext