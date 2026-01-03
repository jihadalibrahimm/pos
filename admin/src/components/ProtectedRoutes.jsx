import { Navigate } from "react-router-dom"
import { useContext } from "react"
import AdminAuthContext from "../context/AdminAuthContext"

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext)

  if (loading) return null // أو Spinner

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
