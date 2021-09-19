
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

/* Populate is mongooses attempt at mimicing relational databases join queries.
 * It replaces the ids of the user with the actual notes. (even though the database
 * still holds ids). Mongo does not support join queries, so this is achieved via
 * multiple queries. Mongoose makes no gaurantee that the state of the database
 * is the same between these queries (ie, a note could sneak in somehow, but not
 * get populated). */
usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('notes', {content: 1, date: 1}); // Only show the content, data, (and id) fields.
    response.json(users);
});

usersRouter.post('/', async (request, response) => {
    const body = request.body;

    const saltRounds = 10; // This is left unexplained, but makes the password more secure.
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    });

    const savedUser = await user.save();

    response.json(savedUser); // the toJSON will strip out the password hash.
});


module.exports = usersRouter;
