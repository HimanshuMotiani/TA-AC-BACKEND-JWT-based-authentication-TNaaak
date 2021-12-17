var mongoose = require("mongoose");
var bcrypt = require("bcrypt")

var Schema = mongoose.Schema

var userSchema = new Schema({
    name:String,
    email:{type:String,unique:true,required:true},
    password:{type:String,minlength:5,required:true}
})

userSchema.pre("save", async function (next) {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
            return next();
    }
    else {
        next()
}
})

userSchema.methods.verifyPassword = async function(password){
    try{
        var result = await bcrypt.compare(password,this.password);
        return result; 
    }
    catch (error){
        next(error)
    }
}

var User = mongoose.model("User",userSchema)
module.exports = User