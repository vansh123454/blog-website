exports.pageNotFound = (req,res,next)=>{
  res.status(404).render('404',{
    pageTitle : '404 ',
    currPage : '404',
    isLoggedIn: req.isLoggedIn,
    user: {},
  });
} 