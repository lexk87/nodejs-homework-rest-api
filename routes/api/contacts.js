const express = require('express');

const { getAll, getById, add, deleteById, updateById } = require('../../controllers/contacts');
const { validateBody } = require('../../middlewares');
const { schema } = require('../../schemas/contacts');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', getById);

router.post('/', validateBody(schema), add);

router.delete('/:id', deleteById);

router.put('/:id', validateBody(schema), updateById);

module.exports = router;
