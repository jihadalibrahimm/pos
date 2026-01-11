import { useEffect, useState } from "react"
import API from "../api/axios"
import { motion, AnimatePresence } from "framer-motion"
import { FaTrash, FaUserShield, FaCashRegister } from "react-icons/fa"
import { toast } from "react-toastify"

function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await API.get("/admin/users")
      setUsers(res.data)
    } catch {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const changeRole = async (id, role) => {
    try {
      const res = await API.put(`/admin/users/${id}`, { role })
      setUsers(users.map(u => (u._id === id ? res.data : u)))
      toast.success("Role updated")
    } catch {
      toast.error("Failed to update role")
    }
  }

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return
    try {
      await API.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
      toast.success("User deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())

    const matchRole = roleFilter === "all" || u.role === roleFilter
    return matchSearch && matchRole
  })

  if (loading) {
    return <div className="p-10 text-xl">Loading...</div>
  }

  return (
    <div className="p-6 pt-24 min-h-screen bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9]">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Users Management
      </h1>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-3 rounded-xl border bg-white"
        />

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="p-3 rounded-xl border bg-white cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-indigo-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filteredUsers.map(user => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>

                  {/* Role Tags */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeRole(user._id, "admin")}
                        className={`px-4 py-1 rounded-full text-xs flex items-center gap-1 transition font-semibold
                          ${
                            user.role === "admin"
                              ? "bg-indigo-600 text-white shadow"
                              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          }`}
                      >
                        <FaUserShield /> Admin
                      </button>

                      <button
                        onClick={() => changeRole(user._id, "cashier")}
                        className={`px-4 py-1 rounded-full text-xs flex items-center gap-1 transition font-semibold
                          ${
                            user.role === "cashier"
                              ? "bg-green-600 text-white shadow"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                      >
                        <FaCashRegister /> Cashier
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users