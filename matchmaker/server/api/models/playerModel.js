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
        type: Number,
        default: 0
    },
    highStreak: {
        type: Number,
        default: 0
    },
    matchId: {
        type: String
    }
});

module.exports = mongoose.model('Player', PlayerSchema);