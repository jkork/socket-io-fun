(function connect() {
    // new socket connection
    let socket = io.connect('http://localhost:3000');

    socket.emit('new_connection');

    // Grab then username elements
    let usernameInput = document.querySelector('#username');
    let usernameBtn = document.querySelector('#usernameBtn');
    let curUsername = document.querySelector('.card-header');

    // Eventlisteners for changing the username
    usernameBtn.addEventListener('click', e => {
        console.log(usernameInput.value);
        socket.emit('change_username', { username: usernameInput.value });
        curUsername.textContent = username.value;
        username.value = '';
    });

    username.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            console.log(usernameInput.value);
            socket.emit('change_username', { username: usernameInput.value });
            curUsername.textContent = username.value;
            username.value = '';
        }
    });

    // Message elements
    let messageInput = document.querySelector('#message')
    let messageBtn = document.querySelector('#messageBtn')
    let messageList = document.querySelector('#message-list')

    // Eventlisteners for sending a message
    messageBtn.addEventListener('click', e => {
        if (messageInput.value !== '') {
            console.log(messageInput.value)
            socket.emit('new_message', { message: messageInput.value });
            messageInput.value = ''
        }
    });

    messageInput.addEventListener('keyup', e => {
        if (e.keyCode === 13 && messageInput.value !== '') {
            console.log(messageInput.value);
            socket.emit('new_message', { message: messageInput.value });
            messageInput.value = '';
        }
    })

    // Receiving a message
    socket.on('receive_message', data => {
        console.log(data)
        let listItem = document.createElement('li')
        listItem.textContent = data.username + ': ' + data.message
        listItem.classList.add('list-group-item')
        messageList.appendChild(listItem)
    });

})();