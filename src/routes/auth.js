const { Router } = require('express');
const { registerValidator } = require('../utils/validator');
const isAuthMiddleware = require('../middlewares/isAuth');
const currentUserMiddleware = require('../middlewares/currentUser');
const checkRole = require('../middlewares/checkRole');
const { 
    registerController, 
    loginController, 
    logoutController, 
    tokenController 
} = require('../controllers/auth');

const router = Router();

router.post(
    '/register', 
    isAuthMiddleware, 
    currentUserMiddleware, 
    checkRole('AS'), 
    registerValidator, 
    registerController
);
router.post('/login', loginController);
router.post('/token', tokenController);
router.delete('/logout', isAuthMiddleware, logoutController);

module.exports = router;