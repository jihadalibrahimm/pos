import React, { useState, useEffect } from "react"
import API from "../api/axios"
import { FiFileText, FiCalendar, FiBarChart } from "react-icons/fi"
import { AnimatePresence, motion } from "framer-motion"

function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/admin/reports") // تأكد من endpoint
        setReports(res.data)
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.message || "Failed to fetch reports")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading)
    return (
      <div className="p-8 text-xl font-semibold animate-pulse">
        Loading Reports...
      </div>
    )

  if (error)
    return (
      <div className="p-8 text-xl font-semibold text-red-600">
        Error: {error}
      </div>
    )

  return (
    <div className="p-6 bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9] min-h-screen mx-auto pt-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <FiBarChart className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {reports.map((r, index) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 bg-white rounded-xl shadow-md border hover:shadow-xl transition cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <FiFileText className="text-blue-600 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Report #{r._id.slice(-6)}
                </h2>
              </div>

              <p className="text-gray-700 text-lg font-medium">
                Total Sales:{" "}
                <span className="text-blue-600">{r.totalSales} USD</span>
              </p>

              <p className="text-gray-500 flex items-center gap-2 mt-2">
                <FiCalendar />
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reports.length === 0 && (
        <p className="mt-10 text-gray-500 text-center">No Reports available</p>
      )}
    </div>
  )
}

export default Reports
