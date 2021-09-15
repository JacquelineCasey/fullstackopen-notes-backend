
const cors = require('cors');
require('dotenv').config(); // Puts env variables in process.env
const express = require('express'); // Imports may be objects or just functions.
const logger = require('./utils/logger');
const Note = require('./models/note');


const app = express(); // Create an express application

/* Middleware */
app.use(express.json()); // We will need this json parser later.

/* Express now checks build/ for matching files to serve first. Navigating to
 * the homepage serves index.html, and the entire frontend with it. */
app.use(express.static('build'));

app.use(cors()); // We want to allow for cross origin resource sharing. ()

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body); // From json-parser
    logger.info('---');
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
app.get('/api/notes/:id', (request, response, next) => { // Accept next as a parameter
    Note.findById(request.params.id)
        .then(note => {
            if (note)
                response.json(note);
            else
                response.status(404).end(); // Not Found
        })
        .catch(error => next(error)); // Delegate to middleware to handle errors.
    /* Calling next() without a parameter ==> move on to the next route / middleware
     * Calling next() with a parameter ==> execution goes to the error handler middleware. */
});

// Handle DELETE request sent to '/api/notes/#'
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        // We could use result (callback param) to determine if something was actually deleted, if necessary.
        .then(() => { // Success = deleting a note that exists AND deleting one that does not.
            response.status(204).end(); // No Content
        })
        .catch(error => next(error));
});

// Handle POST request sent to `api/notes`
app.post('/api/notes', (request, response, next) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'});
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });

    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));
});

// Handle PUT requests sent to api/notes/# (Replacing the note there)
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important,
    };

    Note.findByIdAndUpdate(request.params.id, note, {new: true})
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});


// More middleware, only fires if none of the above routes fire. Ignores next()
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

/* 4 parameters ==> Express knows this is an error handler. */
const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError')
        return response.status(400).send({error: 'malformatted id'});
    else if (error.name === 'ValidationError')
        return response.status(400).send({error: error.message});

    next(error); // Go to default express error handling.
};

// this has to be the last loaded middleware (after routes), otherwise next(error) won't find it.
app.use(errorHandler);


// Fire up the app, now that it has been fully defined.
//const PORT = process.env.PORT || 3001; // Use 3001 only if the env variable PORT is undefined.
// Now dev and prod use PORT (Heroku defines this without really telling us)
const PORT = process.env.PORT;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);

    logger.info('Test Links: ');
    logger.info('http://localhost:3001');
    logger.info('http://localhost:3001/api/notes');
    logger.info('http://localhost:3001/api/notes/1');
});
