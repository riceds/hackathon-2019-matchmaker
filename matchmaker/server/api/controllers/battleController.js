'use strict';
var mongoose = require('mongoose'),
Battle = mongoose.model('Battle');

exports.get_battle_status = function(req, res) {
    
};

exports.make_move = function(req, res) {
    
};

// exports.list_current_match = function(req, res) {
//     Connection.find({'player1': req.playerId}, function(err, match) {
//     if (err) {
//         res.send(err);
//     } else {
//         res.json(match);
//     }
//   });
// };

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