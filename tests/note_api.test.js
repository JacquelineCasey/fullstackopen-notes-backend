
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Note = require('../models/note');


const api = supertest(app); // Being able to import an app is handy. This creates a 'superagent' object.

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
];

// Ensure the database is in the same state before each test.
beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = new Note(initialNotes[0]);
    await noteObject.save();
    noteObject = new Note(initialNotes[1]);
    await noteObject.save();
});


test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/); // Regex
});

test('there are two notes', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(initialNotes.length);
});

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);
    expect(contents).toContain(
        'Browser can execute only Javascript'
    );
});


afterAll(() => {
    mongoose.connection.close(); // Remember to close the connection for terminating programs.
});
