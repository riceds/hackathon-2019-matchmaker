'use strict';
var mongoose = require('mongoose'),
Match = mongoose.model('Match');

function getMatchById(matchId, completion) {
    Match.findOne( {
        'matchId' : matchId
    }, function(err, match) {
        if (err) {
            console.log('Error finding matched player\'s match.');
        } else {
            completion(match);
        }
    });
}

exports.getMatchById = function (matchId, completion) {
    getMatchById(matchId, completion);
}

exports.updateMatch = function (matchId, match, completion) {
    console.log('updating match: ', matchId);
    Match.updateOne({
        matchId : matchId
    }, {
        fireStyle : match.fireStyle
        , costume : match.costume
        , strength : match.strength
        , hunger : match.hunger
        , happiness : match.happiness
    }, function(err, updatedMatch)  {
        if (err) {
            console.error(err);
            console.log(err);
        } else {
            getMatchById(matchId, completion);
        }
    });
}

exports.insertMatch = function (playerId, match, completion) {
    console.log('inserting match: ' + match);
    var newMatch = new Match();
    var id = playerId + '_' + Math.random().toString(36).substr(2, 9);
    newMatch['matchId'] = id;
    newMatch['fireStyle'] = match.fireStyle;
    newMatch['costume'] = match.costume;
    newMatch['strength'] = match.strength;
    newMatch['hunger'] = match.hunger;
    newMatch['happiness'] = match.happiness;
    newMatch.save(function(err, match) {
      if (err) {
          console.error(err);
          console.log(err);
      } else {
        console.log('inserted match: ', match);
        completion(match);
      }
    });
}