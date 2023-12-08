const express = require("express");
const router = express.Router();
const { register } = require("../controllers/RegisterController");

//GET
//POST
router.post("/register", register);
//PUT
//ERROR HANDLER

const registerRouter = router;
module.exports = registerRouter;
