
require('dotenv').config(); // Technically a double import, but the second one does nothing!
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // _id is technically an object.
        delete returnedObject._id; // note the javascript delete keyword.
        delete returnedObject.__v; // frontend does not need to see this implementation detail.
    }
});

module.exports = mongoose.model('Note', noteSchema); // Node module, not ES6 module (soon?)
