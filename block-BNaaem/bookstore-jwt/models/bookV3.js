var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title :{type:String,required:true},
    description:{type:String,required:true},
    author:String,
    pages:Number,
    commentId:[{type:Schema.Types.ObjectId,ref:"Comment"}],
    category:[String],
    tags:[String],
    price:Number,
    quantity:Number
},{timestamps:true})

module.exports = mongoose.model("BookV3",bookSchema);