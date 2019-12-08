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
  console.log('getting leaderboard!');
  Player.find({})
    .sort({highStreak: -1})
    .limit(5)
    .exec( 
      function(err, players) {
        var response = {};
        if (err) {
          response.success = true;
          response.errorMessage = err;
        } else {
          console.log('found players! ', players);
          var playerIdsAndScores = [];
  
          players.forEach(player => {
            var playerIdAndScore = {};
            playerIdAndScore['playerId'] = player.playerId;
            playerIdAndScore['playerName'] = player.displayName;
            playerIdAndScore['streak'] = player.highStreak;
            playerIdsAndScores.push(playerIdAndScore);
          });
          response.success = true;
          response.errorMessage = '';
          response.leaders = playerIdsAndScores;
        }
        res.json(response);
      }
    );
};

exports.update_streak = function(req, res) {
    console.log('Updating streak for player with request: ', req.body);
    if (req.body.playerId == null || req.body.playerId === '') {
        returnError(res, 'A playerId needs to be sent in order to log results.');
    } else if (req.body.result == null || req.body.result === '') {
        returnError(res, 'A result needs to be sent in order to log results. Valid values are "win", "lose", or "draw"');
    } else {
      // get the player
      getPlayerById(req.body.playerId, function(player) {
        // if result was a tie, return current streak
        if (req.body.result === 'draw') {
          returnStreak(res, player);
        } else if (req.body.result === 'loss') {
          // if result was a loss, set streak to 0 and return streak
          Player.updateOne({
            playerId : player.playerId
          }, {
            activeStreak : 0
          }, function(err, updatedPlayer)  {
            if (err) {
                console.error(err);
            } else {
              getPlayerById(player.playerId, function(player) {
                returnStreak(res, player);
              });
            }
          });
        } else {
          // if result was a win, check if we should update both active and high score, or just active
          var shouldUpdateHighScore = false;
          var newScore = player.activeStreak + 1;
          if (player.highStreak == null || newScore > player.highStreak) {
            shouldUpdateHighScore = true;
          }
          
          if (shouldUpdateHighScore) {
            // Updating both high streak and active streak
            console.log('updating active and high streaks');
            Player.updateOne({
              playerId : player.playerId
            }, {
              activeStreak : newScore,
              highStreak : newScore
            }, function(err, updatedPlayer)  {
              if (err) {
                  console.error(err);
              } else {
                getPlayerById(player.playerId, function(player) {
                  returnStreak(res, player);
                });
              }
            });
          } else {
            // Updating just active streak
            console.log('updating active streak');
            Player.updateOne({
              playerId : player.playerId
            }, {
              activeStreak : newScore
            }, function(err, updatedPlayer)  {
              if (err) {
                  console.error(err);
              } else {
                getPlayerById(player.playerId, function(player) {
                  returnStreak(res, player);
                });
              }
            });
          }
        }
      });
    }
};

exports.get_streak = function(req, res) {
  console.log('Getting current streak for player with request: ', req.body);
  if (req.body.playerId == null || req.body.playerId === '') {
    returnError(res, 'A playerId needs to be sent in order get current streak.');
  } else {
    getPlayerById(req.body.playerId, function(player) {
      if (player == null) {
        returnError(res, 'That playerId doesn\'t exist!');
      }
      returnStreak(res, player);
    });
  }
};

function returnStreak(res, player) {
  var response = {};
  response.playerId = player.playerId;
  response.streak = player.activeStreak;
  response.success = true;
  response.errorMessage = '';
  res.json(response);
}

function returnError(res, errorMessage) {
  var response = {};
  response.success = false;
  response.errorMessage = errorMessage;
  res.json(response);
}