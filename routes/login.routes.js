const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UserController");
const { checkLoggedUser } = require("../middlewares/checks");

//GET

router.get("/login", checkLoggedUser, UsersController.logout);

//POST
router.post("/login", UsersController.login);

//PUT
//ERROR HANDLER

const loginRouter = router;
module.exports = loginRouter;
