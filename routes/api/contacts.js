const express = require('express');

const {
    getAll,
    getById,
    add,
    deleteById,
    updateById,
    updateFavorite,
} = require('../../controllers/contacts');
const { validateBody, isValidId, authenticate } = require('../../middlewares');
const { contactSchemas } = require('../../schemas');

const router = express.Router();

router.get('/', authenticate, getAll);

router.get('/:id', authenticate, isValidId, getById);

router.post('/', authenticate, validateBody(contactSchemas.addSchema), add);

router.delete('/:id', authenticate, isValidId, deleteById);

router.put('/:id', authenticate, isValidId, validateBody(contactSchemas.addSchema), updateById);

router.patch(
    '/:id/favorite',
    authenticate,
    isValidId,
    validateBody(contactSchemas.updateFavoriteSchema),
    updateFavorite
);

module.exports = router;
