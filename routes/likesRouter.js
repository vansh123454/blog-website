const express = require('express');

const likesRouter = express.Router();

const likesController = require('../controller/likesController');

likesRouter.post("/likes/:postId", likesController.postLikes);

exports.likesRouter = likesRouter;
