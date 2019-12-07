'use strict';
var mongoose = require('mongoose'),
  Player = mongoose.model('Player');
var matchController = require('../controllers/matchController');

exports.get_leaders = function(req, res) {
    
};

exports.update_streak = function(req, res) {
    
};

exports.get_streak = function(req, res) {
    
};

// exports.find_match = function(req, res) {
//     var foundMatch = false;
//     Connection.findOne({'player2': 'None'}, function(err, match) {
//         foundMatch = true;
//         res.json(match);
//     });

//     if (!foundMatch) {
//         var newConnection = new Connection();
//         newConnection['player1'] = req.playerId;
//         newConnection.save(function(err, match) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.json(match);
//             }
//       });
//     }
// };