import { Link, useLocation, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiMenu, HiX } from "react-icons/hi"
import {
  FiSend,
  FiBell,
  FiPackage,
  FiUser,
  FiFileText,
  FiBarChart,
  FiUsers,
  FiFolder
} from "react-icons/fi"
import AdminAuthContext from "../context/AdminAuthContext"
import { toast } from "react-toastify"
import { FlipRounded } from "@mui/icons-material"

function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { admin, logout } = useContext(AdminAuthContext)
  const navigate = useNavigate()

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FiBarChart /> },
    { name: "Products", path: "/products", icon: <FiPackage /> },
    { name: "Invoices", path: "/invoices", icon: <FiFileText /> },
    { name: "Projects", path: "/projects", icon: <FiFolder /> },
    { name: "Transactions", path: "/transactions", icon: <FiFileText /> },
    { name: "Customers", path: "/customers", icon: <FiUser /> },
    { name: "Users", path: "/users", icon: <FiUsers /> },
  ]

  const handleLogout = async () => {
    setIsMobileMenuOpen(false)
    const success = await logout()
    if (success) {
      toast.success("Logged out successfully")
      navigate("/login", { replace: true })
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#f8f6f1]/90 border-b border-neutral-300 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-neutral-900"
        >
          <FiSend className="w-6 h-6 text-yellow-500" />
          Admin Panel
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path
            return (
              <motion.div key={link.path} whileHover={{ scale: 1.08 }}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-1.5 text-sm font-medium transition
                    ${
                      isActive
                        ? "text-yellow-500"
                        : "text-neutral-700 hover:text-yellow-500"
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </motion.div>
            )
          })}

          {admin && (
            <div className="flex items-center gap-8 ml-4">
              <Link to="/admin/notifications">
                <FiBell size={25} className="text-yellow-500 hover:scale-110 transition" />
              </Link>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="md:hidden text-2xl text-neutral-900"
        >
          {isMobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#f8f6f1] border-t border-neutral-300 overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium
                    ${
                      location.pathname === link.path
                        ? "text-yellow-500"
                        : "text-neutral-700 hover:text-yellow-500"
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              {admin && (
                <div className="flex items-center gap-4 mt-3">
                  <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiBell size={20} className="text-yellow-500" />
                  </Link>

                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiUser size={20} className="text-yellow-500" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1.5 rounded-full text-white text-sm font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header