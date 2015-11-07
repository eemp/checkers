var constants = require('../constants.js');

module.exports = {
    getPlayerFromPiece : function (piece) {
        if(!piece) return 0;
        return (piece % 2 == 0 ? constants.game.turn.P2 : constants.game.turn.P1);
    },
    parseGameFileString : function(str) {
        var lines = str.split(/\r?\n/);
        var board = [];
        var turn;

        for(var k = 0; k < 8; k++){
            board.push(lines[k].trim().split(/\s+/));
        }
        turn = parseInt(lines[8], 10);

        return { board : board, turn : turn };
    },
    // Returns a random integer between min (included) and max (excluded)
    // Using Math.round() will give you a non-uniform distribution!
    getRandomInt : function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    // return the manhattan distance
    distance : function(l1, l2) {
        var dx = l1[0] - l2[0] > 0 ? l1[0] - l2[0] : l2[0] - l1[0];
        var dy = l1[1] - l2[1] > 0 ? l1[1] - l2[1] : l2[1] - l1[1];
        return dx + dy;
    }
}

