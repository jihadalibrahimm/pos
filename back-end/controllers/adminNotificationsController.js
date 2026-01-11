import AdminNotification from "../models/adminNotification.js"

export const getAdminNotifications = async (req, res) => {
  try {
    const notes = await AdminNotification.find().sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export const markAdminNotificationSeen = async (req, res) => {
  try {
    const note = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true }
    )

    if (!note) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json(note)
  } catch (err) {
    console.error("MARK NOTIFICATION ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export const createAdminNotification = async (req, res) => {
  try {
    const note = await AdminNotification.create(req.body)
    res.status(201).json(note)
  } catch (err) {
    console.error("CREATE NOTIFICATION ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}


export const deleteAdminNotification = async (req, res) => {
  try {
    const note = await AdminNotification.findByIdAndDelete(req.params.id)
    if (!note) return res.status(404).json({ message: "Notification not found" })
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
