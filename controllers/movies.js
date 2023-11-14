const { ValidationError } = require('mongoose').Error;
const Movie = require('../models/movie');
const { successStatus, createSuccessStatus } = require('../utils/consts');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id }).populate('owner')
    .then((movies) => res.status(successStatus).send(movies))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(createSuccessStatus).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) next(new BadRequestError('Переданы некорректные данные'));
      else if (err.code === 11000) next(new ConflictError('Такой фильм уже существует'));
      else next(err);
    });
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId)
    .orFail(
      () => new NotFoundError('Фильм не найден'),
    )
    .then((result) => {
      if (req.user._id === String(result.owner)) {
        Movie.findByIdAndDelete(req.params.movieId)
          .then((movie) => res.status(successStatus).send(movie));
      } else next(new ForbiddenError('Пользователь может удалять только свои фильмы'));
    })
    .catch(next);
}

module.exports = {
  getMovies, createMovie, deleteMovie,
};
