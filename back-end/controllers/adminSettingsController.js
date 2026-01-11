import Settings from "../models/Settings.js"

export const getAdminSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne()
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateAdminSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    )
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
