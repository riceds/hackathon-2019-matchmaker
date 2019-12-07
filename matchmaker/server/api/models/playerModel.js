'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    playerId: {
        type: String
    },
    displayName: {
        type: String
    },
    activeStreak: {
        type: Number
    },
    highStreak: {
        type: Number
    },
    matchId: {
        type: String
    }
});

module.exports = mongoose.model('Player', PlayerSchema);