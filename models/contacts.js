const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, 'contacts.json');

async function writeContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

const listContacts = async () => {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    return parsedContacts;
};

const getContactById = async contactId => {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
};

const removeContact = async contactId => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);

    if (!index) {
        return null;
    }

    const [removedContact] = contacts.splice(index, 1);
    await writeContacts(contacts);

    return removedContact;
};

const addContact = async ({ name, email, phone }) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };

    contacts.push(newContact);
    await writeContacts(contacts);

    return newContact;
};

const updateContact = async (contactId, { name, email, phone }) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);

    if (index === -1) {
        return null;
    }

    contacts[index] = { contactId, name, email, phone };
    await writeContacts(contacts);
    return contacts[index];
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
