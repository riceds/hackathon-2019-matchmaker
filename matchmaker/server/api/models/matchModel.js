'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    matchId: {
        type: String
    },
    playerId: {
        type: String
    },
    FireStyle: {
        type: Number
    },
    Costume: {
        type: Number
    },
    Strength: {
        type: Number
    },
    Hunger: {
        type: Number
    },
    Happiness: {
        type: Number
    }
});

module.exports = mongoose.model('Match', MatchSchema);