module.exports = {
    moveToString : function(move) {
        return JSON.stringify(move).replace(/"/g, "'");
    },
    boardToString : function(board) {
        var row_strings = [];
        for(var k = 0; k < board.length; k++) {
            var row = board[k];
            for(var l = 0; l < row.length; l++) {
                row[l] = row[l] + "";
            }
            row_strings.push(JSON.stringify(row).replace(/"/g, "'"));
        }
        return row_strings;
        // return JSON.stringify(row_strings, null, 2);
    },
}
