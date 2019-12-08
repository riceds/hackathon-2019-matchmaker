'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
  player1Id: {
    type: String
  },
  player2Id: {
    type: String,
    default: 'None'
  },
  status: {
    type: [{
      type: String,
      enum: ['open', 'close', 'pending']
    }]
  },
  type: {
    type: [{
      type: String,
      enum: ['play', 'battle']
    }]
  }
});

module.exports = mongoose.model('Connection', ConnectionSchema);