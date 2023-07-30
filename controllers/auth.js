const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const avatarDir = path.join(__dirname, '../', 'public/avatars');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw new HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ name, email, password: hashPassword, avatarURL });

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError(401, 'Invalid email or password!');
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
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};
