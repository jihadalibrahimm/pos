import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs"

export const getAllAdmins = async(req,res) => {
    const admins = await Admin.find().select("-password")
    res.json(admins)
}

export const getAdminById = async(req,res) => {
    const admin = await Admin.findById(req.params.id).select("-password")
    res.json(admin)
}

export const updateAdmin = async(req,res) => {
    const data = {...req.body}
    if(data.password){
        data.password = await bcrypt.hash(data.password,10)
    }
    const updated = await Admin.findByIdAndUpdate(req.params.id,data,{new:true}).select("-password")
    res.json(updated)
}

export const deleteAdmin = async(req,res) => {
    await Admin.findByIdAndDelete(req.params.id)
    res.json({message:"Admin deleted"})
}

export const createAdmin = async(req,res) => {
    try {
        const {name, email, password, role} = req.body
        if(!name || !email || !password || !role ){
            return res.status(400).json({message:"ALl fields are required"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const admin = await Admin.create({name, email, password:hashedPassword ,role})
        res.status(201).json({...admin.toObject(), password:undefined})

    } catch (err) {
        res.status(500).json({message:err.message})
    }
}