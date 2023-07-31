const express = require('express');

const { register, login, getCurrent, logout, updateAvatar } = require('../../controllers/auth');
const { validateBody, authenticate, upload } = require('../../middlewares');
const { userSchemas } = require('../../schemas');

const router = express.Router();

router.post('/register', validateBody(userSchemas.registerSchema), register);

router.post('/login', validateBody(userSchemas.loginSchema), login);

router.get('/current', authenticate, getCurrent);

router.post('/logout', authenticate, logout);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
