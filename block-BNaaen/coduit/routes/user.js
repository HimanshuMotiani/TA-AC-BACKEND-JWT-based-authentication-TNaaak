var express = require('express');
var router = express.Router();
var User = require("../models/User")
var auth = require("../middlewares/auth");
const { NotExtended } = require('http-errors');

router.get('/',auth.verifyToken,async (req,res,next)=>{
    try{
        var user =await User.findById(req.user.userId)
        res.status(200).json({user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            image:user.image,
        }})
    }
    catch (error){
        next(error)
    }
})

//update a user
router.put('/',auth.verifyToken,async (req,res,next)=>{
    try{
        var updatedUser =await User.findByIdAndUpdate(req.user.userId,req.body,{new: true})
        res.status(200).json({updatedUser})
    }
    catch (error){
        next(error)
    }
})

module.exports = router;