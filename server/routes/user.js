const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')

router.get('/', userController.listUsers);

router.get('/:user_id', userController.findUserById);

router.get('/query/fields', userController.findUserByParams);

router.post('/register', userController.createUser);

router.post('/recovery/password_edit', userController.updatePassword);

router.post('/recovery', userController.recoveryPassword);

router.post('/update/:user_id', userController.updateUser);

router.put('/:user_id', userController.updateUser);

router.post('/auth', userController.authenticate);

router.delete('/:user_id', userController.deleteUser); 

module.exports = router;
