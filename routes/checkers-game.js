function HelloWorld()
{
    this.prop1 = 'hello';
    this.prop2 = 'world';
}

module.exports = HelloWorld;

HelloWorld.prototype.handler = function(req, res) {
    var self = this;
    res.send([self.prop1, self.prop2].join(' ') + '!');
}

