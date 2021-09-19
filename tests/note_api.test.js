
const mongoose = require('mongoose');
const supertest = require('supertest');

const helper = require('./test_helper');
const Note = require('../models/note');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = require('../app'); // Prevents mongoose connection being problematic when we only run other files


const api = supertest(app);

/* https://stackoverflow.com/questions/42186663/nodejs-wait-for-mongodb-connection-to-be-made-before-creating-http-server
 * The first test is not responsible for setting up the connection. Before this,
 * it would sometimes timeout in bad wifi, as it waited for the connection to be
 * formed. Also, this prevents forming a connection even when no tests are used
 * in the file (that connection often would not close). */
beforeAll(async () => {
    await app.connectToDatabase();
});

beforeEach(async () => {
    await Note.deleteMany({});
    await User.deleteMany({});

    await helper.setupCollections();
});


describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes');

        expect(response.body).toHaveLength(helper.initialNotes.length);
    });

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes');

        const contents = response.body.map(r => r.content);

        expect(contents).toContain(
            'Browser can execute only Javascript'
        );
    });
});

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb();

        const noteToView = notesAtStart[0];

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

        expect(resultNote.body).toEqual(processedNoteToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();

        // console.log(validNonexistingId);

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400);
    });
});

describe('addition of a new note', () => {

    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
            userId: helper.initialUser._id
        };

        await api
            .post('/api/notes')
            .set('Authorization', `bearer ${await helper.getInitialUserToken(api)}`)
            .send(newNote)
            .expect(200)
            .expect('Content-Type', /application\/json/);


        const notesAtEnd = await helper.notesInDb();
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

        const contents = notesAtEnd.map(n => n.content);
        expect(contents).toContain(
            'async/await simplifies making async calls'
        );
    });

    test('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true,
            userId: helper.initialUser._id // Crash without this btw...
        };

        await api
            .post('/api/notes')
            .set('Authorization', `bearer ${await helper.getInitialUserToken(api)}`)
            .send(newNote)
            .expect(400);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
    });
});

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToDelete = notesAtStart[0];

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        );

        const contents = notesAtEnd.map(r => r.content);

        expect(contents).not.toContain(noteToDelete.content);
    });
});

// Should this be here?
describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'root', passwordHash});

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});


afterAll(() => {
    mongoose.connection.close();
});
