import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    brand:{
        type:String,
        required:true
    },
    categoryname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        // required:true
    }
},{collection:'categories'})

export default mongoose.model("category", CategorySchema);