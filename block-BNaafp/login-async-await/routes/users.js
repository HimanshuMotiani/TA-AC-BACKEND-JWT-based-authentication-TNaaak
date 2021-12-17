var express = require('express');
var User = require("../models/user")
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send("Welcome");
});


router.post('/register', async function (req, res, next) {
try{
  var user =await User.create(req.body);
  console.log(user);
  res.status(200).json({user})
}
catch (error){
  next(error)
}
});


router.post('/login',async function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({error:"Email/Password required"})
  }
  try{
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({error:"Email not registered"})
    }
    var result = await user.verifyPassword(password);
    if(!result){
      return res.status(400).json({error:"Entered wrong password"})
    }
  }
  catch (error){
    next(error)
  }
});


module.exports = router;