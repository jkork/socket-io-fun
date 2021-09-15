const express = require('express');
const socketio = require('socket.io');
const app = express();

let { users } = require('./users.js');

// View engine (ejs)
app.set('view engine', 'ejs');

// Routing settings
app.set('case sensitive routing', true);
app.set('strict routing', true);

// Path for static assets
app.use(express.static('public'));

// Middleware tests #########################################
// const mw1 = (request, response, next) =>  {
//     console.log('First middleware invoked');
//     console.log('----------');
//     request.requestTime = Date.now();
//     request.str = 'asdsadsadsad';
//     next();
// }

// const mw2 = (request, response, next) => { 
//     console.log('Second middleware invoked');
//     console.log('----------');
//     console.log(`Request time: ${request.requestTime}`);
//     console.log('----------');
//     console.log(request.str);
//     next();
// }

// app.use(mw1);
// app.use(mw2);
// #########################################################

// Default route
app.get('/', (request, response) => {
    response.render('index');
});

// USERS - list of all users
app.get('/users', (request, response) => {
    let title = 'testing testing balls balls';

    response.render('users', { title, users });
});

// USER - get one user by id
app.get('/user/:id', (request, response) => {
    let user = users.find(u => u.id === +request.params.id);

    console.log(user);

    if (user) {
        response.status(200).send(`USER: ${user.name} (${user.id})`)
    } else {
        response.status(404).send('User not found!');
    }
});

// Server port
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Init server socket
const io = socketio(server);

// Listen for new connection
io.on('connection', socket => {

    socket.on('new_connection', () => {
        console.log('New connection');
    });

    socket.username = 'Anonymous';

    socket.on('change_username', data => {
        socket.username = data.username;
    });

    socket.on('new_message', data => {
        console.log('New message');
        io.sockets.emit('receive_message', { username: socket.username, message: data.message });
    });
});