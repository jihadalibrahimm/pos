import { useEffect, useMemo, useState, useContext } from "react"
import { motion } from "framer-motion"
import {
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
  FiUser,
  FiClock,
  FiCreditCard,
  FiActivity,
} from "react-icons/fi"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"

function Home() {
  const { user } = useContext(AuthContext)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get("/invoices")
        setInvoices(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  /* =======================
     DERIVED DATA
  ======================== */

  const totalRevenue = useMemo(
    () => invoices.reduce((s, i) => s + i.finalTotal, 0),
    [invoices]
  )

  const avgInvoice = useMemo(
    () => (invoices.length ? totalRevenue / invoices.length : 0),
    [totalRevenue, invoices]
  )

  const cashCount = invoices.filter(i => i.paymentMethod === "cash").length
  const cardCount = invoices.filter(i => i.paymentMethod === "card").length

  const highestInvoice = useMemo(() => {
    return [...invoices].sort(
      (a, b) => b.finalTotal - a.finalTotal
    )[0]
  }, [invoices])

  const lastInvoice = invoices[0]

  /* =======================
     UI
  ======================== */

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto space-y-12">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm text-neutral-500">
          Here is what’s happening in your POS system today
        </p>
      </motion.div>

      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Kpi
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<FiDollarSign />}
          gradient="from-green-500 to-emerald-600"
          loading={loading}
        />

        <Kpi
          title="Invoices"
          value={invoices.length}
          icon={<FiFileText />}
          gradient="from-indigo-500 to-blue-600"
          loading={loading}
        />

        <Kpi
          title="Average Invoice"
          value={`$${avgInvoice.toFixed(2)}`}
          icon={<FiTrendingUp />}
          gradient="from-yellow-400 to-orange-500"
          loading={loading}
        />

        <Kpi
          title="Payment Ratio"
          value={`${cashCount} Cash / ${cardCount} Card`}
          icon={<FiCreditCard />}
          gradient="from-purple-500 to-fuchsia-600"
          loading={loading}
        />
      </div>

      {/* ================= INSIGHTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Insight
          title="Highest Invoice"
          value={
            highestInvoice
              ? `$${highestInvoice.finalTotal}`
              : "-"
          }
          subtitle={
            highestInvoice
              ? `Invoice #${highestInvoice.invoiceNumber}`
              : "No data"
          }
          icon={<FiTrendingUp />}
        />

        <Insight
          title="Last Invoice"
          value={
            lastInvoice
              ? `$${lastInvoice.finalTotal}`
              : "-"
          }
          subtitle={
            lastInvoice
              ? new Date(lastInvoice.createdAt).toLocaleString()
              : "No data"
          }
          icon={<FiClock />}
        />

        <Insight
          title="Active Cashier"
          value={lastInvoice?.cashier?.name || "-"}
          subtitle="Last transaction"
          icon={<FiUser />}
        />
      </div>

      {/* ================= INVOICES TABLE ================= */}
      <div className="bg-white dark:bg-neutral-800 border
      border-neutral-200 dark:border-neutral-700
      rounded-2xl shadow-lg overflow-hidden">

        <div className="p-6 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold">
            Recent Invoices
          </h3>
          <FiActivity className="text-neutral-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 dark:bg-neutral-700">
              <tr>
                <Th>Invoice</Th>
                <Th>Customer</Th>
                <Th>Cashier</Th>
                <Th>Payment</Th>
                <Th align="right">Total</Th>
                <Th align="right">Date</Th>
              </tr>
            </thead>

            <tbody>
              {invoices.slice(0, 10).map(inv => (
                <tr
                  key={inv._id}
                  className="border-b hover:bg-neutral-50
                  dark:hover:bg-neutral-700/40"
                >
                  <Td>#{inv.invoiceNumber}</Td>
                  <Td>{inv.customer?.name || "Walk-in"}</Td>
                  <Td>{inv.cashier?.name}</Td>
                  <Td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs
                      ${
                        inv.paymentMethod === "cash"
                          ? "bg-green-100 text-green-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {inv.paymentMethod}
                    </span>
                  </Td>
                  <Td align="right" className="font-medium text-green-600">
                    ${inv.finalTotal}
                  </Td>
                  <Td align="right" className="text-neutral-500">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

/* ================= COMPONENTS ================= */

function Kpi({ title, value, icon, gradient, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 border
      border-neutral-200 dark:border-neutral-700
      rounded-2xl p-6 shadow-md"
    >
      <div className={`w-14 h-14 rounded-xl
      bg-gradient-to-r ${gradient}
      text-white flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-neutral-500">{title}</p>
      <h2 className="text-2xl font-bold">
        {loading ? "..." : value}
      </h2>
    </motion.div>
  )
}

function Insight({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white dark:bg-neutral-800 border
    border-neutral-200 dark:border-neutral-700
    rounded-2xl p-6 shadow-md flex gap-4">
      <div className="text-2xl text-indigo-500">{icon}</div>
      <div>
        <p className="text-sm text-neutral-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>
    </div>
  )
}

function Th({ children, align }) {
  return (
    <th className={`p-4 text-left ${align === "right" && "text-right"}`}>
      {children}
    </th>
  )
}

function Td({ children, align, className }) {
  return (
    <td className={`p-4 ${align === "right" && "text-right"} ${className || ""}`}>
      {children}
    </td>
  )
}

export default Home
