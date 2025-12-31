const Posts = require('../model/posts');

exports.postLikes = async (req,res,next) =>{
  
  const postId = req.params.postId;
  const userId = req.session.user._id;

  const post = await Posts.findById(postId); // db operation

  //  true → this user has already liked the post.  //false → this user has not liked the post yet
  const isLiked = post.likes.includes(userId);  

  if(isLiked){
    post.likes.pull(userId); // userId is the count. And pull means remove if it is present
  }else{
    post.likes.push(userId);
  }

  await post.save(); // db operation

  res.json({
    liked: !isLiked, // isLiked → previous state . //!isLiked → new state . // res.json() → talk to frontend
    likesCount: post.likes.length
  });
}