const { procurementAPI } = require('../api')
    , { wrapAsync, auth } = require('../infra')

module.exports = app => {

    app.route('/procurements')
        .get(wrapAsync(procurementAPI.list))
        .post(auth, wrapAsync(procurementAPI.add));
    
    app.route('/procurements/:id')
        .put(auth, wrapAsync(procurementAPI.update))
        .delete(auth, wrapAsync(procurementAPI.remove))
        .get(wrapAsync(procurementAPI.findById));
};