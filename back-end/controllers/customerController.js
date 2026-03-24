import Customer from "../models/Customer.js";
import mongoose from "mongoose";

export const createCustomer = async(req,res) => {
    try {
        const customer = await Customer.create(req.body)
        res.status(201).json(customer)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

export const getCustomers = async(req,res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 })
        res.json(customers)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

export const updateCustomer = async(req,res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid customer id" })
        }

        const update = await Customer.findByIdAndUpdate(id, req.body, {
            new: true,
        })

        if (!update) {
            return res.status(404).json({ message: "Customer not found" })
        }

        res.json(update)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

export const deleteCustomer = async(req,res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid customer id" })
        }

        const deleted = await Customer.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Customer not found" })
        }

        res.json({message:"Customer deleted!"})
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}