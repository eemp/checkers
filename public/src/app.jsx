global.socket = io();
global.React = require('react');
global.Router = require('react-router');
global.Route = Router.Route;
global.RouteHandler = Router.RouteHandler;
global.Link = Router.Link;
global.Navigation = Router.Navigation;

var event_constants = require('./constants.js').socket.events;
var Game = require('./game.jsx');

var App = React.createClass({
    mixins : [Navigation],
    componentDidMount : function() {
        var self = this;

        if(!window.location.hash || window.location.hash.indexOf("games") == -1)
            socket.emit(event_constants.NEW_GAME);
        
        socket.on(event_constants.GAME_ID, function(game_id) {
            self.transitionTo('game', { id : game_id });
        });
    },
    render : function() {
        return (
            <div id="app">
                <RouteHandler/>
            </div>
        );
    },
});

var routes = (
    <Route handler={App}>
        <Route name="game" path="games/:id" handler={Game}/>
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});
