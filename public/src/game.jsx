var event_constants = require('./constants.js').socket.events;
var board_constants = require('./constants.js').game.board.occupants;

var Game = module.exports = React.createClass({
    getInitialState : function() {
        return {
            data : null,
            current_turn : 0,
        };
    },
    getLHash : function(x, y) {
        return [x, y].join(',');
    },
    componentDidMount : function() {
        var self = this;
        socket.emit(event_constants.GET_BOARD, this.props.params.id);
        socket.on(event_constants.BOARD_DATA, function(board) {
            self.setState({data : board, highlighted_locs : null});
        });
        socket.on(event_constants.AVAIL_MOVES, function(moves) {
            var hlmoves = {};
            for(var k = 0; k < moves.length; k++) {
                hlmoves[self.getLHash(moves[k]._to[0], moves[k]._to[1])] = moves[k];
            }
            self.setState({highlighted_locs : hlmoves});
        });
    },
    cellClickHandler : function(e) {
        var self = this;
        var x = parseInt(e.target.getAttribute('data-x'), 10);
        var y = parseInt(e.target.getAttribute('data-y'), 10);
        var board = self.state.data;
        var hlmoves = self.state.highlighted_locs;

        var occupant = board ? board[y][x] : null;
        if(occupant == board_constants.EMPTY) occupant = null;

        if(occupant) {
            socket.emit(event_constants.GET_MOVES, { game_id : this.props.params.id, x : x, y : y });
        }
        else if(hlmoves) {
            var move = hlmoves[self.getLHash(x, y)];
            if(move) socket.emit(event_constants.MAKE_MOVE, 
                { game_id : this.props.params.id, move : move });
        }
    },
    render : function() {
        var self = this;
        var current_turn = self.state.current_turn;
        var hlmoves = self.state.highlighted_locs;
        var rows = [];

        for(var r = 0; r < 8; r++) {
            var is_first_sq_dark = (r % 2 == 1);
            var cols = [];
            for(var c = 0; c < 8; c++) {
                var is_dark = (c % 2 == (is_first_sq_dark ? 0 : 1));
                var classes = [ is_dark ? 'dark' : 'light' ];
                var occupant = null;
                var is_highlight = hlmoves ? hlmoves[self.getLHash(c, r)] : false;

                if(is_dark && self.state.data && self.state.data[r][c] != board_constants.EMPTY)
                    occupant = self.state.data[r][c];

                if(occupant) {
                    var player = occupant % 2 == 0 ? 2 : 1;
                    classes.push("piece-" + occupant);
                    classes.push("player-" + player);
                }
                else if(is_highlight) {
                    classes = [ 'move-highlight' ];
                }

                cols.push(
                    <td key={[current_turn, r, c].join('-')}
                        className={classes.join(' ')}
                        data-x={c}
                        data-y={r}
                        onClick={self.cellClickHandler}>
                    </td>
                );
            }
            rows.push(
                <tr key={[current_turn, r].join('-')}>
                    {cols}
                </tr>
            );
        }

        return (
            <div className="game-board-container">
                <table className="game-board">
                    {rows}
                </table>
            </div>
        );
    },
});

