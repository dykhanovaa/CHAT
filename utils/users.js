const { use } = require("express/lib/application");

const users = [];

//Join user to chat
function userJoin(id, username, room){
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    //Если не находит возвращает -1

    if(index !== -1){
        return users.splice(index, 1)[0]; //0 обозначает что возвращает не целый массив, а только одного пользователя
        //1 параметр - индекс с которого начинают удалять элементы, а 2 параметр - это количество удаляемых элементов 
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser, 
    userLeave,
    getRoomUsers
};