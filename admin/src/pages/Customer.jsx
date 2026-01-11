import { useState, useEffect } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaSort } from "react-icons/fa";
import { toast } from "react-toastify";

const emptyCustomer = { _id: null, name: "", email: "" };

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [current, setCurrent] = useState(emptyCustomer);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customers");
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCustomers(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // فلترة + بحث
  useEffect(() => {
    let data = [...customers];

    if (search) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ترتيب حسب sortOrder
    data.sort((a, b) => {
      if (sortOrder === "desc") return new Date(b.createdAt) - new Date(a.createdAt);
      else return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFiltered(data);
  }, [search, customers, sortOrder]);

  const toggleSort = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const openForm = (customer = emptyCustomer) => {
    setCurrent(customer);
    setIsEdit(!!customer._id);
    setOpenModal(true);
  };

  const closeForm = () => {
    setCurrent(emptyCustomer);
    setIsEdit(false);
    setOpenModal(false);
  };

  const isValid =
    current.name.trim().length >= 3 && /^\S+@\S+\.\S+$/.test(current.email);

  const saveCustomer = async () => {
    if (!isValid || saving) return;

    try {
      setSaving(true);
      if (isEdit) {
        await axios.put(`/customers/${current._id}`, current);
        toast.success("Customer updated successfully");
      } else {
        await axios.post("/customers", current);
        toast.success("Customer added successfully");
      }
      fetchCustomers();
      closeForm();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this customer?")) return;

    await axios.delete(`/customers/${id}`);
    toast.success("Customer deleted successfully");
    fetchCustomers();
  };

  return (
    <div className="pt-32 p-10 min-h-screen bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-4xl font-bold text-neutral-900">Customers</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-[#C9A86A] text-white px-5 py-2 rounded-xl hover:shadow-lg transition"
        >
          <FaEdit /> Add Customer
        </button>
      </motion.div>

      {/* Search + Sort */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-center w-full max-w-md">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <button
          onClick={toggleSort}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
        >
          <FaSort /> {sortOrder === "desc" ? "Newest → Oldest" : "Oldest → Newest"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur-xl rounded-2xl border border-[#C9A86A]/25 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#C9A86A]/20">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.email}</td>
                <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => openForm(c)}
                    className="text-[#C9A86A] hover:text-[#a38552] cursor-pointer"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => deleteCustomer(c._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 p-7 rounded-3xl w-full max-w-sm shadow-2xl border border-[#C9A86A]/40"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                {isEdit ? "Edit Customer" : "Add Customer"}
              </h2>

              <input
                type="text"
                placeholder="Full name"
                value={current.name}
                onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                className="w-full p-3 rounded-xl mb-4 border focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <input
                type="email"
                placeholder="Email address"
                value={current.email}
                onChange={(e) => setCurrent({ ...current, email: e.target.value })}
                className="w-full p-3 rounded-xl mb-4 border focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <div className="flex justify-between mt-6">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={!isValid || saving}
                  onClick={saveCustomer}
                  className={`px-4 py-2 rounded-xl font-semibold text-white cursor-pointer ${
                    isValid ? "bg-[#C9A86A] hover:shadow-lg" : "bg-[#C9A86A]/40 cursor-not-allowed"
                  }`}
                >
                  {saving ? "Saving..." : isEdit ? "Update" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Customer;
