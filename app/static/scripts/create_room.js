var socket = io();

function createRoom() {
    socket.emit("createRoom", 1, "Major");
}