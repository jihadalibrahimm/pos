import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AdminAuthContext from "../context/AdminAuthContext"

function ProtectedRoute({ children }) {
  const { admin, loading } = useContext(AdminAuthContext)

  if (loading) {
   return <div className="min-h-screen flex items-center justify-center text-lg">Checking session...</div>
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute