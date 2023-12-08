const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));
const GHIBLI_APP = "https://ghibliapi.dev/films";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// JsonWebToken
const jwt = require("jsonwebtoken");

async function getFilmFromAPIByName(name) {
  let films = await fetch(GHIBLI_APP);
  films = await films.json();
  return prisma.films.findUnique((film) => film.title.includes(name));
}
const getMovies = async (req, res) => {
  try {
    const { order } = req.query;

    const response = await fetch(GHIBLI_APP);
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


const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let movies = await fetch(GHIBLI_APP);
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



//By Params - you should use a middle dash instead of a space
const getMovieByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const titleFormated = title.split("-").join(" ");
    //console.log(titleFormated);
    const response = await fetch(GHIBLI_APP);
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




module.exports = {
  getMovies,
  getMovieDetails,
  addMovie,
  getMovieByTitle,
};
