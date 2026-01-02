module.exports = (req,res,next) =>{
  if(!req.session.isLoggedIn){
    return res.redirect('/login');
  }
  if (req.session.user.userType !== 'guest') {

    // host trying to access guest-only page
    // return res.status(403).render('store/403', {
    //   pageTitle: 'Access Denied'
    // });

    // OR: 
    return res.redirect('/');
  }

  next();
}