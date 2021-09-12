
const express = require('express'); // Imports may be objects or just functions.
const cors = require('cors');


const app = express(); // Create an express application

/* Middleware */
app.use(express.json()); // We will need this json parser later.

app.use(cors()); // We want to allow for cross origin resource sharing. 

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body); // From json-parser
    console.log('---');
    next();
};

app.use(requestLogger);

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
      id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];
  
/* Define two routes. */

// Handle GET requests sent to '/'
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});
  
// Handle GET requests sent to '/api/notes'
app.get('/api/notes', (request, response) => {
    response.json(notes);
});

// Handle GET request sent to '/api/notes/#'
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(n => n.id === id);

    if (note) { // Check that note is not undefinded.
        response.json(note)
    } else {
        response.status(404).end()
    }
});

// Handle DELETE request sent to '/api/notes/#'
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});

const generateId = () => {
    // Math.max() requires this spread syntax, does not like arrays. 
    // *** This will fail for large arrays *** Use reduce instead.
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id)) 
      : 0;
    return maxId + 1;
}

// Handle POST request sent to `api/notes`
app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({ 
            error: 'content missing'
        });
    }
  
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(), // (*)
        id: generateId(),
    }
  
    notes = notes.concat(note);
  
    response.json(note);
});

// More middleware, only fires if none of the above routes fire. Ignores next()
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint);

// Fire up the app, now that it has been fully defined.
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    
    console.log('Test Links: ');
    console.log('http://localhost:3001');
    console.log('http://localhost:3001/api/notes');
    console.log('http://localhost:3001/api/notes/1');

});
