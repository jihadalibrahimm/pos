import { useEffect, useMemo, useState } from "react"
import API from "../api/axios"
import { FiBarChart, FiCalendar, FiFileText, FiTrendingUp } from "react-icons/fi"
import { motion } from "framer-motion"

function Reports() {
  const [dailyReport, setDailyReport] = useState({ totalSales: 0, count: 0 })
  const [rangeReport, setRangeReport] = useState({ total: 0, invoices: [] })
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const start = new Date()
        start.setDate(start.getDate() - 30)

        const [dailyRes, rangeRes, topRes] = await Promise.all([
          API.get("/admin/reports/daily"),
          API.post("/admin/reports/range", {
            start: start.toISOString(),
            end: new Date().toISOString(),
          }),
          API.get("/admin/reports/top-products"),
        ])

        setDailyReport(dailyRes.data || { totalSales: 0, count: 0 })
        setRangeReport(rangeRes.data || { total: 0, invoices: [] })
        setTopProducts(topRes.data || [])
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const averageTicket = useMemo(() => {
    if (!rangeReport.invoices?.length) return 0
    return Number(rangeReport.total || 0) / rangeReport.invoices.length
  }, [rangeReport])

  if (loading) {
    return <div className="p-8 text-xl font-semibold animate-pulse">Loading Reports...</div>
  }

  if (error) {
    return <div className="p-8 text-xl font-semibold text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-5 bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9] min-h-screen mx-auto pt-24 space-y-4">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <FiBarChart className="text-2xl text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      </motion.div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ReportCard title="Today Sales" icon={<FiTrendingUp />} value={`$${Number(dailyReport.totalSales || 0).toFixed(2)}`} subtitle={`${dailyReport.count || 0} invoices`} />
        <ReportCard title="Last 30 Days" icon={<FiCalendar />} value={`$${Number(rangeReport.total || 0).toFixed(2)}`} subtitle={`${rangeReport.invoices?.length || 0} invoices`} />
        <ReportCard title="Average Ticket" icon={<FiFileText />} value={`$${averageTicket.toFixed(2)}`} subtitle="Last 30 days" />
      </section>

      <section className="bg-white rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Top Products</h2>
        <div className="space-y-2">
          {topProducts.length ? (
            topProducts.map((item, index) => (
              <div key={`${item._id}-${index}`} className="flex justify-between items-center rounded-lg border bg-gray-50 px-3 py-2">
                <span className="font-medium text-gray-800">{item._id}</span>
                <span className="text-sm text-gray-600">{item.sold} sold</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No product sales data available.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function ReportCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center gap-2 text-indigo-600 mb-2">
        {icon}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

export default Reports
