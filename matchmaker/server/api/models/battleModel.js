'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BattleSchema = new Schema({
    connectionId: {
        type: String
    },
    player1Move: {
        type: String
    },
    player2Move: {
        type: String
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model('Battle', BattleSchema);
// player1Move: {
//     type: [{
//       type: String,
//       enum: ['rock', 'paper', 'scissor', '']
//     }]
// },
// player2Move: {
//     type: String,
//     enum: ['rock', 'paper', 'scissor', '']
// },
// status: {
//     type: [{
//       type: String,
//       enum: ['closed', 'pending']
//     }]
// }