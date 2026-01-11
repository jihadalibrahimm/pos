import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "name")
      .populate("cashier", "name")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { items, discount = 0, tax = 0, paymentMethod, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Invoice must have items" });
    }

    // توليد رقم الفاتورة
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    const invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;

    let subTotal = 0;
    const finalItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const price = product.sellingPrice;
      const total = price * item.qty;
      subTotal += total;

      finalItems.push({
        productId: product._id,
        name: product.name,
        qty: item.qty,
        price,
        total,
      });
    }

    const finalTotal = subTotal - discount + tax;

    // ✅ جلب كاشير حقيقي (مؤقت)
    const cashierUser = await User.findOne({
      role: { $in: ["admin", "cashier"] },
    });

    if (!cashierUser) {
      return res.status(400).json({ message: "No cashier user found" });
    }

    const invoice = await Invoice.create({
      invoiceNumber,
      items: finalItems,
      subTotal,
      discount,
      tax,
      finalTotal,
      paymentMethod,
      customer: customer || null,
      cashier: cashierUser._id,
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
