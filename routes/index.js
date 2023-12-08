

// mainRouter.js
const loginRouter  = require('./login.routes');
const moviesRouter  = require('./movies.routes');
const rentRouter  = require('./rent.routes');
const registerRouter  = require('./register.routes');

const bodyParser = require("body-parser");
const errorHandler = require("../middlewares/errorHandler");


const express = require("express");
const router = express.Router();
//Midlewares
router.use(bodyParser.json());

// Use the routers
router.get("/", (req,res)=>{
  res.send("Movies Api")
});
router.use(moviesRouter);
router.use(loginRouter);
router.use(registerRouter);
router.use(rentRouter);
//Error handler
router.use(errorHandler.notFound);
module.exports = router;