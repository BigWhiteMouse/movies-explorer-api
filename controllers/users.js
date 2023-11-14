const { ValidationError } = require('mongoose').Error;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { successStatus, createSuccessStatus } = require('../utils/consts');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUserMe(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      res.status(successStatus).send(user);
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(successStatus).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) next(new BadRequestError('Переданы некорректные данные'));
      else next(err);
    });
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then((user) => res.status(createSuccessStatus).send(user))
        .catch((err) => {
          if (err.code === 11000) next(new ConflictError('Пользователь с таким email уже существует'));
          else if (err instanceof ValidationError) next(new BadRequestError('Переданы некорректные данные'));
          else next(err);
        });
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-token',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ email, id: user._id });
    })
    .catch(next);
}

function signOut(req, res) {
  res.clearCookie('token').send({ message: 'Выход' });
}

module.exports = {
  getUserMe, updateUser, createUser, login, signOut,
};
