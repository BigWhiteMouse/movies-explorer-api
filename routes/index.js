const router = require('express').Router();
const { createUser, login, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { loginValidator, createUserValidator } = require('../middlewares/validator');

router.post('/signup', createUserValidator, createUser);

router.post('/signin', loginValidator, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.get('/signout', signOut);

router.use('*', (req, res, next) => {
  next(new NotFoundError(`Ресурс по адресу ${req.path} не найден`));
});

module.exports = router;
