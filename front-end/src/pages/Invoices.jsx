import { useEffect, useMemo, useState } from 'react'
import API from '../api/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, Plus, X, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const [newInvoice, setNewInvoice] = useState({
    items: [],
    discount: 0,
    tax: 0,
    paymentMethod: "cash",
    customer: "",
  })

  const fetchAll = async () => {
    try {
      const [invRes, proRes, custRes] = await Promise.all([
        API.get('/invoices'),
        API.get('/products'),
        API.get('/customers'),
      ])
      setInvoices(invRes.data)
      setProducts(proRes.data)
      setCustomers(custRes.data)
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load invoices data"
      toast.error(message)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  /* ================= Items ================= */
  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", qty: 1, total: 0 }]
    }))
  }

  const updateItem = (idx, field, value) => {
    const items = [...newInvoice.items]
    items[idx][field] = field === "qty" ? Number(value) : value

    const product = products.find(p => p._id === items[idx].productId)
    if (product) {
      items[idx].total = product.sellingPrice * items[idx].qty
    }

    setNewInvoice(prev => ({ ...prev, items }))
  }

  const removeItem = (idx) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }))
  }

  const subTotal = newInvoice.items.reduce((s, i) => s + i.total, 0)
  const finalTotal = subTotal - newInvoice.discount + newInvoice.tax

  /* ================= Save ================= */
  const saveInvoice = async () => {
    if (!newInvoice.items.length) {
      toast.error("Please add at least one item")
      return
    }

    try {
      await API.post("/invoices", {
        items: newInvoice.items.map(i => ({
          productId: i.productId,
          qty: i.qty
        })),
        discount: newInvoice.discount,
        tax: newInvoice.tax,
        paymentMethod: newInvoice.paymentMethod,
        customer: newInvoice.customer || null
      })

      toast.success("Invoice created")
      setOpen(false)
      fetchAll()
      setNewInvoice({
        items: [],
        discount: 0,
        tax: 0,
        paymentMethod: "cash",
        customer: ""
      })
    } catch {
      toast.error("Failed to create invoice")
    }
  }

  /* ================= Filter ================= */
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        inv.invoiceNumber.toString().includes(search) ||
        inv.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        inv.cashier?.name?.toLowerCase().includes(search.toLowerCase())

      const matchPayment =
        paymentFilter === "all" || inv.paymentMethod === paymentFilter

      return matchSearch && matchPayment
    })
  }, [invoices, search, paymentFilter])

  return (
    <div className="pt-32 p-10 bg-[#f6f4ef] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Receipt size={32} className="text-[#C9A86A]" />
          <h1 className="text-4xl font-bold">Invoices</h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#C9A86A] text-white px-5 py-3 rounded-xl"
        >
          + Add Invoice
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <input
          className="flex-1 p-3 rounded-xl border"
          placeholder="Search invoice / customer / cashier"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="p-3 rounded-xl border"
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map(inv => (
          <motion.div key={inv._id} whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl border shadow">
            <h2 className="font-bold text-xl mb-2">
              Invoice #{inv.invoiceNumber}
            </h2>
            <p><b>Customer:</b> {inv.customer?.name || "Walk-in"}</p>
            <p><b>Cashier:</b> {inv.cashier?.name || "—"}</p>
            <p><b>Payment:</b> {inv.paymentMethod}</p>
            <p><b>Date:</b> {new Date(inv.createdAt).toLocaleString("ar-SY")}</p>

            <div className="mt-3 border-t pt-3 text-sm">
              {inv.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.name} × {i.qty}</span>
                  <span>${i.total}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm">
              <div>Subtotal: ${inv.subTotal}</div>
              <div>Discount: ${inv.discount}</div>
              <div>Tax: ${inv.tax}</div>
            </div>

            <div className="mt-2 font-bold">
              Total: ${inv.finalTotal}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= Modal ================= */}
        <AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Invoice
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X />
          </button>
        </div>

        {/* Customer */}
        <select
          className="w-full p-3 border rounded-xl mb-5 focus:ring-2 focus:ring-[#C9A86A]/40 outline-none"
          value={newInvoice.customer}
          onChange={e =>
            setNewInvoice(p => ({ ...p, customer: e.target.value }))
          }
        >
          <option value="">Walk-in Customer</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Items */}
        <div className="space-y-3 mb-5">
          {newInvoice.items.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-4 gap-3"
            >
              <select
                className="col-span-2 border p-2 rounded-lg"
                value={item.productId}
                onChange={e =>
                  updateItem(idx, "productId", e.target.value)
                }
              >
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="border p-2 rounded-lg"
                value={item.qty}
                onChange={e =>
                  updateItem(idx, "qty", e.target.value)
                }
              />

              <button
                onClick={() => removeItem(idx)}
                className="rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition flex justify-center items-center"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add Item Button (محسّن ✨) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addItem}
          className="w-full mb-6 flex items-center justify-center gap-2 py-3 rounded-xl
                     bg-gradient-to-r from-[#C9A86A] to-[#b89655]
                     text-white font-semibold shadow-md hover:shadow-lg transition"
        >
          <Plus size={18} />
          Add New Item
        </motion.button>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="Tax"
            className="border p-2 rounded-lg"
            value={newInvoice.tax}
            onChange={e =>
              setNewInvoice(p => ({ ...p, tax: +e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Discount"
            className="border p-2 rounded-lg"
            value={newInvoice.discount}
            onChange={e =>
              setNewInvoice(p => ({ ...p, discount: +e.target.value }))
            }
          />
        </div>

        <div className="font-bold text-right text-lg mb-6">
          Total: <span className="text-[#C9A86A]">${finalTotal}</span>
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={saveInvoice}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          Save Invoice
        </motion.button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}

export default Invoices