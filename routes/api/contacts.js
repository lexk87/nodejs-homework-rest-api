const express = require('express');
const contacts = require('../../models/contacts');
const Joi = require('joi');
const router = express.Router();

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
    res.json({ message: 'template message' });
});

router.get('/:contactId', async (req, res, next) => {
    res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
    res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
    res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
    res.json({ message: 'template message' });
});

module.exports = router;
