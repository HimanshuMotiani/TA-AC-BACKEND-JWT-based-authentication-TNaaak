var express = require("express")
var router = express.Router();
var Book = require("../models/bookV3");
var auth = require("../middlewares/auth");
var auth = require("../middlewares/auth");
var Comment = require("../models/comment")
var User = require("../models/user")

router.post("/",auth.verifyToken,(req,res)=>{
    Book.create(req.body,(err,book)=>{
        if(err) return next(err)
        res.json({book});
      })
})
router.post("/:id/comments", auth.verifyToken, async (req, res,next) => {
    console.log(req.body);
    var id = req.params.id;
    req.body.bookId = id
    try {
        var comment = await Comment.create(req.body)
        console.log(comment);
        var book = await Book.findByIdAndUpdate(id, { $push: { commentId: comment.id } })
        res.json({ comment });
    }
    catch (error) {
        next(error)
    }
})

router.put("/:id/edit", auth.verifyToken,async (req,res,next)=>{
    var id = req.params.id
    try{
        var book = await Book.findByIdAndUpdate(id,req.body)
        res.json({book});
    }
    catch (error){
        next(error)
    }
})

router.get("/:id/add-cart", auth.verifyToken,async (req,res,next)=>{
console.log(req.user);
    var id = req.params.id
    try{
        var updatedUser = await User.findByIdAndUpdate(req.user.userId, {$push : {cart : id}})
        res.json({updatedUser});
    }
    catch (error){
        next(error)
    }
})
router.get("/:id/remove-cart", auth.verifyToken,async (req,res,next)=>{
    console.log(req.user);
        var id = req.params.id
        try{
            var updatedUser = await User.findByIdAndUpdate(req.user.userId, {$pull : {cart : id}})
            res.json({updatedUser});
        }
        catch (error){
            next(error)
        }
})

router.get('/category', async (req,res,next)=> {
        const allCategories = await Book.distinct("category");
        res.status(200).json({allCategories});
});
router.get('/tags', async (req,res,next)=> {
    const allTags= await Book.distinct("tags");
    res.status(200).json({allTags});
});
router.get('/category/:categoryName', async (req,res,next)=> {
    var categoryName = req.params.categoryName;
    const allBooks = await Book.find({category:categoryName})
    res.status(200).json({allBooks});
});
router.get('/author/:authorName', async (req,res,next)=> {
    var authorName = req.params.authorName;
    const allBooks = await Book.find({author:authorName})
    
    res.status(200).json({allBooks});
});

router.get('/category/count/:categoryName', async (req,res,next)=> {
    var categoryName = req.params.categoryName;
    const allCategories = await Book.count({category:categoryName});
    res.status(200).json({allCategories});
});

module.exports = router