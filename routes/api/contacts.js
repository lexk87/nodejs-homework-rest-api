const express = require('express');

const {
    getAll,
    getById,
    add,
    deleteById,
    updateById,
    updateFavorite,
} = require('../../controllers/contacts');
const { validateBody, isValidId } = require('../../middlewares');
const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', isValidId, getById);

router.post('/', validateBody(schemas.addSchema), add);

router.delete('/:id', isValidId, deleteById);

router.put('/:id', isValidId, validateBody(schemas.addSchema), updateById);

router.patch(
    '/:id/favorite',
    isValidId,
    validateBody(schemas.updateFavoriteSchema),
    updateFavorite
);

module.exports = router;
