const express = require('express');
const storeRouter = express.Router();

const storeController = require('../controller/storeController');

storeRouter.get("/", storeController.getPosts); 
storeRouter.get("/add-post", storeController.getAddPost);
storeRouter.post("/add-post", storeController.postAddPost);
storeRouter.get("/saved", storeController.getSavedPost);
storeRouter.post("/saved", storeController.postSavedPost);
storeRouter.post("/saved/remove/:postId", storeController.postSavedPostRemove)
storeRouter.post("/host/delete-post", storeController.postHostDeletePost)

exports.storeRouter = storeRouter;