const express = require('express');

const profileRouter = express.Router();
const profileController = require('../controller/profileController');


profileRouter.get("/profile", profileController.getUserProfile);
profileRouter.get("/edit-profile", profileController.getEditProfile);
profileRouter.post("/edit-profile", profileController.postEditProfileChanged);
profileRouter.post("/delete-post", profileController.postDeletePost);


exports.profileRouter = profileRouter;