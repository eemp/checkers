var expect = require('chai').expect;

var utils = require('../lib/utils.js');
var distance = utils.distance;

var l1 = [0, 0];
var l2 = [2, 0];
var l3 = [2, 1];
var l4 = [4, 5];

describe('Utils', function() {
    describe('distance', function() {
        it('should handle same loc', function() {
            expect(distance(l1, l1)).to.equal(0);
            expect(distance(l4, l4)).to.equal(0);
        });

        it('should handle locs in any given order', function() {
            expect(distance(l2, l3)).to.equal(1);
            expect(distance(l3, l2)).to.equal(1);
            expect(distance(l3, l4)).to.equal(6);
            expect(distance(l4, l3)).to.equal(6);
        });
    });
});

