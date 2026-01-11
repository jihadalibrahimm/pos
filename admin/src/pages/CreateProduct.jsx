import React, { useState } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import { FiPackage } from "react-icons/fi"
import { FaPlusCircle } from "react-icons/fa"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

function CreateProduct() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !category || !sellingPrice || !purchasePrice || !stock) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", name)
      formData.append("category", category)
      formData.append("sellingPrice", Number(sellingPrice))
      formData.append("purchasePrice", Number(purchasePrice))
      formData.append("stock", Number(stock))
      if (image) formData.append("image", image)

      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      toast.success("Product created successfully")
      navigate("/products")
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create product"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-24 bg-[#fdfcf7]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl border border-[#C9A86A]/30 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <FiPackage size={50} className="text-[#C9A86A]" />
          <h2 className="text-3xl font-bold text-[#2c2c2c] mt-2">Create Product</h2>
          <p className="text-gray-600 text-sm mt-1">Fill all fields to add a new product</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" value={name} setValue={setName} placeholder="Product name" />
          <Input label="Category" value={category} setValue={setCategory} placeholder="Category" />
          <Input label="Selling Price ($)" type="number" value={sellingPrice} setValue={setSellingPrice} placeholder="Selling Price" />
          <Input label="Purchase Price ($)" type="number" value={purchasePrice} setValue={setPurchasePrice} placeholder="Purchase Price" />
          <Input label="Stock" type="number" value={stock} setValue={setStock} placeholder="Quantity in stock" />

          {/* Image Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] outline-none bg-white/90 cursor-pointer transition-all"
            />
            {preview && (
              <motion.img
                src={preview}
                alt="Preview"
                className="mt-2 w-full h-52 object-cover rounded-xl border border-gray-200 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>

          <div></div> {/* Empty div for spacing */}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0px 6px 20px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="md:col-span-2 bg-[#C9A86A] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
          >
            <FaPlusCircle size={20} />
            {loading ? "Saving..." : "Add Product"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

function Input({ label, value, setValue, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] outline-none bg-white/90 transition-all cursor-pointer"
      />
    </div>
  )
}

export default CreateProduct
