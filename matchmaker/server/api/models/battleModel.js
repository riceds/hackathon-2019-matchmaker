'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BattleSchema = new Schema({
    connectionId: {
        type: String
    },
    player1Move: {
        type: [{
          type: String,
          enum: ['rock', 'paper', 'scissor']
        }]
    },
    player2Move: {
        type: String,
        enum: ['rock', 'paper', 'scissor']
    }
});

module.exports = mongoose.model('Battle', BattleSchema);