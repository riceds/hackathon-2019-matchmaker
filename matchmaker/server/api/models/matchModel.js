'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    matchId: {
        type: String
    },
    fireStyle: {
        type: Number
    },
    costume: {
        type: Number
    },
    strength: {
        type: Number
    },
    hunger: {
        type: Number
    },
    happiness: {
        type: Number
    }
});

module.exports = mongoose.model('Match', MatchSchema);