import Notifications from "../models/Notifications.js";

// جلب كل النوتيفيكشنز
export const getNotifications = async (req, res) => {    
  try {
    const notes = await Notifications.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// تعليم Notification كمقروء
export const markSeen = async (req, res) => {
  try {
    const note = await Notifications.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const addNotification = async (req, res) => {
  const { message, cashier } = req.body;
  if (!message || !cashier) return res.status(400).json({ message: "Missing fields" });
  try {
    const newNote = await Notifications.create({ message, cashier });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const deleteNotification = async (req, res) => {
  try {
    await Notifications.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
