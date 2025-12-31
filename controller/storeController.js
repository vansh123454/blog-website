const Posts = require("../model/posts") ;
const User = require("../model/user");
const Profile = require('../model/profile');

exports.getPosts = async (req,res,next)=>{
  console.log(req.url,req.method);


  if (!req.session.user) { // not logged in
    return res.redirect('/login');
  }

  const userId = req.session.user._id;

  let savedIds = [];

  if(req.session.user){ // this is only for logged in user
    const user = await User.findById(userId);
    savedIds = user.saved.map(id => id.toString()); // user model me jaake saved post ki ids ko save krna savedIds array me taki woh unsave button add kr sake
  }

  Posts.find()
  .sort({ createdAt: -1 })
  .populate('user')//very very very imp if 1 user post then other user can see if other person is logged in
  .then((registeredPosts)=>{
    res.render("store/post-list",{
      pageTitle: "Home",
      currPage: "home",
      registeredPosts: registeredPosts,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      savedIds: savedIds,
    });
  }).catch((err)=>{
    console.log("Error while fetching the posts : ", err);
  });
};

exports.getAddPost = (req,res,next) =>{
  res.render("store/add-post",{
    pageTitle: "AddPost",
    currPage: "addPost",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
}


exports.postAddPost = (req,res,next) =>{ // saving posts into the db
  console.log(req.body);
  const {title, content, tags} = req.body; 

  console.log(req.file);
  const image = req.file.path;

  if(!req.file){
    return res.status(422).send("No image provided");
  } 
  
  const posts = new Posts({
    title, 
    image,
    content, 
    tags,
    user: req.session.user._id 
  });

  posts.save().then(()=>{
    console.log("Post added successully");
  });
  res.redirect("/profile");
}


exports.getSavedPost = async (req,res,next) =>{ 

  console.log(req.url,req.method);

  const userId = req.session.user._id; 

  // only for single populate
  // const user = await User.findById(userId).populate('saved'); 

  //for multiple populate - but each populate should inside of populate then and only then it will word
  const user = await User.findById(userId)
  .populate({
    path: 'saved',  // populate saved posts
    options: { sort: { createdAt: -1 } },
    populate: { // saved and user are connected that is why we are using 'model' word here but use for profile bcoz it is not connect or written in user model
      path: 'user', // populate the user field in each post
      select: 'firstName lastName', // only fetch name fields,
    }
  });

  res.render("store/saved-post",{
    pageTitle: "Saved",
    currPage: "saved",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    savedPosts: user.saved,
  });
}


exports.postSavedPost = async (req,res,next) =>{

  const postId = req.body.postId; // that we give to input in hidden name="postId". This id is postId
  const userId = req.session.user._id; // current user id

  // console.log(postId);
  
  const user = await User.findById(userId); 

  if(!user.saved.includes(postId)){ // Only add the post if it’s NOT already saved
    user.saved.push(postId);
    await user.save();
  }
  res.redirect("/saved");
  
}


exports.postSavedPostRemove = async (req,res,next) =>{
  const postId = req.params.postId;
  const userId = req.session.user._id;
  
  const user = await User.findById(userId);

  if(user.saved.includes(postId)){ // if post is present
    user.saved = user.saved.filter((sav) => sav != postId);
    await user.save();
  }

  res.redirect("/");
}

exports.postHostDeletePost = async (req,res,next) =>{
  // console.log(req.body);
  const postId = req.body.postId;
  console.log(postId);

  const userId = req.session.user._id; // logged in user

  await Posts.deleteOne({ // db operation
    _id: postId,
  })
  res.redirect("/");
}


