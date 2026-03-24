import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import API from "../api/axios"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import {
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiActivity,
  FiBell,
  FiArrowRight,
} from "react-icons/fi"

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [projects, setProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, transactionsRes, projectsRes, notificationsRes] = await Promise.allSettled([
          API.get("/admin/dashboard", { withCredentials: true }),
          API.get("/admin/transactions", { withCredentials: true }),
          API.get("/admin/projects", { withCredentials: true }),
          API.get("/admin/notifications", { withCredentials: true }),
        ])

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data)
        } else {
          setStats(null)
        }

        if (transactionsRes.status === "fulfilled") {
          setTransactions(transactionsRes.value.data || [])
        } else {
          setTransactions([])
        }

        if (projectsRes.status === "fulfilled") {
          setProjects(projectsRes.value.data || [])
        } else {
          setProjects([])
        }

        if (notificationsRes.status === "fulfilled") {
          setNotifications((notificationsRes.value.data || []).slice(0, 5))
        } else {
          setNotifications([])
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const revenuePerProject = useMemo(() => {
    return projects.map(p => {
      const total = transactions
        .filter(t => t.projectId?._id === p._id)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)

      return {
        name: p.name,
        value: total,
      }
    })
  }, [projects, transactions])

  const transactionTimeline = useMemo(() => {
    return transactions.slice(-7).map((t, i) => ({
      name: `T${i + 1}`,
      amount: Number(t.amount || 0),
    }))
  }, [transactions])

  const projectStatusData = useMemo(() => {
    const map = { active: 0, completed: 0, cancelled: 0 }
    projects.forEach(p => {
      map[p.status] = (map[p.status] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }))
  }, [projects])

  if (loading) {
    return (
      <div className="pt-32 text-center text-lg text-gray-500">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="pt-22 px-5 pb-8 bg-[#f6f4ef] min-h-screen space-y-6">
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Business performance & system overview
        </p>
      </motion.div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Admins" value={stats?.totalAdmins || 0} icon={<FiUsers />} to="/users" />
        <KPI title="Projects" value={projects.length} icon={<FiLayers />} to="/projects" />
        <KPI title="Transactions" value={transactions.length} icon={<FiActivity />} to="/transactions" />
        <KPI title="Total Revenue" value={`${stats?.totalSales || 0} ₺`} icon={<FiDollarSign />} to="/transactions" />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <ChartBox title="Recent Transactions">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionTimeline}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4f46e5" }}
                activeDot={{ r: 6 }}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Revenue per Project">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenuePerProject}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#374151" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="value"
                fill="#10b981"
                stroke="#047857"
                strokeWidth={1}
                radius={[10, 10, 0, 0]}
                maxBarSize={60}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Projects Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Pie
                data={projectStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={4}
              >
                {projectStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </section>

      <section className="bg-white rounded-3xl shadow border p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <FiBell /> Notifications
          </h2>
          <Link to="/admin/notifications" className="text-sm text-indigo-600">
            View all
          </Link>
        </div>

        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n._id}
              className="p-3 rounded-xl bg-gray-50 border flex justify-between items-center"
            >
              <p className="text-sm">{n.message}</p>
              <FiArrowRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#111827",
}

function KPI({ title, value, icon, to }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -6 }}
        className="bg-white p-4 rounded-2xl shadow border flex items-center gap-3"
      >
        <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </motion.div>
    </Link>
  )
}

function ChartBox({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-3xl shadow border h-72"
    >
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="h-56 bg-gray-50 rounded-xl p-2">
        {children}
      </div>
    </motion.div>
  )
}