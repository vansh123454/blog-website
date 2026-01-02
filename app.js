// Core module

// External Module
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const multer = require('multer');
const DB_PATH = "mongodb+srv://vansh:Vansh%4012345@vansh.itlt5v2.mongodb.net/BlogPlatform?appName=Vansh";

//Local Module 
const {storeRouter} = require('./routes/storeRouter');
const { authRouter } = require('./routes/authRouter');
const { hostRouter } = require('./routes/hostRouter');
const {profileRouter} = require('./routes/profileRouter');
const {likesRouter} = require('./routes/likesRouter');

// view engine for ejs
app.set('view engine', 'ejs'); // imp line for ejs
app.set('views','views'); 


const randomString = (length) => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return result;
};
const storage = multer.diskStorage({ // this is for file extension 
  destination: (req,file,cb) =>{ // where should file store . It tells
    cb(null, './uploads'); 
  },
  filename: (req,file,cb) =>{
    cb(null, randomString(10) + '-' + file.originalname);
  }
});
const fileFilter = (req,file,cb) =>{ // file restriction from backend
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
} 


app.use(express.urlencoded());
app.use(multer(multerOptions).single('image')); // we apply this for image and avatar by changing name of avatar to image so that we are not making individually for image and avatar.
app.use("/uploads",express.static('uploads'));
app.use(express.static('public'));


// session storage
const store = new MongoDBStore({ // use this 'store' in below session 
  uri: DB_PATH,
  collection: 'session'
});
app.use(session({
  secret: "kuch bhi likho",
  resave: false,
  saveUninitialized: true,
  store: store
}));
app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})


// First Router
// This will help to prevent the page rendering without logged in, if he is trying to write url.
app.use((req, res, next) => {
  const publicRoutes = ['/login', '/signup', '/'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
});

// Roters here
app.use(storeRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(likesRouter);
app.use("/host", (req,res,next)=>{ // this line is also important
  if(isLoggedIn == true){
    next();
  }else{
    res.redirect("/login");
  }
});

app.use("/host",hostRouter);


const PORT = 3003;
mongoose.connect(DB_PATH).then(()=>{
  console.log("Connected to MongoDB");
  app.listen(PORT, ()=>{
    console.log(`Server running on PORT http://localhost:${PORT}`);
  });
}).catch((err)=>{
  console.log("Error While connecting To MOngo : ",err);
});

