
const mongoose = require('mongoose');


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
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // _id is technically an object.
        delete returnedObject._id; // note the javascript delete keyword.
        delete returnedObject.__v; // frontend does not need to see this implementation detail.
    }
});

module.exports = mongoose.model('Note', noteSchema); // Node module, not ES6 module (soon?)
