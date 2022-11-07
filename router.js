const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const MovieController = require("./controllers/MovieController");
const UsersController = require("./controllers/UserController");
const { checkLoggedIn, checkLoggedUser } = require("./middlewares/checks");
const errorHandler = require("./middlewares/errorHandler");
const RentController = require("./controllers/RentController");
const FavoritesController = require("./controllers/FavoritesController")

router.use(bodyParser.json());
//GET
router.get("/movies/:id", MovieController.getMovieDetails);
router.get("/movies", MovieController.getMovies);
router.get("/movies/title/:title", MovieController.getMovieByTitle);
router.get("/favourites", checkLoggedUser, FavoritesController.allFavouritesMovies);
router.get("/logout", checkLoggedUser, UsersController.logout);
router.get("/login", (req, res) => res.send("You must to logued in"));
router.get('/rent/user', checkLoggedUser, RentController.rentsByUser)
router.get('/rents/all', RentController.getAllRents)
//POST
router.post("/favourites/:code",checkLoggedUser, FavoritesController.addFavourite);
router.post("/login", UsersController.login);
router.post("/register", UsersController.register);
router.post("/movie", checkLoggedIn, MovieController.addMovie);
router.post("/rent/:code", checkLoggedUser, RentController.rentMovie);
//PUT
router.put("/rent/:id",checkLoggedUser, RentController.returnRent);
//ERROR HANDLER
router.use(errorHandler.notFound);

module.exports = router;
