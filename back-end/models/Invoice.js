import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema({
    invoiceNumber:{type:Number, required:true, unique:true},
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId, ref:"Product", required:true},
            name:String,
            qty:{type:Number, required:true},
            price:{type:Number, required:true},
            total:{type:Number, required:true},
        },
    ],
    subTotal:{type:Number, required:true},
    discount:{type:Number, default:0},
    tax:{type:Number, default:0},
    finalTotal:{type:Number, required:true},
    paymentMethod:{type:String, enum:['cash', 'card'], default:"cash"},
    cashier:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    customer:{type:mongoose.Schema.Types.ObjectId, ref:"Customer", default:null},
}, {timestamps:true})

export default mongoose.model("Invoice", invoiceSchema)
