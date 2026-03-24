import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import mongoose from "mongoose";

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
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: "Invalid product id in items" });
      }

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

    if (customer) {
      if (!mongoose.Types.ObjectId.isValid(customer)) {
        return res.status(400).json({ message: "Invalid customer id" });
      }
      const customerExists = await Customer.findById(customer).select("_id");
      if (!customerExists) {
        return res.status(404).json({ message: "Customer not found" });
      }
    }

    const finalTotal = subTotal - discount + tax;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
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
      cashier: req.user._id,
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice id" });
    }

    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
