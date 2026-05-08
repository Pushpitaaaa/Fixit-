var express = require('express');
var { registerCustomer, registerProvider, login } = require('../controllers/authController');

var router = express.Router();

router.post('/register', registerCustomer);
router.post('/register/provider', registerProvider);
router.post('/login', login);

module.exports = router;
