const express = require('express');

const profileRouter = express.Router();
const profileController = require('../controller/profileController');

// When host want to access any page with url so it will prevent that
const allowGuestOnly = require('../middleware/allowGuestOnly');


profileRouter.get("/profile", allowGuestOnly, profileController.getUserProfile);
profileRouter.get("/edit-profile", allowGuestOnly, profileController.getEditProfile);
profileRouter.post("/edit-profile", allowGuestOnly, profileController.postEditProfileChanged);
profileRouter.post("/delete-post", profileController.postDeletePost);


exports.profileRouter = profileRouter;