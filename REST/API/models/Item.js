const db = require('../db');

const itemsCollection = db.collection('items');

const findAll = async () => {
    const snapshot = await itemsCollection.get();
    const items = [];

    snapshot.forEach(doc => {
        items.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return items;
};

const findById = async (id) => {
    const doc = await itemsCollection.doc(id).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
};

const create = async (itemData) => {
    const docRef = await itemsCollection.add(itemData);
    return docRef.id;
};

const update = async (id, updateData) => {
    const docRef = itemsCollection.doc(id);
    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    return {
        id: updatedDoc.id,
        ...updatedDoc.data()
    };
};

const remove = async (id) => {
    const docRef = itemsCollection.doc(id);
    await docRef.delete();
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};