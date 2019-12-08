'use strict';
var mongoose = require('mongoose'),
Battle = mongoose.model('Battle');
var connectionController = require('../controllers/connectionController');

exports.get_battle_status = function(req, res) {
    console.log('Searching for battle status! ', req.body);
    // validate the request
    if (req.body.playerId == null || req.body.playerId === '') {
        returnError(res, 'A playerId needs to be sent in order look for battle status.');
    } else if (req.body.battleId == null || req.body.battleId === '') {
        returnError(res, 'A battleId needs to be sent in order look for battle status.');
    } else {
        // check that player ID for an open battle connection, we also need this to determine playerNumber
        connectionController.getOpenBattleConnectionForPlayerId(req.body.playerId, function(connection) {
            // if we did not get an open battle connection, return an error
            if (connection == null) {
                returnError(res, 'There was no open battle connection for player.');
            } else {
                // we have a valid player with an open battle connection, time to determine which player they are
                var playerNumber = 1;
                if (connection.player2Id === req.body.playerId) {
                    playerNumber = 2;
                }

                // get the battle with the battle id
                getBattleById(req.body.battleId, playerNumber, function (battle, playerNumber) {
                    // if the battle is pending, return a blank opponent move and pending status
                    var response = {};
                    response['status'] = battle.status;
                    if (battle.status === 'pending') {
                        response['opponentMove'] = '';
                    } else {
                        // if the battle is closed, use playerNumber to return the opponents move
                        if (playerNumber === 1) {
                            response['opponentMove'] = battle.player2Move;
                        } else {
                            response['opponentMove'] = battle.player1Move;
                        }
                    }

                    res.json(response);
                });
            }
        });
    }
};

exports.make_move = function(req, res) {
    console.log('Logging a move: ', req.body);
    // ensure that we were passed a player Id
    if (req.body.playerId == null || req.body.playerId === '') {
        returnError(res, 'A playerId needs to be sent in order to make a move.');
    } else if (req.body.move == null || req.body.move === '') {
        returnError(res, 'A move needs to be sent in order to make a move. Valid values are "rock", "paper", or "scissor"');
    } else {
        // check that player ID for an open battle connection
        connectionController.getOpenBattleConnectionForPlayerId(req.body.playerId, function(connection) {
            // if we did not get an open battle connection, return an error
            if (connection == null) {
                returnError(res, 'There was no open battle connection for player.');
            } else {
                // we have a valid player with an open battle connection, time to determine which player they are
                var playerNumber = 1;
                if (connection.player2Id === req.body.playerId) {
                    playerNumber = 2;
                }

                getBattleByConnectionIdAndStatus(connection._id, playerNumber, 'pending', function(battle, playerNumber) {
                    // we should also check if this connection already has a battle going.

                    var returnBattleFunction = function(battle, playerNumber) {
                        var response = {};
                        if (playerNumber == 1) {
                            response.opponentMove = battle.player2Move;
                        } else {
                            response.opponentMove = battle.player1Move;
                        }

                        response.status = battle.status;
                        response.battleId = battle._id;
                        response.success = true;
                        response.errorMessage = '';
                        res.json(response);
                    } 

                    if (battle != null) {
                        console.log('found battle : ', battle);
                        // determine if this player has already logged a move:
                        if (playerNumber == 1 && battle.player1Move !== ''
                            || playerNumber == 2 && battle.player2Move !== '') {
                            
                            returnError(res, 'You have already logged a move!');

                        } else {
                            // update the battle record
                            updateBattle(connection._id, playerNumber, req.body.move, battle._id, returnBattleFunction);
                        }
                    } else {
                        // create a new battle record
                        insertBattle(connection._id, playerNumber, req.body.move, returnBattleFunction);
                    }
                });
            }

        });
    }
};

function getBattleByConnectionIdAndStatus(connectionId, playerNumber, status, completion) {
    console.log('looking for battle with connection id: ' + connectionId);
    Battle.findOne( {
        $and: [
            { connectionId : connectionId },
            { status : status }
        ]
    }, function(err, battle) {
        if (err) {
            console.log('Error finding battle related to current connection.');
            console.log(err);
        } else {
            console.log('returning with battle: ' + battle);
            completion(battle, playerNumber);
        }
    });
}

function getBattleById(battleId, playerNumber, completion) {
    Battle.findOne( {
        _id : battleId
    }, function(err, battle) {
        if (err) {
            console.log('Error finding battle related to current connection.');
            console.log(err);
        } else {
            console.log('returning with battle: ' + battle);
            completion(battle, playerNumber);
        }
    });
}

function updateBattle(connectionId, playerNumber, move, battleId, completion) {
    if (playerNumber == 1) {
        Battle.updateOne({
            $and: [
                { connectionId : connectionId },
                { status : 'pending' }
            ]
          }, {
            player1Move : move,
            status : 'closed'
          }, function(err, updatedBattle)  {
            if (err) {
                console.error(err);
                console.log(err);
            } else {
                getBattleById(battleId, playerNumber, completion);
            }
          });
    } else {
        Battle.updateOne({
            $and: [
                { connectionId : connectionId },
                { status : 'pending' }
            ]
          }, {
            player2Move : move,
            status : 'closed'
        }, function(err, updatedBattle)  {
            if (err) {
                console.error(err);
                console.log(err);
            } else {
                getBattleById(battleId, playerNumber, completion);
            }
        });
    }
}

function insertBattle(connectionId, playerNumber, move, completion) {
    var newBattle = new Battle();
    newBattle['connectionId'] = connectionId;
    if (playerNumber === 1) {
        newBattle['player1Move'] = move;
        newBattle['player2Move'] = '';
    } else {
        newBattle['player1Move'] = '';
        newBattle['player2Move'] = move;
    }
    newBattle['status'] = 'pending';
    newBattle.save(function(err, battle) {
      if (err) {
          console.error(err);
      } else {
        console.log('inserted battle: ', battle);
        completion(battle, playerNumber);
      }
    });
}

function returnError(res, errorMessage) {
    var response = {};
    response.success = 'false';
    response.errorMessage = errorMessage;
    res.json(response);
}

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