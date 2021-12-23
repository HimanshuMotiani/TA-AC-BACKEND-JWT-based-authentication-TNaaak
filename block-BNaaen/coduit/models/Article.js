var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title:{ type: String, required: true, unique: true },
    slug: { type: String },
    description:String,
    body:String,
    tagList:[String],
    favorited:[{ type: Schema.Types.ObjectId, ref: "User" }],
    favoritesCount:{type:Number,default:0},
    author:{ type: Schema.Types.ObjectId, ref: "User" },
    comment:[{ type: Schema.Types.ObjectId, ref: "Comment" }]
},{timestamps:true})


module.exports = mongoose.model("Article",articleSchema)
