import { useEffect, useState } from "react"
import API from "../api/axios"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom" // ✅ صححت الاسم

function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate() // ✅ صححت الاستدعاء
  const [form, setForm] = useState({
    storeName: "",
    taxRate: "",
    logo: "",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/admin/settings")
        if (res.data) {
          setForm({
            storeName: res.data.storeName || "",
            taxRate: res.data.taxRate || "",
            logo: res.data.logo || "",
          })
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const saveSettings = async () => {
    try {
      setSaving(true)
      await API.put("/admin/settings", {
        storeName: form.storeName,
        taxRate: Number(form.taxRate),
        logo: form.logo,
      })
      toast.success("Settings updated successfully")
      navigate("/profile") // ✅ التنقل بعد الحفظ
    } catch (err) {
      console.error(err)
      toast.error("Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-32 p-10 text-xl font-semibold">
        Loading settings...
      </div>
    )
  }

  return (
    <div className="pt-32 p-10 min-h-screen bg-[#f6f4ef]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-neutral-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-neutral-900">
          Store Settings
        </h1>

        {/* Store Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-neutral-700">
            Store Name
          </label>
          <input
            type="text"
            value={form.storeName}
            onChange={(e) =>
              setForm({ ...form, storeName: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-neutral-50"
            placeholder="My Store"
          />
        </div>

        {/* Tax Rate */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-neutral-700">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={form.taxRate}
            onChange={(e) =>
              setForm({ ...form, taxRate: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-neutral-50"
            placeholder="18"
          />
        </div>

        {/* Logo URL */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-neutral-700">
            Store Logo (URL)
          </label>
          <input
            type="text"
            value={form.logo}
            onChange={(e) =>
              setForm({ ...form, logo: e.target.value })
            }
            className="w-full p-3 border rounded-xl bg-neutral-50"
            placeholder="https://..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          disabled={saving}
          onClick={saveSettings}
          className="w-full py-3 bg-[#C9A86A] text-white font-semibold
          rounded-xl shadow-lg hover:bg-[#b8965f] transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Settings
