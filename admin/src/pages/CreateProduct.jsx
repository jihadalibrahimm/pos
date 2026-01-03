import API from "../api/axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiPackage, FaPlusCircle } from "react-icons/fi"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

function CreateProduct() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [qty, setQty] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    if (!name || !price || !qty) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      await API.post(
        "/products",
        { name, price: Number(price), qty: Number(qty) },
        { withCredentials: true }
      )

      toast.success("Product created successfully")
      navigate("/products", { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6
    bg-linear-to-b from-[#faf6ef] to-[#e8ddc9]">

      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-xl p-10
        rounded-3xl shadow-2xl border border-[#C9A86A]/30"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FiPackage size={42} className="text-[#C9A86A]" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-8">
          Create Product
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="text-neutral-700 font-medium">Name</label>
            <input
              type="text"
              value={name}
              placeholder="Product name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25
              focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1
              transition-all outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-neutral-700 font-medium">Price ($)</label>
            <input
              type="number"
              value={price}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25
              focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1
              transition-all outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-neutral-700 font-medium">Quantity</label>
            <input
              type="number"
              value={qty}
              placeholder="QTY"
              onChange={(e) => setQty(e.target.value)}
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25
              focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1
              transition-all outline-none"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="bg-[#C9A86A] text-white py-3 rounded-xl
            flex items-center justify-center gap-2 font-semibold
            shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
          >
            <FaPlusCircle siz={20} />
            {loading ? "Saving..." : "Add Product"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateProduct