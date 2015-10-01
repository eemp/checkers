function Move(details)
{
    this._from = details.from;
    this._to = details.to;
    this._jump = details.jump;
}

module.exports = Move;

Move.prototype.from = function(f) {
    if(f) this._from = f;
    return this._from;
}

Move.prototype.to = function(t) {
    if(t) this._to = t;
    return this._to;
}

Move.prototype.jump = function(j) {
    if(j) this._jump = j;
    return this._jump;
}

