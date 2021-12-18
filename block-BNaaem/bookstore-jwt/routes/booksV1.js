var express = require("express")
var router = express.Router();
var Book = require("../models/bookV1")

//list
router.get("/",(req,res,next)=>{
 Book.find({},(err,books)=>{
   if(err) return next(err)
   res.send("books");
 })
})

router.get("/new",(req,res,next)=>{
      res.json({message:"bookInfo"});
})

//get single book
router.get("/:id",(req,res)=>{
    var id = req.params.id
    Book.findById(id,(err,book)=>{
        if(err) return next(err)
        res.status(200).res.json({book});
      })
})

//add book
router.post("/",(req,res)=>{
    Book.create(req.body,(err,book)=>{
        if(err) return next(err)
        res.status(200).res.json({book});
      })
})

//update book
router.get("/:id/edit",(req,res)=>{
    var id = req.params.id
    Book.findByIdAndUpdate(id,req.body,(err,book)=>{
        if(err) return next(err)
        res.status(200).res.json({book});
      })
})

//delete book
router.get("/:id/delete",(req,res)=>{
    var id = req.params.id
    Book.findByIdAndDelete(id,(err,book)=>{
        Comment.deleteMany({bookId:id},(err,comment)=>{
            if(err) return next(err)
            res.status(200).res.json({book}); 
        });
        
      })
})

router.post("/:id/comments",(req,res)=>{
    var id = req.params.id;
    req.body.bookId = id
    Comment.create(req.body,(err,comment)=>{
        Book.findByIdAndUpdate(id,{$push:{commentId:comment.id}},(err,book)=>{
            if(err) return next(err)
            res.status(200).res.json({comment});
          })
    })
})


module.exports = router