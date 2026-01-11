import { useEffect, useState } from "react"
import API from "../api/axios"
import { motion } from "framer-motion"

import {
  LineChart,
  BarChart3,
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  CreditCard,
  Banknote,
} from "lucide-react"

import { FaBoxOpen } from "react-icons/fa"

import {
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  YAxis,
} from "recharts"

/* -------------------------------------------------- */

function Reports() {
  const [daily, setDaily] = useState(null)
  const [range, setRange] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [chartData, setChartData] = useState([])
  const [dates, setDates] = useState({ start: "", end: "" })

  /* ------------------ Fetch Data ------------------ */
  useEffect(() => {
    API.get("/reports/daily").then(res => setDaily(res.data))
    API.get("/reports/top-products").then(res => setTopProducts(res.data))
    API.get("/reports/weekly").then(res => setChartData(res.data))
  }, [])

  const getRangeReport = e => {
    e.preventDefault()
    API.post("/reports/range", dates).then(res => setRange(res.data))
  }

  /* ------------------ Payment Data ------------------ */
  const paymentData = [
    { name: "Cash", value: daily?.cash || 0 },
    { name: "Card", value: daily?.card || 0 },
  ]

  const COLORS = ["#111827", "#9CA3AF"]

  /* -------------------------------------------------- */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 bg-[#f8f6f1]"
    >
      {/* ================= HERO ================= */}
      <section className="max-w-[1600px] mx-auto px-8 mb-20">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r
        from-neutral-900 via-neutral-800 to-neutral-900 p-16 text-white shadow-2xl">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),transparent_60%)]" />

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-extrabold flex items-center gap-4"
          >
            Reports & Analytics <LineChart size={44} />
          </motion.h1>

          <p className="mt-5 max-w-2xl text-neutral-300 text-lg">
            Advanced sales analytics, performance tracking, and business insights
            "built for decision makers".
          </p>
        </div>
      </section>

      {/* ================= KPI CARDS ================= */}
      <section className="max-w-[1600px] mx-auto px-8 mb-20 grid md:grid-cols-4 gap-8">
        {[
          {
            title: "Today Sales",
            value: `${daily?.totalSales || 0} $`,
            icon: <TrendingUp />,
          },
          {
            title: "Invoices",
            value: daily?.count || 0,
            icon: <Calendar />,
          },
          {
            title: "Cash Payments",
            value: `${daily?.cash || 0} $`,
            icon: <Banknote />,
          },
          {
            title: "Card Payments",
            value: `${daily?.card || 0} $`,
            icon: <CreditCard />,
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-8 shadow-lg border"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-neutral-900 text-white rounded-xl">
                {kpi.icon}
              </div>
              <h3 className="text-neutral-600">{kpi.title}</h3>
            </div>

            <p className="text-4xl font-bold text-neutral-900">
              {kpi.value}
            </p>

            <div className="h-1 bg-neutral-200 rounded-full mt-4">
              <div className="h-1 bg-neutral-900 rounded-full w-2/3" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* ================= CHARTS ================= */}
      <section className="max-w-[1600px] mx-auto px-8 mb-20 grid lg:grid-cols-3 gap-10">

        {/* Weekly Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-lg border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 /> Weekly Sales Trend
          </h2>

          <div className="h-80">
            <ResponsiveContainer>
              <RLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#111827"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Pie */}
        <div className="bg-white rounded-3xl p-10 shadow-lg border">
          <h2 className="text-xl font-bold mb-6">
            Payment Distribution
          </h2>

          <div className="flex justify-center">
            <PieChart width={260} height={260}>
              <Pie
                data={paymentData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {paymentData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </section>

      {/* ================= RANGE REPORT ================= */}
      <section className="max-w-[1600px] mx-auto px-8 mb-20 grid lg:grid-cols-2 gap-10">

        <div className="bg-white rounded-3xl p-10 shadow-lg border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Calendar /> Sales Between Dates
          </h2>

          <form onSubmit={getRangeReport} className="flex gap-4 mb-6">
            <input
              type="date"
              value={dates.start}
              onChange={e => setDates({ ...dates, start: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="date"
              value={dates.end}
              onChange={e => setDates({ ...dates, end: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <button className="bg-neutral-900 text-white px-6 rounded-lg flex items-center gap-2">
              Generate <ArrowRight size={18} />
            </button>
          </form>

          {range && (
            <div className="space-y-2 text-neutral-700">
              <p><b>Total Sales:</b> {range.total} $</p>
              <p><b>Invoices:</b> {range.invoices.length}</p>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "Best Day", value: "Wednesday" },
            { title: "Avg Invoice", value: "42 $" },
            { title: "Top Category", value: "Electronics" },
            { title: "Growth", value: "+18%" },
          ].map((i, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 text-white rounded-3xl p-8 shadow-xl"
            >
              <p className="text-neutral-400">{i.title}</p>
              <h3 className="text-3xl font-bold mt-2">{i.value}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TOP PRODUCTS ================= */}
      <section className="max-w-[1600px] mx-auto px-8">
        <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
          <Star /> Top Products
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {topProducts.map((p, index) => (
            <motion.div
              key={p._id}
              whileHover={{ y: -6 }}
              className="relative bg-white rounded-3xl p-6 shadow-lg border"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-neutral-900
              text-white rounded-full flex items-center justify-center text-sm">
                #{index + 1}
              </div>

              <FaBoxOpen size={26} className="mb-4" />
              <h3 className="font-bold text-neutral-900">{p._id}</h3>
              <p className="text-neutral-600">Sold: {p.sold}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

export default Reports
