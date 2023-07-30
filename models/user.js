const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            minLength: 3,
            maxLength: 25,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: [emailRegex, 'Enter a valid email.'],
        },

        password: {
            type: String,
            minLength: 8,
            required: true,
        },

        token: {
            type: String,
            default: '',
        },

        avatarURL: {
            type: String,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = {
    User,
};
