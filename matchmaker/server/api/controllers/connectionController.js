'use strict';
var mongoose = require('mongoose'),
Connection = mongoose.model('Connection');
var matchController = require('../controllers/matchController');
var playerController = require('../controllers/playerController');

exports.get_current_connection = function(req, res) {
    console.log('#################### START ##################');
    console.log('request body: ', req.body);
    // If no player ID is passed, create one
    var playerId = req.body.playerId;
    if (req.body.playerId == null || req.body.playerId === '') {
        playerId = '_' + Math.random().toString(36).substr(2, 9);
    }

    // no matter what, first step is to insert or update the player
    playerController.getPlayerById(playerId, function(player) {
        var continueConnection = function(player) {
            // check the connection table to see if there is an open or pending connection already
            console.log('looking for a connection for player: ', player);
            Connection.findOne( {
                $and: [
                    { $or: [{player1Id: player.playerId}, {player2Id: player.playerId}] },
                    { $or: [{status: 'open'}, {status: 'pending'}] }
                ]
            }, function(err, connection) {
                if (err) {
                    console.log('Error finding open or pending connection with playerId.');
                    console.log(err);
                } else {
                    // if there is an open or pending connection, return the details
                    if (connection != null) {
                        console.log('SENDING RESPONSE: FOUND OPEN OR PENDING CONNECTION');
                        buildResponse(connection, player.playerId, req, res);
                    } else {
                        checkForOpenOrPendingConnection(req, res, player.playerId);
                    }
                }
            });
        }

        if (player != null) {
            playerController.updatePlayer(player, req.body.displayName, continueConnection);
        } else {
            playerController.insertPlayer(playerId, req.body.displayName, continueConnection);
        }
    });
};

exports.disconnect = function(req, res) {
    
};

function checkForOpenOrPendingConnection(req, res, playerId) {
    console.log('looking for a matching open or pending connection');
    // if there is not an open or pending connection, look for another pending connection of the same type
    Connection.updateOne({
        $and: [
            { $and: [{player1Id: { $ne : playerId}}, {player2Id: { $ne : playerId}}] },
            { status : 'pending' },
            { type : req.body.type }
        ]
    }, { 
        player2Id : playerId, status : 'open'
    }, function(err, updatedConnection) {
        // if something was updated, let's query it back and build the response
        if (updatedConnection.nModified > 0) {
            Connection.findOne( {
                $and: [
                    { $and: [{player1Id: { $ne : playerId}}, {player2Id: playerId}] },
                    { status : 'open' },
                    { type : req.body.type }
                ]
            }, function(err, connection) {
                if (err) {
                    console.log('Error finding another pending connection.');
                    console.log(err);
                } else {
                    if (connection != null) {
                        if (err) {
                            console.error(err);
                            console.log(err);
                        } else {
                            console.log('updated connection object: ', connection);
                            console.log('SENDING RESPONSE: FOUND MATCHED CONNECTION');
                            buildResponse(connection, playerId, req, res);
                        }
                    }
                }
            });
        } else {
            // if nothing was updated, we'll just create a new connection
            console.log('no connection to match to, creating a new connection');
            createNewConnection(req, res, playerId);
        }
    });
}

function createNewConnection(req, res, playerId) {
    // if there is not another pending connection of the same type, enter a new connection record with player2 as blank
    var newConnection = new Connection();
    newConnection['player1Id'] = playerId;
    newConnection['player2Id'] = 'None';
    newConnection['type'] = req.body.type;
    newConnection['status'] = 'pending';
    newConnection.save(function(err, connection) {
        console.log('saved connection: ' + connection);
        if (err) {
            console.error(err);
            console.log(err);
        } else {
            console.log('SENDING RESPONSE: CREATING NEW CONNECTION');
            buildResponse(connection, playerId, req, res);
        }
    });
}

function buildResponse(connection, playerId, req, res) {
    console.log('building response!');
    console.log('Connection: ', connection);
    console.log('playerId', playerId);
    
    var response = {};
    var matchedPlayerId;
    if (connection && connection.player1Id !== playerId) {
        matchedPlayerId = connection.player1Id;
    } else {
        matchedPlayerId = connection.player2Id;
    }

    var matchedPlayer;
    var matchedMatch;
    response['playerId'] = playerId;
    response['matchedPlayerId'] = '';
    response['matchedPlayerName'] = '';
    response['matchedMatch'] = '';
    if (matchedPlayerId !== '' && matchedPlayerId !== 'None' && matchedPlayerId != null) {
        // query matched player
        playerController.getPlayerById(matchedPlayerId, function(matchedPlayer) {
            response['playerId'] = playerId;
            response['matchedPlayerId'] = matchedPlayerId;
            if (matchedPlayer != null) {
                response['matchedPlayerName'] = matchedPlayer.displayName;
            }

            // query matched player's match, if they have one
            if (matchedPlayer != null && matchedPlayer.matchId != null && matchedPlayer.matchId !== '') {
                matchController.getMatchById(matchedPlayer.matchId, function(matchedMatch) {
                    response['matchedMatch'] = matchedMatch;
                    res.json(response);
                });
            } else {
                res.json(response);
            }
        });
    } else {
        res.json(response);
    }
} 