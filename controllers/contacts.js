const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
} = require('../models/contacts');
const Joi = require('joi');
const { HttpError } = require('../helpers');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

const getAll = async (req, res, next) => {
    try {
        const result = await listContacts();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getContactById(id);

        if (!result) {
            throw HttpError(404, 'Not found!');
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const add = async (req, res, next) => {
    try {
        const { error } = schema.validate(req.body);

        if (error) {
            throw HttpError(400, error.message);
        }

        const result = await addContact(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await removeContact(id);

        if (!result) {
            throw HttpError(404, 'Not found!');
        }

        res.json({ message: 'Delete success!', result });
    } catch (error) {
        next(error);
    }
};

const updateById = async (req, res, next) => {
    try {
        const { error } = schema.validate(req.body);

        if (error) {
            throw HttpError(400, error.message);
        }

        const { id } = req.params;
        const result = await updateContact(id, req.body);

        if (!result) {
            throw HttpError(404, 'Not found!');
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, add, deleteById, updateById };
