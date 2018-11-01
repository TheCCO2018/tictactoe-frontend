var app = require('http').createServer();

var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);
//var sockets = [];
//var rooms = {};
//var i = 0;


var users = {};
var userCount = 0;
var rooms = {};
var roomIndex = 0;
console.log('aaa');

io.on('connection', function (socket) {
    console.log('Kullanıcı Bağlandı.');

    users[socket.id] = {
        socket: socket,
        name: socket.handshake.query.username,
        userId: socket.handshake.query.userId
    };
    userCount++;

    // console.log(users[socket.id].name);

    socket.on('join', function (data) {

        // Create room
        if (userCount % 2 === 1 || userCount === 0) {
            CreateRoom(users[socket.id]);
        } else {
            //Join room
            JoinRoom(users[socket.id])
            rooms[roomIndex - 1].user1.socket.emit('gamestarted', {
                roomId: roomIndex - 1,
                user: 1,
                enemyName: rooms[roomIndex - 1].user2.name
            });
            rooms[roomIndex - 1].user2.socket.emit('gamestarted', {
                roomId: roomIndex - 1,
                user: 2,
                enemyName: rooms[roomIndex - 1].user1.name
            });


            rooms[roomIndex - 1].user1.socket.emit('yourTurn');
        }

    });

    socket.on('pValon', function (data) {
        var roomId = data.roomId;
        rooms[roomId].timeValue = data.progressValue;
        if (data.user === 1) {
            rooms[roomId].user2.socket.emit('pValEm', {
                progressValue: data.progressValue
            });

        } else {
            rooms[roomId].user1.socket.emit('pValEm', {
                progressValue: data.progressValue
            });

        }
    });


    socket.on('action', function (data) {

        var roomId = data.roomId;

        rooms[roomId].game[data.row][data.col] = data.user;
        rooms[roomId].movecount++;


        // console.log(rooms[roomId].movecount);
        if (rooms[roomId].movecount >= 5) {
            WinningControl(data.row, data.col, data.user, rooms[roomId].game, roomId);
        }

        if (data.user === 1) {
            rooms[roomId].user2.socket.emit('yourTurn');
            rooms[roomId].user2.socket.emit('enemyClicked', {
                row: data.row,
                col: data.col
            });
        } else {
            rooms[roomId].user1.socket.emit('yourTurn');
            rooms[roomId].user1.socket.emit('enemyClicked', {
                row: data.row,
                col: data.col
            });
        }

    });




});

function WinningControl(row, col, player, gameArray, roomid) {
    var SumRownCol = 0;
    var winCounterCol = 0;
    var winCounterRow = 0;
    var winCounterDiag = 0;
    var isWin = false;
    // console.log("Kontrole Girildi");

    SumRownCol = parseInt(row) + parseInt(col);
    if (SumRownCol === 3 || SumRownCol === 1) {
        for (var i = 0; i < 3; i++) {
            if (gameArray[i][col] === player) {
                winCounterCol++;
            }
            if (gameArray[row][i] === player) {
                winCounterRow++;
            }
        }

    } else {
        for (var j = 0; j < 3; j++) {
            if (gameArray[j][col] === player) {
                winCounterCol++;
            }
            if (gameArray[row][j] === player) {
                winCounterRow++;
            }
            if (SumRownCol === 0 || SumRownCol === 4) {
                if (gameArray[j][j] == player) {
                    winCounterDiag++;
                }
            } else {
                if (gameArray[j][2 - j] === player) {
                    winCounterDiag++;
                }
            }

        }
    }
    if (winCounterCol === 3 || winCounterRow === 3 || winCounterDiag === 3) {
        rooms[roomid].user2.socket.emit("isFinish", {playerid: player, enemyId: rooms[roomid].user1.userId});
        rooms[roomid].user1.socket.emit("isFinish", {playerid: player, enemyId: rooms[roomid].user2.userId});
    } else {
        if (rooms[roomid].movecount === 9) {
            if (rooms[roomid].timeValue < 50) {
                //Winner(2);
                // console.log("Player 2 Kazandı" + rooms[roomid].timeValue);
                rooms[roomid].user2.socket.emit("isFinish", {playerid: 2, enemyId: rooms[roomid].user1.userId});
                rooms[roomid].user1.socket.emit("isFinish", {playerid: 2, enemyId: rooms[roomid].user2.userId});

            } else {
                // console.log("Player 1 Kazandı" + rooms[roomid].timeValue);
                rooms[roomid].user2.socket.emit("isFinish", {playerid: 1, enemyId: rooms[roomid].user1.userId});
                rooms[roomid].user1.socket.emit("isFinish", {playerid: 1, enemyId: rooms[roomid].user2.userId});
            }

        }
    }

};


function CreateRoom(user) {
    var game = [
                  [0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]
                ];

    rooms[roomIndex] = {
        user1: user,
        user2: null,
        game: game,
        movecount: 0,
        timeValue: 0
    };
}

function JoinRoom(user) {
    rooms[roomIndex++].user2 = user;
}

Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
