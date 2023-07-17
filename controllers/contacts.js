const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

// const getById = async (req, res) => {
//     const { id } = req.params;
//     const result = await getContactById(id);

//     if (!result) {
//         throw new HttpError(404, 'Contact not found');
//     }

//     res.json(result);
// };

const add = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

// const deleteById = async (req, res) => {
//     const { id } = req.params;
//     const result = await removeContact(id);

//     if (!result) {
//         throw new HttpError(404, 'Contact not found');
//     }

//     res.json({ message: 'Delete success!', result });
// };

// const updateById = async (req, res) => {
//     const { id } = req.params;
//     const result = await updateContact(id, req.body);

//     if (!result) {
//         throw new HttpError(404, 'Contact not found');
//     }

//     res.json(result);
// };

module.exports = {
    getAll: ctrlWrapper(getAll),
    // getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    // deleteById: ctrlWrapper(deleteById),
    // updateById: ctrlWrapper(updateById),
};
