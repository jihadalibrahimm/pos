import React, { useState, useEffect } from "react"
import API from "../api/axios"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "react-toastify"
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiTrash2, FiPlus } from "react-icons/fi"

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [noteData, setNoteData] = useState({ message: "", type: "info" })

  const fetchNotes = async () => {
    try {
      const res = await API.get("/admin/notifications")
      setNotifications(res.data)
    } catch (err) {
      toast.error("Failed to load notifications")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])
const handleMarkSeen = async (id) => {
  try {
    const res = await API.put(`/admin/notifications/${id}`)
    setNotifications((prev) =>
      prev.map((note) =>
        note._id === id
          ? { ...note, seen: true } // نعمل نسخة جديدة مع seen: true
          : note
      )
    )
    toast.success("Marked as seen!")
  } catch (err) {
    toast.error("Failed to mark as seen")
    console.error(err)
  }
}


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return
    try {
      await API.delete(`/admin/notifications/${id}`)
      setNotifications((prev) => prev.filter((note) => note._id !== id))
      toast.success("Notification deleted!")
    } catch (err) {
      toast.error("Failed to delete")
      console.error(err)
    }
  }

  const handleCreate = async () => {
    if (!noteData.message) {
      toast.error("Message cannot be empty")
      return
    }
    try {
      const res = await API.post("/admin/notifications", noteData)
      setNotifications([res.data, ...notifications])
      toast.success("Notification created!")
      setOpenModal(false)
      setNoteData({ message: "", type: "info" })
    } catch (err) {
      toast.error("Failed to create notification")
      console.error(err)
    }
  }

  if (loading)
    return <div className="p-8 text-xl font-semibold animate-pulse">Loading...</div>

  return (
    <div className="p-6 bg-gradient-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer"
        >
          <FiPlus size={18} /> New
        </button>
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {notifications.map((note) => {
            let icon, bgColor
            switch (note.type) {
              case "transaction":
                icon = <FiCheckCircle className="text-green-600" size={22} />
                bgColor = "bg-green-50 border-green-300"
                break
              case "project":
                icon = <FiAlertTriangle className="text-blue-600" size={22} />
                bgColor = "bg-blue-50 border-blue-300"
                break
              default:
                icon = <FiInfo className="text-gray-500" size={22} />
                bgColor = "bg-gray-50 border-gray-300"
            }

            return (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                className={`p-4 rounded-xl border shadow-md flex flex-col justify-between
                ${note.seen ? "bg-gray-100 border-gray-200 opacity-80" : bgColor} 
                transition-colors duration-500`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {icon}
                  <span className={`font-semibold ${note.seen ? "text-gray-500" : "text-gray-800"}`}>
                    {note.type.toUpperCase()} 
                  </span>
                </div>
                <p className={`mb-3 font-semibold ${note.seen ? "text-gray-400" : "text-gray-900"}`}>
                  {note.message}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{note.seen ? "Seen" : "New"}</span>
                  <div className="flex gap-2">
                    {!note.seen && (
                      <button
                        onClick={() => handleMarkSeen(note._id)}
                        className="text-gray-500 hover:text-green-600 transition cursor-pointer"
                      >
                        <FiCheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Modal for creating */}
      {openModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl  shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">Create Notification</h3>
            <input
              type="text"
              placeholder="Message"
              className="w-full border p-2 rounded-md mb-3"
              value={noteData.message}
              onChange={(e) => setNoteData({ ...noteData, message: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded-md mb-4"
              value={noteData.type}
              onChange={(e) => setNoteData({ ...noteData, type: e.target.value })}
            >
              <option value="info">Info</option>
              <option value="transaction">Transaction</option>
              <option value="project">Project</option>
            </select>
            <div className="flex justify-end gap-3 mt-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Notifications
