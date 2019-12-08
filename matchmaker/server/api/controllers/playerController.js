'use strict';
var mongoose = require('mongoose'),
  Player = mongoose.model('Player');

var matchController = require('../controllers/matchController');

function getPlayerById(searchId, completion) {
  console.log('looking for player with ID: ', searchId);
  Player.findOne( { playerId : searchId }, function(err, player) {
    console.log('done querying.');
      if (err) {
          console.log('Error finding matched player.');
          console.log(err);
      } else {
        console.log('returning player: ', player);
        completion(player);
      }
    });
}

exports.getPlayerById = function(searchId, completion) {
  getPlayerById(searchId, completion);
}

exports.updatePlayer = function(player, body, completion) {
  console.log('updating player: ', player);
  matchController.updateMatch(player.matchId, body.match, function(match) {
    Player.updateOne({
      playerId : player.playerId
    }, {
      displayName : body.displayName 
    }, function(err, updatedPlayer)  {
      if (err) {
          console.error(err);
          console.log(err);
      } else {
        getPlayerById(player.playerId, completion);
      }
    });
  });
}

exports.insertPlayer = function(playerId, body, completion) {
  console.log('inserting player: ', playerId, ' body: ', body);

  matchController.insertMatch(playerId, body.match, function(match) {
    var newPlayer = new Player();
    newPlayer['playerId'] = playerId;
    newPlayer['displayName'] = body.displayName;
    newPlayer['matchId'] = match.matchId;
    newPlayer.save(function(err, player) {
      if (err) {
          console.error(err);
          console.log(err);
      } else {
        console.log('inserted player: ', player);
        completion(player);
      }
    });
  });
}

exports.get_leaders = function(req, res) {
    
};

exports.update_streak = function(req, res) {
    
};

exports.get_streak = function(req, res) {
    
};