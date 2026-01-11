import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category, sellingPrice, purchasePrice, stock } = req.body;
    const image = req.file?.filename || null;

    const product = await Product.create({
      name, category, sellingPrice, purchasePrice, stock, image
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, sellingPrice, purchasePrice, stock } = req.body;
    const update = { name, category, sellingPrice, purchasePrice, stock };
    if (req.file) update.image = req.file.filename;

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
