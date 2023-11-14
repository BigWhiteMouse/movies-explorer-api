const router = require('express').Router();
const { getUserMe, updateUser } = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validator');

router.get('/me', getUserMe);

router.patch('/me', updateUserValidator, updateUser);

module.exports = router;