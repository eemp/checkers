var expect = require('chai').expect;

var Game = require('../lib/game.js');

describe('Game', function() {
    var game = new Game();
    var clone;

    it('should create a clone', function() {
        clone = game.clone();
        expect(clone).to.deep.equal(game);
    });

    it('should be able to modify the clone without modifying the original', function() {
        var orig_val = game.boardObj().get(0,0);
        var new_val = orig_val - 10;

        clone.boardObj().set(0, 0, new_val);
        expect(game.boardObj().get(0,0)).to.not.equal(clone.boardObj().get(0,0));
        expect(clone.boardObj().get(0,0)).to.equal(new_val);
    });
});

