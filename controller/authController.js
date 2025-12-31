const {check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcript = require('bcryptjs');


exports.getLogin = (req,res,next) =>{
  res.render("auth/login",{
    pageTitle: "Login",
    currPage: "login",
    isLoggedIn: req.isLoggedIn,
    errors: [],
    oldInput:{email:''},
    user: {}
  });
}

exports.postLogin = async (req,res,next) =>{
  console.log(req.body);
  const {email, password} = req.body;
  const user = await User.findOne({email});
  // console.log(user.userType);

  if(!user){
    return res.status(422).render("auth/login",{
      pageTitle: "Login",
      currPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput:{email},
      user: {}
    })
  }


  // bcrypt.compare() function is used for camparing password with db password
  //  bcrypt.compare()  this function is asynchronous it return promise that is why we use await

  const isMatch = await bcript.compare(password, user.password); // password - user ne filhal dala hua password // user.password - DB me user me store hua wala password 

  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currPage: "login",
      isLoggedIn: false,
      errors: ["Invalid email or password"],
      oldInput: { email },
      user: {}
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
}


exports.getSignup = (req,res,next) =>{
  res.render("auth/signup",{
    pageTitle: "Signup",
    currPage: "signup",
    isLoggedIn: req.isLoggedIn,
    errors: [],
    oldInput:{firstName:'',lastName:'',email:'',userType:''},
    user: {}
  });
}

exports.postSignup = [
  //For firstName
  check("firstName")
  .trim()
  .isLength({min:2})
  .withMessage("First Name must contain at least 2 character long")
  .matches(/^[A-Za-z]+$/)
  .withMessage("First Name must contain only alphabet"),
  
  //For lastName
  check("lastName")
  .trim()
  .isLength({min: 2})
  .withMessage("Last Name must contain at least 2 character long")
  .matches(/^[A-Za-z]+$/)
  .withMessage("Last Name must contain only alphabet"),

  //For email
  check("email")
  .isEmail()
  .withMessage("Please enter valid email")
  .normalizeEmail(),

  //For password
  check("password")
  .isLength({min: 8})
  .withMessage("Password must contain at least 8 character")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one upper case")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lower case")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least one number")
  .matches(/[!@#$%^&*()_<>]/)
  .withMessage("Password must contain at least one special character")
  .trim(),
  
  //Confirm Password
  check("confirmPassword")
  .trim()
  .custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error("Password does not match");
    }
    return true;
  }),



  async (req,res,next) =>{
  console.log(req.body);
  const {firstName,lastName,email,password,userType} = req.body;
  console.log(firstName,lastName,email,password,userType);

  // for multer and file 
  console.log(req.file); 
  /////////////////////
  
  const errors = validationResult(req);

  if(!errors.isEmpty()){ // agar error emplty nahi hai = error present hai
    return res.status(422).render("auth/signup",{
      pageTitle: "Signup",
      currPage: "signup",
      isLoggedIn: false,
      errors: errors.array().map(err => err.msg),
      oldInput: {firstName,lastName,email,userType},
      user: {}
    });
  }

  const existingUser = await User.findOne({email});
  // this will show the error when anyone tries to register with same email twice
  if(existingUser){
    return res.status(422).render("auth/signup",{
      pageTitle: "Signup",
      currPage: "signup",
      isLoggedIn: false,
      errors: ["Email already registered"],
      oldInput:{firstName,lastName,email,userType},
      user: {}
    })
  }


  bcript.hash(password, 12).then((hashPassword)=>{
    const user = new User({
    firstName: firstName, //you can write only one time name that is also correct 
    lastName,
    email,
    password: hashPassword,
    userType
  }); 

    user.save().then(()=>{
      res.redirect("/login");
    }).catch((err)=>{
      console.log("Error while storing 'user' in the database :", err);
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currPage: "signup",
        isLoggedIn: false,
        errors: [err.msg],
        oldInput: {firstName,lastName,email,userType},
        user: {}
      });
    })
  })

  // WITHOUT HASHING OR WITHOUT ENCRYPTION PASSWORD
    // const user = new User({
    //   firstName: firstName, //you can write only one time name that is also correct 
    //   lastName,
    //   email,
    //   password,
    //   userType
    // }); 

    // user.save().then(()=>{
    //   res.redirect("/login");
    // }).catch((err)=>{
    //   console.log("Error while storing 'user' in the database :", err);
    //   return res.status(422).render("auth/signup", {
    //     pageTitle: "Signup",
    //     currPage: "signup",
    //     isLoggedIn: false,
    //     errors: [err.msg],
    //     oldInput: {firstName,lastName,email,userType},
    //     user: {}
    //   });
    // })

}]


exports.postLogout = (req,res,next) =>{
  req.session.destroy(()=>{
    res.redirect("/login");
  })
}
