var express = require('express');
var app = express();
var server = app.listen(3000);
var socket = require('socket.io');
var io = socket(server);
var connections = [];
var players = [];
var b;
let chatMessages=[];

function Player(id, x, y, v, w, h, p) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.v = v;
    this.w = w;
    this.h = h;
    this.p = p;
}

function Ball(id, x, y, xv, yv, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.r = r;
}

app.use(express.static('cliente'));
console.log('running http://localhost:3000');

function getCounter() {
    io.sockets.emit('getCounter', connections.length)
}

function heartBeat() {
    var otherPlayers = players.filter(function (player) {
        return player.id !== socket.id;
    });


    io.sockets.emit('heartBeat', otherPlayers);
}
setInterval(heartBeat, 33);

function heartBeatBall() {
    io.sockets.emit('heartBeatBall', b);
}
setInterval(heartBeatBall, 33);

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    getCounter();

    socket.on('start', function (data) {
        console.log("un usuario se ha conectado: " + data.id + ', num de conexion: ' + connections.length);
        var p = new Player(socket.id, data.x, data.y, data.w, data.h, data.p)
        players.push(p);
    })

    socket.on('startBall', function (data) {
        b = new Ball(socket.id, data.x, data.y, data.xv, data.yv, data.r);
    })

    socket.on('update', function (data) {
        var p1;
        for (var i = 0; i < players.length; i++) {
            if (socket.id === players[i].id)
                p1 = players[i];
        }
        p1.x = data.x;
        p1.y = data.y;
        p1.v = data.v;
        p1.w = data.w;
        p1.h = data.h;
        p1.p = data.p;
    })

    socket.on('updateBall', function (data) {
        b.x = data.x;
        b.y = data.y;
        b.xv = data.xv;
        b.yv = data.yv;
        b.r = data.r;
    })

    socket.on('disconnect', function () {

        for (var i = 0; i < players.length; i++) {
            if (socket.id === players[i].id) {
                players.splice(i, 1);
                break;
            }
        }
        getCounter();
        heartBeat();
    });
});

app.get('/getChatMessages', (req, res) => {
    res.json({ messages: chatMessages });
});

app.post('/sendChatMessage', express.json(), (req, res) => {
    const { message } = req.body;
    if (message.trim() !== '') {
        const chatMessage = { sender: 'Player', text: message };
        chatMessages.push(chatMessage);

        if (chatMessages.length > 10) {
            chatMessages.shift();
        }

        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});


app.get('/getPlayersCount', (req, res) => {
    const jugadoresConectados = connections.length;
    res.json({ count: jugadoresConectados });
});
