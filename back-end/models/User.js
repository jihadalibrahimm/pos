import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{
        type:String,
        enum:["admin", "manager", "cashier"],
        default:"cashier",        
    },
},{timestamps:true})

userSchema.methods.comparePassword = async function (pass) {
    return await bcrypt.compare(pass, this.password)
}

export default mongoose.model("User", userSchema)