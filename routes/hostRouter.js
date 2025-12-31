const express = require('express');
const hostRouter = express.Router();

const hostController = require("../controller/hostController");

hostRouter.get("/banned-post", hostController.getBannedPost);

exports.hostRouter = hostRouter;