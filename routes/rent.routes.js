const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { checkLoggedUser } = require("../middlewares/checks");
const errorHandler = require("../middlewares/errorHandler");
const RentController = require("../controllers/RentController");

router.use(bodyParser.json());
//GET

router.get('/rent/user', checkLoggedUser, RentController.rentsByUser)
router.get('/rent/all', RentController.getAllRents)
//POST
router.post("/rent/:code", checkLoggedUser, RentController.rentMovie);
//PUT
router.put("/rent/:id", checkLoggedUser, RentController.returnRent);
//ERROR HANDLER
router.use(errorHandler.notFound);
const rentRouter = router
module.exports = rentRouter;
