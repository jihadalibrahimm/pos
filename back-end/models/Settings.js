import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
    storeName:String,
    taxRate:Number,
    logo:String, 
})

export default mongoose.model("Settings", settingsSchema)