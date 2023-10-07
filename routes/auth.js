const { Router } = require('express');
const { check } = require('express-validator');
const { login, register, renew } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');

const router = Router();

router.post(
  '/',
  [
    check('password', 'password is required').notEmpty(),
    check('email', 'email has wrong format').isEmail(),
    fieldValidator,
  ],
  login
);

router.post(
  '/register',
  [
    check('password', 'password is required').notEmpty(),
    check('name', 'name is required').notEmpty(),
    check('name', 'name should have 5 length').isLength(5),
    check('email', 'email has wrong format').isEmail(),
    fieldValidator,
  ],
  register
);

router.get('/renew', jwtValidator, renew);

module.exports = router;
