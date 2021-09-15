
const logger = require('./utils/logger');
const mongoose = require('mongoose');


if (process.argv.length < 3) {
    logger.info('Please proved the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jackcasey067:${password}@cluster0.o3umh.mongodb.net/notes-app?retryWrites=true&w=majority`;

mongoose.connect(url);

// Define a schema
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

// Define a model based on the schema
const Note = mongoose.model('Note', noteSchema);

// // Create an instance of the model
// const note = new Note({
//     content: 'Escapee was slain by [REDACTED]',
//     date: new Date(),
//     important: true
// });

// // Send that instance.
// note.save().then(result => {
//     info('note saved!');
//     mongoose.connection.close();
// });

Note.find({important: true}).then(result => {
    result.forEach(note => {
        logger.info(note);
    });
    mongoose.connection.close();
});
