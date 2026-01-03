import { useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { HiMenu, HiX } from "react-icons/hi"
import { Bell, Rocket, User } from "lucide-react"
import { AuthContext } from "../context/AuthContext"

function Header() {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Invoices", path: "/invoices" },
    { name: "Customers", path: "/customers" },
    { name: "Reports", path: "/reports" },
    { name: "Notifications", path: "/notifications" },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl
      bg-[#f8f6f1] border-b border-neutral-300 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-neutral-900">
          <Rocket className="w-6 h-6 text-yellow-500" />
          <Link to={'/'}>POS System</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <motion.div key={link.path} whileHover={{scale:1.1}}>
              <Link  to={link.path}
              className={`relative text-sm font-medium transition-all
              ${location.pathname.startsWith(link.path)
                ? "text-yellow-500"
                : "text-neutral-700 hover:text-yellow-500"}`}
            >
              {link.name}
              {location.pathname.startsWith(link.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
              )}
            </Link>
            </motion.div>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/notifications">
                <Bell size={22} className="text-yellow-500" />
              </Link>
              <Link to="/profile">
                <User size={22} className="text-yellow-500" />
              </Link>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-yellow-400 to-orange-500
                px-4 py-1.5 rounded-full text-white font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-yellow-500">Login</Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500
                px-4 py-1.5 rounded-full text-white font-medium
                hover:bg-amber-600 "
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="md:hidden text-2xl text-neutral-900 cursor-pointer"
        >
          {isMobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#f8f6f1] border-t border-neutral-300 overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">

              {/* Nav Links */}
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium
                    ${location.pathname.startsWith(link.path)
                      ? "text-yellow-500"
                      : "text-neutral-700 hover:text-yellow-500"}`}
                >
                  {link.name}
                </Link>
              ))}

              {/* User Info + Notifications */}
              {user && (
                <div className="flex items-center gap-4 mt-2">
                  <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                    <Bell size={22} className="text-yellow-500" />
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={22} className="text-yellow-500" />
                  </Link>
                  <button
                    onClick={async () => {
                      await  logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1.5 rounded-full text-white font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}

              {!user && (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1.5 rounded-full text-white font-medium w-fit"
                  >
                    Register
                  </Link>
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