'use strict';
module.exports = function(app) {
    var connectionController = require('../controllers/connectionController');
    var battleController = require('../controllers/battleController');
    var playerController = require('../controllers/playerController');

  app.route('/connect')
    .get(connectionController.get_current_connection);

  app.route('/disconnect')
    .post(connectionController.disconnect);

  app.route('/battle')
    .get(battleController.get_battle_status)
    .post(battleController.make_move);

  app.route('/result')
    .get(playerController.get_streak)
    .post(playerController.update_streak);

  app.route('/leaderboard')
    .get(playerController.get_leaders);

};

