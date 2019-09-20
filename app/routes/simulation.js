const { simulationAPI } = require('../api')
    , { wrapAsync, auth } = require('../infra')

module.exports = app => {

    app.route('/simulations')
        .get(wrapAsync(simulationAPI.list))
        .post(auth, wrapAsync(simulationAPI.add));
    
    app.route('/simulations/:id')
        .put(auth, wrapAsync(simulationAPI.update))
        .delete(auth, wrapAsync(simulationAPI.remove))
        .get(wrapAsync(simulationAPI.findById));
};