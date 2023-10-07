const { Router } = require('express');
const { check } = require('express-validator');
const { login, register, renew } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use(jwtValidator);

router.get('/', getEvents);

router.post(
  '/',
  [
    check('title', 'title is required').notEmpty(),
    check('start', 'start is not valid').custom(isDate),
    check('end', 'end is not valid').custom(isDate),
    fieldValidator,
  ],
  createEvent
);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;
