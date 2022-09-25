const { Router } = require('express');
const { addTaskController, getTasksByCurrentUserController } = require('../controllers/task');
const { taskValidator } = require('../utils/validator');
const checkRole = require('../middlewares/checkRole');
const router = Router();

router.get('/:id?', checkRole('OASLA'), getTasksByCurrentUserController);
router.post('/', checkRole('onlyManager'), taskValidator, addTaskController);

module.exports = router;