const io = require('socket.io').listen(7777);

const Users = {};

const Rooms = {};

io.of('/avalon').on('connection', (socket) => {
    Users[socket.id] = {
        socket: socket,
        room: undefined
    };
    socket.on('login_room', (room_id, cb) => {
        if(!Rooms[room_id]) {
            Rooms[room_id] = {
                users: [],
                data: {}
            }
        }
        let room = Rooms[room_id];
        room.users.push(socket.id);
        Users[socket.id].room = room_id;
        room.users.forEach((id) => {
            Users[id].socket.emit('user_count', room.users.length)
        });
        cb({
            user_count: room.users.length
        });
    });
    socket.on('disconnect', () => {
        let socket_id = socket.id;
        let room = Rooms[Users[socket_id].room];
        room.users = room.users.filter((id, index)=>{
            return id !== socket_id;
        });
        room.users.forEach((id) => {
            Users[id].socket.emit('user_count', room.users.length);
        });
        Reflect.deleteProperty(Users, socket_id);
    });
});

console.log(7777)