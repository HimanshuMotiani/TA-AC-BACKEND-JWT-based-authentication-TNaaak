var express = require("express")
var router = express.Router()
var Comment = require("../models/comment")

router.get('/:id', async (req, res, next) => {
        const bookId = req.params.id;
        Comment.find({bookId:bookId},(err,comment)=>{
            res.status(200).json(comments);
        });
})

router.get("/:id/edit",(req,res)=>{
    var id = req.params.id
    Comment.findByIdAndUpdate(id,req.body,(err,comment)=>{
        if(err) return next(err)
        res.status(200).res.json({comment});
      })
})
router.get("/:id/delete",(req,res)=>{
    var id = req.params.id
    Comment.findByIdAndDelete(id,(err,comment)=>{
        Book.findByIdAndUpdate(comment.bookId, {$pull:{"commentId":id}},(err,book)=>{
        if(err) return next(err)
        res.status(200).res.json({book});
      })
    })
})

module.exports = router