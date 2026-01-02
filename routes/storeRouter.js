const express = require('express');
const storeRouter = express.Router();

const storeController = require('../controller/storeController');

// When host want to access any page with url so it will prevent that
const allowGuestOnly = require('../middleware/allowGuestOnly');

storeRouter.get("/", storeController.getPosts); 
storeRouter.get("/add-post", allowGuestOnly, storeController.getAddPost);
storeRouter.post("/add-post", allowGuestOnly, storeController.postAddPost);
storeRouter.get("/saved", allowGuestOnly, storeController.getSavedPost);
storeRouter.post("/saved", allowGuestOnly, storeController.postSavedPost);
storeRouter.post("/saved/remove/:postId", storeController.postSavedPostRemove)
storeRouter.post("/host/delete-post", storeController.postHostDeletePost)

exports.storeRouter = storeRouter;