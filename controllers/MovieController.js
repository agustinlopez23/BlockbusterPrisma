const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));
const GHIBLI_APP = "https://ghibliapi.herokuapp.com/films/";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// JsonWebToken
const jwt = require("jsonwebtoken");

async function getFilmFromAPIByName(name) {
  let films = await fetch("https://ghibliapi.herokuapp.com/films");
  films = await films.json();
  return prisma.films.findUnique((film) => film.title.includes(name));
}
const getMovies = async (req, res) => {
  try {
    const { order } = req.query;

    const response = await fetch("https://ghibliapi.herokuapp.com/films");
    const movies = await response.json();
    if (order === "desc") {
      movies.sort((a, b) => b.release_date - a.release_date);
    } else if (order === "asc") {
      movies.sort((a, b) => a.release_date - b.release_date);
    }

    movies.length > 0
      ? res.status(200).json(movies)
      : res.status(404).json({ errorMessage: "Movies not found" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};
// const getMovies = async (req, res) => {
//   console.log("Movies");
//   let movies = await fetch("https://ghibliapi.herokuapp.com/films");
//   movies = await movies.json();
//   movies = movies.map((movie) => ({
//     id: movie.id,
//     title: movie.title,
//     description: movie.description,
//     director: movie.director,
//     producer: movie.producer,
//     release_date: movie.producer,
//     running_time: movie.running_time,
//     rt_score: movie.rt_score,
//   }));
//   res.status(200).send(movies);
// };

const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let movies = await fetch("https://ghibliapi.herokuapp.com/films");
    movies = await movies.json();
    movies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      director: movie.director,
      producer: movie.producer,
      release_date: movie.producer,
      running_time: movie.running_time,
      rt_score: movie.rt_score,
    }));
    const movie = movies.find((movie) => movie.id === id);
    res.status(200).send(movie);
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};

//Por Body
// const getMovieByTitle = async (req, res) => {
//   const { title } = req.body;
//   console.log(title);

//   const movie = await getFilmFromAPIByName(title);
//   res.status(200).send(movie);
// };

//By Params - you should use a middle dash instead of a space
const getMovieByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const titleFormated = title.split("-").join(" ");
    console.log(titleFormated);
    const response = await fetch("https://ghibliapi.herokuapp.com/films");
    const movies = await response.json();
    const movie = movies.find((movie) => movie.title === titleFormated);
    movie
      ? res.status(200).json(movie)
      : res.status(404).json({ errorMessage: "Movie not found" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal error" });
  }
};

const addMovie = (req, res, next) => {
  const movie = getFilmFromAPIByName(req.body.title);
  const newMovie = {
    code: movie.id,
    title: movie.title,
    stock: 5,
    rentals: 0,
  };
  prisma.movies
    .create(newMovie)
    .then((movie) => res.status(201).send("Movie Stocked"))
    .catch((err) => next(err));
};

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
    const { order } = req.query;
   
    order ? (order = order) : (order = "asc");
    const allFilms = await prisma.favoriteFilms.findMany({
      where: { id_user: parseInt(req.user.id) },
      });
    
    if (order === "desc") {
      return allFilms.sort((a, b) => b.id - a.id);
    } else if (order === "asc") {
     return  allFilms.sort((a, b) => a.id - b.id);
    }

    allFilms.length > 0
      ? res.status(200).json(allFilms)
      : res.status(404).json({ errorMessage: "Movies not found" });

    
  } catch (error) {
    const {name}= error
    console.log(name)
    res.status(500).json({ error: "Error in Data Base" });
  }
};

module.exports = {
  getMovies,
  getMovieDetails,
  addMovie,
    getMovieByTitle,
};
