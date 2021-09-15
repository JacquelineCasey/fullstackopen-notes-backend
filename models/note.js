
require('dotenv').config(); // Technically a double import, but the second one does nothing!
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const url = process.env.MONGODB_URI;

logger.info('connecting to', url);

mongoose.connect(url)
    .then(() => { // Accepts result
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.info('error connecting to MongoDB:', error.message);
    });

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5, // Does not automatically mean the property is required.
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // _id is technically an object.
        delete returnedObject._id; // note the javascript delete keyword.
        delete returnedObject.__v; // frontend does not need to see this implementation detail.
    }
});

module.exports = mongoose.model('Note', noteSchema); // Node module, not ES6 module (soon?)
