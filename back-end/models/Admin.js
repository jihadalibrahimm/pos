import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{
        type:String,
        enum:["super-admin", "admin"],
        default:"admin",        
    },
},{timestamps:true})

adminSchema.methods.comparePassword = async function (pass) {
    return await bcrypt.compare(pass, this.password)
}

export default mongoose.model("Admin", adminSchema)