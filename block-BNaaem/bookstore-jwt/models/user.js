var mongoose = require("mongoose");
var bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema

var userSchema = new Schema({
    name:String,
    email:{type:String,unique:true,required:true},
    password:{type:String,minlength:5,required:true},
    cart:[{type:Schema.Types.ObjectId,ref:"BookV3"}]
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

userSchema.methods.signToken = async function(){
    var payload = {
        userId:this.id,
        email:this.email
    }
    try{
        var token = jwt.sign(payload,"thisisasecret")
        return token;
    }
    catch (error){
        return error;
    }
}
userSchema.methods.userJSON = function(token){
  return{
      name:this.name,
      email:this.email,
      userId:this.id,
      token:token
  }
}

var User = mongoose.model("User",userSchema)
module.exports = User