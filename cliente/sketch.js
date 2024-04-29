var p;
var b;
var socket;
var balls = [];
var lastPos;
var go = false;
var counter = 0;
var players = [];

function setup() {
    socket = io.connect('http://localhost:3000');
    createCanvas(750, 600);

    b = new Ball();

    socket.on('getCounter', function (data) {
        counter = data;
        if (p === undefined) {
            if (counter % 2 === 0)
                p = new Player(0);
            else
                p = new Player(width);
        }
        var data = {
            x: p.x,
            y: p.y,
            v: p.v,
            w: p.w,
            h: p.h,
            p: p.p
        };
        socket.emit('start', data);

        var data = {
            x: b.x,
            y: b.y,
            xv: b.xv,
            yv: b.yv,
            r: b.r
        };
        socket.emit('startBall', data);

        if (counter === 2)
            go = true;
    });

    socket.on('heartBeat', function (data) {
        players = data;
    });

    socket.on('heartBeatBall', function (data) {
        if (data !== null) {
            b.x = data.x;
            b.y = data.y;
            b.xv = data.xv;
            b.yv = data.yv;
            b.r = data.r;
        }
    });
}

function draw() {
    background(65, 194, 108);
    rect(width / 2, 0, 10, 600)
    textSize(48);
    fill(227, 82, 10);
    if (go === true) {
        p.show();
        p.move(b);
        b.show();
        b.move();

        if (b.collision(p) && p.x === 0)
            b.xv = 5;

        if (b.collision(p) && p.x === width)
            b.xv = -5;

        if (b.x < 0)
            throwBall();

        if (b.x > width)
            throwBall();

        for (var i = 0; i < players.length; i++) {
            var id = players[i].id;
            if (id !== socket.id) {
                fill(227, 82, 10);
                rectMode(CENTER);
                rect(players[i].x, players[i].y, players[i].w, players[i].h);
            }
        }
        var data = {
            x: p.x,
            y: p.y,
            v: p.v,
            w: p.w,
            h: p.h,
            p: p.p
        };
        socket.emit('update', data);

        var data = {
            x: b.x,
            y: b.y,
            xv: b.xv,
            yv: b.yv,
            r: b.r
        };
        socket.emit('updateBall', data);
    }
}

function throwBall() {
    b.x = width / 2;
    b.y = height / 2;
}

