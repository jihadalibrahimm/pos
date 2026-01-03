import { createContext, useState, useEffect } from "react"
import axios from "../api/axios"
import { toast } from "react-toastify"
const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get("/admin/auth/me", { withCredentials: true })
        setAdmin(res.data.admin)
      } catch(err){
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  
  
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "/admin/auth/login",
        { email, password },
        { withCredentials: true }
      )
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

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post(
        "/admin/auth/register",
        { name, email, password, role },
        { withCredentials: true }
      )
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
  
  const logout = async () => {
  try {
    await axios.post("/admin/auth/logout", {}, { withCredentials: true })
    setAdmin(null)
    setError(null)
    return true
  } catch (err) {
    return false
  }}

return (
    <AdminAuthContext.Provider
      value={{ admin, loading, error, login, register, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export default AdminAuthContext