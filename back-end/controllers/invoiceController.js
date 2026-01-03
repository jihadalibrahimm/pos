import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

let invoiceCounter = 1000;

export const createInvoice = async (req, res) => {
    try {
        const { items, discount = 0, tax = 0, paymentMethod, customer } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ message: "No items provided" });

        let subTotal = 0;
        const itemsWithDetails = [];


        for (const i of items) {
            const product = await Product.findById(i.productId);
            if (!product)
                return res.status(400).json({ message: "Product not found" });

            if (product.stock < i.qty)
                return res.status(400).json({ message: "Not enough stock" });

            const total = product.sellingPrice * i.qty;
            subTotal += total;

            product.stock -= i.qty;
            await product.save();

            itemsWithDetails.push({
                productId: product._id,
                name: product.name,
                price: product.sellingPrice,
                qty: i.qty,
                total,
            });
        }

        const finalTotal = subTotal - discount + tax;

        const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
        const invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1000;

        const invoice = await Invoice.create({
            invoiceNumber,
            items: itemsWithDetails,
            subTotal,
            discount,
            tax,
            finalTotal,
            paymentMethod,
            cashier: req.user._id,
            customer: customer || null,
        });

        res.status(201).json(invoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const getInvoices = async(req,res) => {
    const invoices = await Invoice.find().populate('cashier','name').populate('customer','name');
    res.json(invoices);
}

export const getInvoiceById = async(req,res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate("cashier", "name")
        .populate("customer", "name");
    if(!invoice) return res.status(404).json({message:"Invoice not found"});
    res.json(invoice);
}