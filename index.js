
const express = require('express'); // Imports may be objects or just functions.
const app = express(); // Create an express application


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

// Fire up the app, now that it has been fully defined.
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    
    console.log('Test Links: ');
    console.log('http://localhost:3001');
    console.log('http://localhost:3001/api/notes');
    console.log('http://localhost:3001/api/notes/1');

});
