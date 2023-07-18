const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        next(new HttpError(400, 'Invalid ID format'));
    }

    next();
};

module.exports = isValidId;
