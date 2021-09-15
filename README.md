
# Backend for notes

This project was created by answering the questions of `npm init`.

It can be run using `npm start`, which we had to define ourselves as `node index.js`.

The deployed version of the app can be viewed here: https://fsopen-notes-backend.herokuapp.com/

The github page for the app: https://github.com/jackcasey067/fullstackopen-notes-backend

This README file stores notes that I take as I follow the course. It is very
possible that some are out of date, as the project has changed over time.

## HTTP Server

Using the http module, responses (regardless of stuff after the slash) return 
"Hello World".

## JSON.stringify()

This important method allows us to turn stuff into JSON, which is a good format
to send to the frontend.

It is worth remembering that JSON (Javascript Object Notation) is actually a string.

## Express

Using the http library to implement our backend is possible, but also tedious.
Express is far easier to use. Install with `npm install express`.

Unlike in http, `/whatever` does not implicitely go to `/`.

Handlers for routes receive `request` and `response` parameters. `request` contains
request information. `response` is used to from and send repsonses.

Express figures out what the content type it needs to send is. It also handles
status codes for us.
- `response.send()` with a string argument will send `text/html` content with 200.
- `response.json()` will convert its arg to JSON and send it as `application/json`.

## NPM stuff and package.json

`"express": "^4.17.1"` Means that the version of express must be at least 
4.17.1, but it will never go higher than 4.X.X.

We can update dependencies to the specifications here using `npm update`. We can
reinstall dependencies using `npm install` again.

Due to these rules, when we write libraries, we must ensure that non major version
changes are backwards compatible. (Major.Minor.Patch). Major version changes,
however, are allowed to break older code.

## Node REPL

You can fire up the node REPL for testing stuff with `node`.

## nodemon

Install it as a development dependencty: `npm install --save-dev nodemon`

Nodemon is like webpack, but for the backend. It watches your files, and relaunches
the apps when you make a change. It is not strictly necessary, but it is certaintly 
useful. (Note, we still have to refresh the browser)

Start the application with this: `node_modules/.bin/nodemon index.js`. Add this
as a script called `dev`, so we can launch via `npm run dev`.

# REST
(Representation State Transfer)

In the course, we are not going to philosophize about what is or isn't good REST.
Instead, we are going to concern ourselves with how RESTful API's are understood
in we applications.

Things like notes in our application are called 'resources'. Every resource has
a unique url.

One convention is to combine a resources type with its unique id. So we end up
with `www.example.com/api/notes/10`.

The url for the entire collection of notes is `www.example.com/api/notes`.

We can execute operations of resources, by using a HTTP verb.

| URL      | verb   | functionality                                    | Notes      |
|:---------|:-------|:-------------------------------------------------|:-----------|
| notes/10 | GET    | Fetches one resource                             | Safe       |
| notes    | GET    | Fetches a collection of resources                | Safe       |
| notes    | POST   | Creates a new resource based on request data     |            |
| notes/10 | DELETE | Removes this resource                            | Idempotent |
| notes/10 | PUT    | Replaces the resource with request data          | Idempotent |
| notes/10 | PATCH  | Replaces parts of the resource with request data | Idempotent |

This is roughly what REST calls a 'uniform interface'. It means it is possible
for systems to cooperate.

Again, there is some philosophical disagreement over if this is *really* REST. Who
cares!

A method is safe if it creates no side effects. A method is idempotent if multiple
sends of the same message have the same result. These are only reccomendations, but
RESTful API's follow them.

## Express Route Parameters

`app.get('/api/notes/:id', ...)` defines a route that has a parameter. This will
match requests like `/api/notes/10` and `/api/notes/BLARG`.

The parameter can be accessed like so: `request.params.id`;

Be warned, parameters come in as strings always. They can be converted to a number
using `Number()`.

## 404 

We should ensure that if no resource exists, we respond correctly. Instead of 
sending 200 OK and no data (which may happen by default), we must send 404 Page Not Found 
(and no data).

`response.status(404).end()` sets the status to 404 and sends nothing.

Note: REST API's are intended for progammers, not for users. A 404 error is
fine, we should not try to print out a nice page or anything, because the user
won't see it anyway if the frontend is doing its job right (handling errors in 
their own way).

You can change the error text that appears if you want:
https://stackoverflow.com/questions/14154337/how-to-send-a-custom-http-status-message-in-node-express/36507614#36507614

## Deleting resources

On success, we return 204 No Content (using `status().end()`).

On failure, we either return 204 again or 404. There is no real consensus.

## Postman and REST client

This tool is great for testing out http requests easily (ie, not just GET).

https://www.postman.com/
Also see the app, which may be needed to debug from localhost

Alternatively, use the VSCODE REST Client extension

Make a folder called `requests`. Add files with the `.rest` extension. Type out
the request `GET http://...` and click the text that pops up.

PS: You can put multiple requests in a file wiht `###` seperators!

IntelliJ WebStorm has a similar feature builtin.

Do note that in its current state, all notes are restored when the Express app is relaunched (even by nodemon).

## Parsing received JSON and adding it

Express has a json parser, but you have to tell your app that you want to use it.
`app.use(express.json())`

The data can be found in `request.body`. If the app has been instructed to use
the JSON parser, it automatically parses the data upon receiving it, and stores
it here for us to use as an object.

We prefer to send back the accepted version of the object after we update the 
state. It may be different (ie, have a unique id).

With postman/vscode extension: make sure the content type is properly specified.

It is a good idea to do some level of verification of the sent data (so discard extra
properties, reject empty etc).

Bad sends result in 400 Bad Request.
Note that we do have to return in this case, even after we form the response.

It is best to generate timestamps on the server instead of the browser (can't be
trusted).

## Middleware

Express's JSON-Parser is middleware. They are functions that can be used to handle
the request and response objects. You can use multiple middlewares. They are executed
one by one in the order the were added to the app.

You can write your own middleware. It takes in request, response, and next, and
has to call next() at some point to yield control to the next middleware. See
`requestLogger`.

You should define most middleware before your endpoints, so that they will all
be called before each endpoint. You can define them after endpoints, in which 
case they will only trigger if no route handles the request. (Or maybe only
applying to some routes???)

## CORS

(Cross Origin Resource Sharing). Browsers can only communicate to OTHER servers
in a limited way (ie, fonts, videos, etc).

We use the cors middleware here in order to get around this (allow requests from
other origins (ie localhost:3000, our frontend)).

## Heroku

Use `Procfile` to tell Heroku how to use the app.

The tutorial talks about how to use the Heroku CLI, but I am more comfortable
going through github + the Heroku web client.

## VSCODE Github notes

Remember, commiting is not the same as pushing. Remember to push changes to github
through the (...).

Edit: I configured it so that commit immediately causes a push now.

The main trick was `git remote add origin ...`

## Serving the frontend

The frontend build has been copied over here. We can use middleware to serve it.
`app.use(express.static('build'));`

You can view the frontend during development now! You have to develop it in another
directory though, but we can use it here while developing the backend.

To streamline deployment, we have added some scripts to this project. I made some
modifications to these.

To fully build and deploy: `npm run deploy:full`.

## Adding a database
(https://fullstackopen.com/en/part3/saving_data_to_mongo_db)

We are using the Mongoose Library, which provides a higher level api for working
with the MongoDB database. `npm install mongoose`

We make a practice app in `mongo.js`.
- We have the user pass in the password, which we accept as an argument.
- We modify the URI to `mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/note-app?retryWrites=true` (See note-app instead of myFirstDatabase. This changes which database we send to).
  We delete the old database over the web client.

## Schema

MongoDB is schemeless in and of itself, meaning that a given collection can have
entries with different forms.

Schemes are useful though, so Mongoose provides them at the application level.
We first define a Scheme. Then we assign it to a model `Note` which corresponds
automatically to the collection `notes` (generated by mongoose). We then make a
new Note object, and call `.save()` on it.

Models are "constructor functions" that create Javascript Objects based on parameters.

PS: The connection must be closed so that the program can end.

## Fetching from the database

The model `Note` can be used to find stuff in the database. It has a `find` function
that can do this.

The parameter specifies a search querry: https://docs.mongodb.com/manual/reference/operator/.
We use `{}` to specify that we want all items.
We can instead use `{important: true}` to only get important notes.

## Hooking up the backend to the database

The data in the database isn't quite what the frontend wants (_id instead of id, 
extra __v field we don't want), so we redefine the `toJSON` method of the schema
to make it work correctly (see `index.js`).

PS: Now the we are using the database in code that intends to run indefinitely,
we do not need to close the connection (this would otherwise cause the code to
not stop). ^C or other signals will kill the process as normal (I presume).

`Note` ends up with some handy functions, like `find` and `findById`.

## Organization

In the frontend, we seperated out all of the `axios` code into a file in a services folder.
Here, lets seperate out the `mongoose` code into a file in the `models` folder. 

## Environment variables

React will handle usage of `REACT_APP_***` environment variables for you. If we 
want to use them here (where they CAN store sensitive info, unlike react), we
use the dotenv library.

We could also do this instead, but it is a bit hamfisted:
`MONGODB_URI=address_here npm run dev`.

Make sure to `.gitignore` `.env` files.

PS: Remember to tell Heroku about your new environment variables. We do not add
them to source control.

## A note on testing

Our author argues that it is best to test the backend first all on its own (via
the browser / postman / VSCode REST). Trying the check that it works through
the ui is asking for confusion.

He also argues that it is probably a good idea to add the new feautures one at a
time.
- GET all notes: check backend, check frontend + backend.
- POST: backend, frontend + backend  
- etc...

## Error handling

Use `.catch(error => ...)` blocks to handle situations where promises are rejected.
You can delegate to error handling middleware with `next(error)`. When you call
`next()`, control goes to the next (matching) route or middleware. When you call
`next(error)`, control goes to the next error handling middleware, which express
identifies as middleware that takes four arguments (error, request, result, next).
Have this middleware call `next(error)` on stuff it can't handle, delegating to
the express default error handler. Also, put the middleware at the end so that
`next(error)` in routes can find it.

## Deleting Elemements in the database

Use `[SomeModel].findByIdAndRemove`.

## Toggling the Importance of elements

Use `[SomeModel].findByIdAndUpdate`.
- Note that it sends a javascript object, not a mongoose model object.
- Also pass in the option `{new: true}`. Usually, mongoose passes the old replaced
  object in the callback, but now it will send the newly created object.

## Validation

Let's use Mongoose's validation functionality instead of constantly using our
own.

https://mongoosejs.com/docs/validation.html

See the updated `noteSchema`, which now includes rules on validation.

There are built in validators, but we can also add custom validators if needed.

## Promise chaining

You can chain `.then()`'s together. The return of each inner function becomes the
argument in the next function. We actually already did this in the notesService
file, but it was hidden behind a function layer.

## Remember to set env variables for Heroku

I personally like to use the web client, but the author says you can also use
`heroku config:set ENV_VAR_NAME='value'`

## Linting
`npm install eslint --save-dev`
`node_modules/.bin/eslint --init`
`node_modules/.bin/eslint .` as a script in `package.json`
`build` in `.eslintignore`

## Directory Structure
(https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing)

- Add a folder `utils`, and make sure all logging goes through `utils/logger.js`.
- Simplify `index.js` greatly. It imports the application from `app.js`, and starts the server.
- `utils/config.js` handles environment variables.
- We move route handlers (known as controllers) to `controllers/notes.js`. If we
  add more for different subsets of routes (ie, `persons`), that would get its own file.
  - We actually use a `Router` object this time, instead of assigning routes to the
    whole application. This is exported. This incidentally allows shortening the paths.
    - The Router is middleware that acts like a mini application. They are used to
      define related routes, like those that start with `api/notes`
- Add a file `app.js` that creates the actual app. It then accepts the Router for notes.
  This really just creates the database connection (must be done in one place), and
  setups up middleware (and the Router which is middleware) in the right order.
- `utils/middleware.js` contains all the middleware.

PS: We now use import `http` to run the server instead of Express directly.
https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
Supposedly, there isn't much of a difference.

The final structure looks like this. Control starts at `index.js`:

├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js 
