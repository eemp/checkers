var event_constants = require('./constants.js').socket.events;
var board_constants = require('./constants.js').game.board.occupants;

var Game = module.exports = React.createClass({
    getInitialState : function() {
        return {
            data : null,
            current_turn : 0,
        };
    },
    componentDidMount : function() {
        var self = this;
        socket.emit(event_constants.GET_BOARD, this.props.params.id);
        socket.on(event_constants.BOARD_DATA, function(board) {
            console.log(board);
            self.setState({data : board});
        });
    },
    render : function() {
        var self = this;
        var current_turn = self.state.current_turn;
        var rows = [];
        
        for(var r = 0; r < 8; r++) {
            var is_first_sq_dark = (r % 2 == 1);
            var cols = [];
            for(var c = 0; c < 8; c++) {
                var is_dark = (c % 2 == (is_first_sq_dark ? 0 : 1));
                var classes = [ is_dark ? 'dark' : 'light' ];
                var occupant = null;

                if(is_dark && self.state.data && self.state.data[r][c] != board_constants.EMPTY)
                    occupant = self.state.data[r][c];

                if(occupant) {
                    var player = occupant % 2 == 0 ? 2 : 1;
                    classes.push("piece-" + occupant);
                    classes.push("player-" + player);
                }

                cols.push(
                    <td key={[current_turn, r, c].join('-')} className={classes.join(' ')}>
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

