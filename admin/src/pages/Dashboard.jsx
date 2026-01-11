import React, { useState, useEffect } from "react"
import API from "../api/axios"
import {
  FiUsers,
  FiBox,
  FiFileText,
  FiDollarSign,
  FiArrowRight,
  FiSettings,
  FiCreditCard,
} from "react-icons/fi"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/admin/dashboard")
        setDashboardData(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading)
    return <div className="p-8 text-xl font-semibold">Loading...</div>

  if (error)
    return <div className="p-8 text-xl text-red-600">Error: {error}</div>

  if (!dashboardData) return null

  return (
    <div className="p-6 pt-32 min-h-screen bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9]">

      {/* WELCOME */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold">Welcome back 👋</h2>
        <p className="text-gray-600 mt-1">
          Here’s a quick overview of what’s happening in your system today
        </p>
      </motion.div>

      {/* ================= STAT CARDS (FIRST) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard
          icon={<FiUsers size={32} />}
          label="Total Admins"
          value={dashboardData.totalAdmins}
          color="#4F46E5"
        />

        <StatCard
          icon={<FiBox size={32} />}
          label="Total Products"
          value={dashboardData.totalProducts}
          color="#0EA5E9"
        />

        <StatCard
          icon={<FiFileText size={32} />}
          label="Total Invoices"
          value={dashboardData.totalInvoices}
          color="#F59E0B"
        />

        <StatCard
          icon={<FiDollarSign size={32} />}
          label="Total Sales"
          value={`${dashboardData.totalSales} $`}
          color="#10B981"
        />
      </div>

      {/* ================= QUICK LINKS (SECOND) ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-14"
      >
        <QuickLink to="/users" icon={<FiUsers />} label="Users" />
        <QuickLink to="/products" icon={<FiBox />} label="Products" />
        <QuickLink to="/invoices" icon={<FiFileText />} label="Invoices" />
        <QuickLink to="/transactions" icon={<FiCreditCard />} label="Transactions" />
        <QuickLink to="/profile" icon={<FiSettings />} label="Settings" />
      </motion.div>

      {/* ================= RECENT INVOICES ================= */}
      {dashboardData.recentInvoices?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiFileText />
            Recent Invoices
          </h3>

          <div className="space-y-3">
            {dashboardData.recentInvoices.map((inv) => (
              <motion.div
                key={inv._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200
                           flex justify-between items-center
                           hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold">Invoice #{inv.number}</p>
                  <p className="text-sm text-gray-500">
                    Total: {inv.finalTotal}
                  </p>
                </div>

                <FiArrowRight className="text-gray-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */
function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white p-6 rounded-2xl shadow-md border border-gray-200
      flex items-center gap-4 hover:shadow-xl"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </motion.div>
  )
}

function QuickLink({ to, icon, label }) {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Link to={to}>
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="bg-white border border-gray-200 rounded-xl p-4
          flex flex-col items-center gap-2 shadow-sm hover:shadow-md"
        >
          <div className="text-indigo-600 text-2xl">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default Dashboard