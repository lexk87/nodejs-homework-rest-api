const express = require('express');

const {
    register,
    verifyEmail,
    resendVerifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
} = require('../../controllers/auth');
const { validateBody, authenticate, upload } = require('../../middlewares');
const { userSchemas } = require('../../schemas');

const router = express.Router();

router.post('/register', validateBody(userSchemas.registerSchema), register);

router.get('/verify/:verificationToken', verifyEmail);

router.post('/verify', validateBody(userSchemas.emailSchema), resendVerifyEmail);

router.post('/login', validateBody(userSchemas.loginSchema), login);

router.get('/current', authenticate, getCurrent);

router.post('/logout', authenticate, logout);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
