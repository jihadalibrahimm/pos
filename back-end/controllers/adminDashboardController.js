import Admin from "../models/Admin.js"
import Invoice from "../models/Invoice.js"
import Product from "../models/Product.js"

export const getDashboardStats = async (req, res) => {
  try {
    const [totalAdmins, totalProducts, totalInvoices] = await Promise.all([
      Admin.countDocuments(),
      Product.countDocuments(),
      Invoice.countDocuments(),
    ])

    const totalSalesAgg = await Invoice.aggregate([
      { $group: { _id: null, sum: { $sum: "$finalTotal" } } },
    ])

    res.json({
      totalAdmins,
      totalProducts,
      totalInvoices,
      totalSales: totalSalesAgg[0]?.sum || 0,
    })
  } catch (err) {
    console.error("DASHBOARD ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}
