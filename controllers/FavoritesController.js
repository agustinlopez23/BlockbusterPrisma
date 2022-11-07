const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addFavourite = async (req, res, next) => {
  try {
    const code = req.params.code;
    const { review } = req.body;
    const verifyFavoriteFilm = await prisma.favoriteFilms.findMany({
      where: {
        id_user: req.user.id,
        id_movie: code,
      },
    });
    if (verifyFavoriteFilm.length > 0)
      return res
        .status(400)
        .json({ errorMessage: "Film already added to favorite" });

    prisma.movies.findUnique({ where: { code: code } }).then((film) => {
      if (!film) throw new Error(" Movie dont avalaible ");

      const newFavouriteFilms = {
        id_movie: film.code,
        id_user: req.user.id,
        review: review,
      };

      prisma.favoriteFilms
        .create({ data: newFavouriteFilms })
        .then((newFav) => {
          if (!newFav) throw new Error("FAILED to add favorite movie");

          res.status(201).send("Movie Added to Favorites");
        });
    });
  } catch (error) {
    (error) => next(error);
  }
};

const allFavouritesMovies = async (req, res, next) => {
  try {
    let { order } = req.query;

    let allFilms = await prisma.favoriteFilms.findMany({
      where: { id_user: req.user.id },
    });

    if (order === "desc") {
      allFilms.sort((a, b) => b.id - a.id);
    } else if (order === "asc") {
       allFilms.sort((a, b) => a.id - b.id);
    }

    allFilms.length > 0
      ? res.status(200).json(allFilms)
      : res.status(404).json({ errorMessage: "Movies not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error in Data Base" });
  }
};
module.exports = {
  addFavourite,
  allFavouritesMovies,
};
