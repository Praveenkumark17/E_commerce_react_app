import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
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
        // required:true
    },
},{collection:'products'})

export default mongoose.model("product", ProductSchema);