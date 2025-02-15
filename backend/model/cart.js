import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    productname:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{collection:'cart'})

export default mongoose.model("cart", CartSchema);