
const Note = require('../models/note');
const User = require('../models/user');
const bcrypt = require('bcrypt');

let passwordHash;
const getAndCacheHash = async () => {
    if (!passwordHash)
        passwordHash = await bcrypt.hash('password', 10);

    return passwordHash;
};

// module.exports everywhere seems like a codesmell.
const setupCollections = async () => {
    module.exports.initialUser = new User({
        username: 'noteTaker22',
        name: 'John Doe',
        passwordHash: await getAndCacheHash()
    });

    await module.exports.initialUser.save();

    module.exports.initialNotes = [
        new Note({
            content: 'HTML is easy',
            date: new Date(),
            important: false,
            userId: module.exports.initialUser._id
        }),
        new Note({
            content: 'Browser can execute only Javascript',
            date: new Date(),
            important: true,
            userId: module.exports.initialUser._id
        })
    ];

    await Note.insertMany(module.exports.initialNotes);
};

const nonExistingId = async () => {
    const note = new Note({content: 'willremovethissoon', date: new Date()});
    await note.save();
    await note.remove();

    return note._id.toString();
};

const notesInDb = async () => {
    const notes = await Note.find({});
    return notes.map(note => note.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

const getInitialUserToken = async (api) => {
    const response = await api
        .post('/api/login')
        .send({username: 'noteTaker22', password: 'password'});

    return response.body.token;
};



module.exports = {
    nonExistingId, notesInDb, usersInDb, setupCollections, getInitialUserToken
};
