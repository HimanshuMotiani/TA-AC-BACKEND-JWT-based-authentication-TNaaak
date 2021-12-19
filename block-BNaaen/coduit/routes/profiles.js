var express = require('express');
var router = express.Router();
var User = require("../models/User")
var auth = require("../middlewares/auth");

router.get("/:username",auth.verifyToken,async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOne({ username })
        res.json({
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.following,
            }
        })
    }
    catch (error){
        next(error)
    }
})

router.post("/:username/follow",auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
    try {
        var user = await User.findOne({ username })
        if(!user){
            return res.status(404).json({error:"User not available"})
        }
        var followers =await User.findByIdAndUpdate(user.id,{$push:{
            followers:req.user.userId
        }})
        var currentUser =await User.findByIdAndUpdate(req.user.userId,{$push:{
            following:user.id
        }})
        res.json({
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.following,
            }
        })
    }
    catch (error){
        next(error)
    }
})

router.delete("/:username/follow",auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
    try {
        var userToUnfollow = await User.findOne({ username })
        if(!userToUnfollow){
            return res.status(404).json({error:"User not available"})
        }
        var followers =await User.findByIdAndUpdate(userToUnfollow.id,{$pull:{
            followers:req.user.userId
        }})
        var currentUser =await User.findByIdAndUpdate(req.user.userId,{$pull:{
            following:userToUnfollow.id
        }})
        res.json({
            profile: {
                username: currentUser.username,
                bio: currentUser.bio,
                image: currentUser.image,
                following: currentUser.following,
            }
        })
    }
    catch (error){
        next(error)
    }
})

module.exports = router;