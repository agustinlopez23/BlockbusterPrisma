const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/MovieController");
const { checkLoggedIn, checkLoggedUser } = require("../middlewares/checks");
const FavoritesController = require("../controllers/FavoritesController")


//GET
router.get("/movies/title/:title", MovieController.getMovieByTitle);
router.get("/movies/favourites", checkLoggedUser, FavoritesController.allFavouritesMovies);
router.get("/movies/:id", MovieController.getMovieDetails);
router.get("/movies", MovieController.getMovies);




//POST
router.post("/movies", checkLoggedIn, MovieController.addMovie);
router.post("/movies/favourites/:code", checkLoggedUser, FavoritesController.addFavourite);
//PUT
//DELETE
//ERROR HANDLER

const moviesRouter = router;
module.exports = moviesRouter;