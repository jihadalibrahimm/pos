import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search } from "lucide-react";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const deleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await API.delete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice");
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toString().includes(search) ||
      (inv.customer?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  if (loading)
    return (
      <div className="pt-32 text-center text-xl font-semibold animate-pulse">
        Loading invoices...
      </div>
    );

  return (
    <div className="pt-32 p-10 min-h-screen bg-[#f6f4ef]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-neutral-900">Invoices</h1>

        {/* Search */}
        <div className="flex items-center gap-2 border rounded-xl p-2 bg-white">
          <Search className="text-neutral-600" />
          <input
            type="text"
            placeholder="Search by number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none px-2 py-1"
          />
        </div>
      </div>

      {/* Invoice Cards */}
      {filteredInvoices.length === 0 ? (
        <p className="text-center text-neutral-500 mt-20">No invoices found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredInvoices.map((inv) => (
              <motion.div
                key={inv._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border"
              >
                {/* Delete */}
                <button
                  onClick={() => deleteInvoice(inv._id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
                >
                  <Trash2 className="text-red-600" size={18} />
                </button>

                {/* Header */}
                <h2 className="text-xl font-bold mb-2">
                  Invoice #{inv.invoiceNumber}
                </h2>

                {/* Basic Info */}
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {inv.customer ? inv.customer.name : "Walk-in"}
                  </p>
                  <p>
                    <span className="font-medium">Cashier:</span>{" "}
                    {inv.cashier?.name || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span>{" "}
                    {inv.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(inv.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Items */}
                <div className="mt-4 border-t pt-3">
                  <p className="font-semibold mb-2 text-sm">Items</p>
                  <div className="space-y-1 text-sm">
                    {inv.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-neutral-700"
                      >
                        <span>
                          {item.name} × {item.qty}
                        </span>
                        <span>${item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-4 border-t pt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${inv.subTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>${inv.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${inv.tax}</span>
                  </div>
                </div>

                <div className="mt-3 text-lg font-bold text-neutral-900 flex justify-between">
                  <span>Total</span>
                  <span>${inv.finalTotal}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Invoices;