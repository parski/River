'use strict';

module.exports = function(app) {
    const controller = require('./controller');

    app.route('/')
        .post(controller.publish),

    app.route('/:riverId')
        .get(controller.get)
        .put(controller.update)
        .delete(controller.delete);
};
