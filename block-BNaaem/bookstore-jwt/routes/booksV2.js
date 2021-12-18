var express = require("express")
var router = express.Router();
var Book = require("../models/bookV2");

router.post("/",(req,res)=>{
    console.log(req.body);
    Book.create(req.body,(err,book)=>{
        if(err) return next(err)
        res.json({book});
      })
})

router.put("/:id/edit",(req,res)=>{
    var id = req.params.id
    Book.findByIdAndUpdate(id,req.body,(err,book)=>{
        if(err) return next(err)
        res.status(200).res.json({book});
      })
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