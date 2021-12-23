var express = require('express');
var router = express.Router();
var slug = require("slug");
var User = require("../models/User");
var Article = require("../models/Article");
var Comment = require("../models/Comment");
var auth = require("../middlewares/auth");

// create Article
router.post("/", auth.verifyToken, async (req, res, next) => {
    req.body.tagList = req.body.tagList.split(",").map((ele) => ele.trim());
    req.body.author = req.user.userId;
    try {
      req.body.slug = await slug(req.body.title);
      var article = await Article.create(req.body);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  });

//   // get single article
// router.get("/:slug", async (req, res, next) => {
//     console.log(req.params.slug);
//     let slug = req.params.slug;
//     try {
//       let article = await Article.findOne({ slug }).populate("author").exec();
//       return res.send({ article });
//     } catch (error) {
//       next(error);
//     }
//   });
  
  
  // get all articles
  router.get('/', auth.verifyToken,async (req,res,next)=> {
    var query = req.query.tagList? req.query.tagList : req.query.author? req.query.author : req.query.favorited? req.query.favorited:null;
    var limit = req.query.limit? req.query.limit : 20;
    var offset = req.query.offset? req.query.offset : 0;
    try {
        if('tag' in req.query){
            var articles = await Article.find({taglist : query}).populate('author').limit(limit).skip(offset).sort({"createdAt" : -1});
            articles = await Promise.all(articles.map(async (article) =>  article));
            return res.json({  articles , articlesCount : articles.length});
        }else if('author' in req.query){
          console.log("bb");
            const author = await User.findOne({username : query});
            var articles = await Article.find({author : author.id}).populate('author').limit(limit).skip(offset).sort({"createdAt" : -1});
            articles = await Promise.all(articles.map(async (article) =>  article));
            return res.json({  articles , articlesCount : articles.length});
        } else if('favorited' in req.query){
          console.log("cc");
            const user = await User.findOne({username : query});
            var articles = await Article.find({liked : user.id}).populate('author').limit(limit).skip(offset).sort({"createdAt" : -1});
            articles = await Promise.all(articles.map(async (article) =>  article));
            return res.json({  articles , articlesCount : articles.length});

        } else{
          console.log("dd");
            var articles = await Article.find({}).populate('author').limit(limit).skip(offset).sort({"createdAt": -1});
            articles = await Promise.all(articles.map(async (article) =>  article));
            return res.json({  articles , articlesCount : articles.length});

        }

        
        
    } catch (error) {
        next(error);
    }
});

// feed articles
router.get('/feed',auth.verifyToken, async (req,res,next)=> {
  const limit = req.query.limits? req.query.limit : 20;
  const offset = req.query.offset? req.query.offset :0;
  try {
    console.log(req.user);
      let followings = await User.findById(req.user.userId).distinct('following');
      console.log(followings);
      let feeds = await Article.find({author : {$in : followings}}).populate('author').limit(limit).skip(offset).sort({"createdAt": -1});
      feeds = await Promise.all(feeds.map(async (feed) =>  feed));
      return res.json({  articles : feeds, articlesCount : feeds.length});

  } catch (error) {
      next(error);
  }
});

router.post('/:slug/comments', auth.verifyToken,async (req,res,next)=> {
  const slug = req.params.slug;
  req.body.author = req.user.userId;
  try {
      const article = await Article.findOne({slug});
      console.log(article);
      req.body.article = article.id;
      const comment = await Comment.create(req.body);
      console.log(comment);
      return res.json({comment});
  } catch (error) {
      
  }
})

// get comments 
router.get('/:slug/comments', auth.verifyToken,async (req,res,next)=> {
  const slug = req.params.slug;
  try {
      const article = await Article.findOne({slug});
      let comments = await Comment.find({"article" : article.id}).populate('author');
      comments = await Promise.all(comments.map(async (comment) =>  comment));
      return res.json({comments});
      

  } catch (error) {
      next(error);
  }
})

module.exports = router;
