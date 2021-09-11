
This project was created by answering the questions of `npm init`.

It can be run using `npm start`, which we had to define ourselves as `node index.js`.

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

| URL      | verb   | functionality                                    |
|:---------|:-------|:-------------------------------------------------|
| notes/10 | GET    | Fetches one resource                             |
| notes    | GET    | Fetches a collection of resources                |
| notes    | POST   | Creates a new resource based on request data     |
| notes/10 | DELETE | Removes this resource                            |
| notes/10 | PUT    | Replaces the resource with request data          |
| notes/10 | PATCH  | Replaces parts of the resource with request data |

This is roughly what REST calls a 'uniform interface'. It means it is possible
for systems to cooperate.

Again, there is some philosophical disagreement over if this is *really* REST. Who
cares!

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

IntelliJ WebStorm has a similar feature builtin.

Do note that in its current state, all notes are restored when the Express app is relaunched (even by nodemon).