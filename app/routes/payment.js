const { paymentAPI } = require('../api')
    , { wrapAsync, auth } = require('../infra')

module.exports = app => {

    app.route('/payments')
        .get(wrapAsync(paymentAPI.list))
        .post(auth, wrapAsync(paymentAPI.add));
    
    app.route('/payments/:id')
        .put(auth, wrapAsync(paymentAPI.update))
        .delete(auth, wrapAsync(paymentAPI.remove))
        .get(wrapAsync(paymentAPI.findById));
};