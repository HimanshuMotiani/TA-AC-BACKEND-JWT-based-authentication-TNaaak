var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")

var userSchema = new Schema({
    username:{type:String,unique:true, required:true},
    email:{type:String,unique:true, required:true},
    password:{type:String,required:true},
    bio:String,
    image:String,
    followers:[{type:Schema.Types.ObjectId,ref:"User"}],
    following:[{type:Schema.Types.ObjectId,ref:"User"}]
})

userSchema.pre("save",async function(next){
    if(this.password && this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        next();
    }
    else{
        next()
    }
})

userSchema.methods.verifyPassword = async function (password) {
    try {
        var result = await bcrypt.compare(password, this.password);
        return result;
    }
    catch (error) {
        return error
    }
}

userSchema.methods.signToken = async function(){
    var payload = {userId:this.id,  email:this.email}
    try{
        var token =await jwt.sign(payload,"thisisasecret")
        return token;
    }
    catch (error){
        return error;
    } 
}

userSchema.methods.userJSON = function (token) {
    return {
      username: this.username,
      email: this.email,
      token: token,
    };
  };

module.exports = mongoose.model("User",userSchema)
