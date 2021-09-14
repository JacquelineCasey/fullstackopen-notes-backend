
const cors = require('cors');
require('dotenv').config(); // Puts env variables in process.env
const express = require('express'); // Imports may be objects or just functions.
const Note = require('./models/note');


const app = express(); // Create an express application

/* Middleware */
app.use(express.json()); // We will need this json parser later.

/* Express now checks build/ for matching files to serve first. Navigating to
 * the homepage serves index.html, and the entire frontend with it. */
app.use(express.static('build')); 

app.use(cors()); // We want to allow for cross origin resource sharing. ()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body); // From json-parser
    console.log('---');
    next();
};

app.use(requestLogger);
  

// Handle GET requests sent to '/'
app.get('/', (request, response) => {
    response.send('<h1>It seems we could not find the UI...</h1>');
});
  
// Handle GET requests sent to '/api/notes'
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes); // will call JSON.stringify, and then our toJSON method.
    });
});

// Handle GET request sent to '/api/notes/#'
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
});

// Handle DELETE request sent to '/api/notes/#'
app.delete('/api/notes/:id', (request, response) => {
    console.log('This has not yet been changed.');
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});

// Handle POST request sent to `api/notes`
app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'});
    }
  
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });
  
    note.save().then(savedNote => {
        response.json(savedNote);
    });
});

// More middleware, only fires if none of the above routes fire. Ignores next()
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint);

// Fire up the app, now that it has been fully defined.
//const PORT = process.env.PORT || 3001; // Use 3001 only if the env variable PORT is undefined.
// Now dev and prod use PORT (Heroku defines this without really telling us)
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    
    console.log('Test Links: ');
    console.log('http://localhost:3001');
    console.log('http://localhost:3001/api/notes');
    console.log('http://localhost:3001/api/notes/1');
});
