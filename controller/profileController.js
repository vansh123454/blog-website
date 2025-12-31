const Posts = require("../model/posts");
const Profile = require("../model/profile");

exports.getUserProfile = async (req,res,next) =>{
  const userId = req.session.user._id; // in order to get user specific profile post && this will asure that the logged in user's id

  const userProfile = await Profile.findOne({user: userId}) // this is for upper level of profile
  .populate('user');

  // countDocuments, this provided by mongo db to count the objects in that model
  const countPosts = await Posts.countDocuments({user: userId});

  const userPosts = await Posts.find({user: userId})       // this is for profile posts
  .populate('user')
  .sort({ createdAt: -1 });
  res.render("store/profile",{
    pageTitle: "UserProfile",
    currPage: "userProfile",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    userPosts: userPosts,  // this is very imp
    userProfile: userProfile,
    countPosts: countPosts,
  });
}

exports.getEditProfile = async (req,res,next) =>{

  const userId = req.session.user._id;
  const userProfileUpperLevel =await Profile.findOne({user: userId});

  res.render("store/edit-profile",{
    pageTitle: "EditUserProfile",
    currPage: "editUserProfile",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    userProfileUpperLevel: userProfileUpperLevel,
  });
}


// very very imp 
exports.postEditProfileChanged = async (req,res,next) =>{ // db operations ara async
  console.log(req.body);
  const {bio} = req.body; 
  const userId = req.session.user._id;
  const existingProfile = await Profile.findOne({ user: userId });
  
   let image;

  if (req.file) {
    // new image uploaded
    image = req.file.path;
  } else {
    // keep old image
    image = existingProfile.image;
  }

  await Profile.findOneAndUpdate(
    {user: userId},               // find profile
    {image,bio},                // update data
    {new: true, upsert: true}   // create if not exist
  );
  res.redirect("/profile"); 
}


exports.postDeletePost = async (req,res,next) =>{
  // console.log(req.body);
  const postId = req.body.postId;
  console.log(postId);

  const userId = req.session.user._id; // logged in user

  await Posts.deleteOne({ // db operation
    _id: postId,
    user: userId // security: delete only own post
  })
  res.redirect("/profile");
}
