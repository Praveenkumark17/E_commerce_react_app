import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{collection:'brand'})

export default mongoose.model("brand", BrandSchema);