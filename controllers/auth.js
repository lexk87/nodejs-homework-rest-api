const { User } = require('../models/user');
const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, BASE_URL } = process.env;
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const avatarDir = path.join(__dirname, '../', 'public/avatars');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw new HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

    res.status(200).json({
        message: 'Email verification successful',
    });
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError(401, 'Email not found');
    }

    if (user.verify) {
        throw new HttpError(400, 'Verification has already been passed');
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify your email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: 'Verification email sent',
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError(401, 'Invalid email or password!');
    }

    if (!user.verify) {
        throw new HttpError(401, 'Email not verified');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw new HttpError(401, 'Invalid email or password!');
    }

    const payload = {
        id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
    });
};

const getCurrent = async (req, res) => {
    const { email, name } = req.user;

    res.status(200).json({
        email,
        name,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json({
        message: 'Logout success',
    });
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;

    Jimp.read(tempUpload, (err, image) => {
        if (err) throw err;
        image.resize(250, 250).quality(75).write(`./public/avatars/${filename}`);
    });

    const resultUpload = path.join(avatarDir, filename);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
};

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};
