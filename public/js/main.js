//Frontend js
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const socket = io();

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop =  chatMessages.scrollHeight;
    //Свойство Element.scrollHeight (только чтение) - измерение высоты контента в элементе, включая содержимое, невидимое из-за прокрутки. Значение scrollHeight  равно минимальному clientHeight, которое потребуется элементу для того, чтобы поместить всё содержимое в видимую область (viewport), не используя вертикальную полосу прокрутки. 
    //Свойство scrollTop считывает или устанавливает количество пикселей, прокрученных от верха элемента. scrollTop измеряет дистанцию от верха элемента до верхней точки видимого контента. Когда контент элемента не создаёт вертикальную прокрутку, его scrollTop равно 0.
});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();//отменяет действие браузера по умолчанию
    //Например: мы хотим перед отправкой формы проверять корректность введённых данных, но после нажатия на кнопку submit форма каждый раз будет отправляться на сервер, даже если там куча ошибок. Такое поведение браузера нам не подходит, поэтому мы научимся его переопределять.

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg);

    //Clear inputs 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    //Метод focus устанавливает фокус на элементе (чаще всего на инпуте). Это значит, что в этом инпуте начнет моргать курсор и вводимый с клавиатуры текст будет попадать именно в этот инпут.
});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    //appendChild() объекта Node позволяет добавить узел в конец списка дочерних элементов указанного родительского узла
}

//Add roomname to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}