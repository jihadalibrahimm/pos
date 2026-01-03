import mongoose from 'mongoose'

const notificationsSchema = new mongoose.Schema({
    message:String,
    cashier:{type:String , enum:['low_stock', 'invoices', 'info']},
    senn:{type:Boolean, default:false},

}, {timestamps:true})

export default mongoose.model("Notifications", notificationsSchema)