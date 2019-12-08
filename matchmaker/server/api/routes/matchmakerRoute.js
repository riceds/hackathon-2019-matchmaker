'use strict';
module.exports = function(app) {
    var connectionController = require('../controllers/connectionController');
    var battleController = require('../controllers/battleController');
    var playerController = require('../controllers/playerController');

  app.route('/connect')
    .post(connectionController.get_current_connection);

  app.route('/disconnect')
    .post(connectionController.disconnect);

  app.route('/battle')
    .post(battleController.make_move);

  app.route('/battleSearch')
    .post(battleController.get_battle_status);

  app.route('/result')
    .post(playerController.update_streak);

  app.route('/resultSearch')
    .post(playerController.get_streak)

  app.route('/leaderboard')
    .get(playerController.get_leaders);

};

