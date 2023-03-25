const mongoose = require("mongoose")
const Schema = mongoose.Schema

const noteSchema = new Schema({
    title:{type:String},
    description:{type:String},
    date:{type:String},
    user:{type:String}
},{timestamps:true})

const notemodel = mongoose.model("notes" , noteSchema)

module.exports = notemodel; 