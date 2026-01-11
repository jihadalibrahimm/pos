import { useEffect, useState } from "react";
import API from "../api/axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Trash, Plus } from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("info");

  const fetchNotifications = () => {
    setLoading(true);
    API.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // إضافة Notification
  const handleAdd = () => {
    if (!newMessage) return;
    API.post("/notifications/add", { message: newMessage, cashier: newType })
      .then(() => {
        setNewMessage("");
        fetchNotifications();
      })
      .catch((err) => console.log(err));
  };

  // حذف Notification
  const handleDelete = (id) => {
    API.delete(`/notifications/${id}`)
      .then(() => fetchNotifications())
      .catch((err) => console.log(err));
  };

  return (
    <div className="pt-32 min-h-screen px-10 bg-gradient-to-b from-[#faf6ef] to-[#f0e5d2]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="p-3 bg-[#C9A86A] border border-[#C9A86A]/30 rounded-xl">
          <Bell size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 tracking-wide">
          Notifications
        </h1>
      </motion.div>

      {/* Add Notification */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="New notification message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500
          bg-white/90"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="p-3 rounded-lg border bg-white border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="info">Info</option>
          <option value="low_stock">Low Stock</option>
          <option value="invoices">Invoice</option>
        </select>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white cursor-pointer rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} /> Add
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col max-w-4xl mx-auto">
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-600 text-lg text-center py-10"
          >
            Loading notifications...
          </motion.p>
        ) : (
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-neutral-600 text-lg text-center py-10"
              >
                No Notifications
              </motion.p>
            ) : (
              notifications.map((n) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="bg-white rounded-2xl p-5 mb-4 border border-neutral-200 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row justify-between items-center gap-2"
                >
                  <div>
                    <p className="text-neutral-800 font-medium">{n.message}</p>
                    <span className="text-sm text-neutral-500 mt-1 block">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {n.cashier === "low_stock" && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    )}
                    {n.cashier === "invoices" && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Invoice
                      </span>
                    )}
                    {n.cashier === "info" && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Info
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 text-center text-neutral-600"
      >
        <p>End of notifications timeline</p>
      </motion.div>
    </div>
  );
}

export default Notifications;