const { savingAPI } = require('../api')
    , { wrapAsync, auth } = require('../infra')

module.exports = app => {

    app.route('/savings')
        .get(wrapAsync(savingAPI.list))
        .post(auth, wrapAsync(savingAPI.add));
    
    app.route('/savings/:id')
        .put(auth, wrapAsync(savingAPI.update))
        .delete(auth, wrapAsync(savingAPI.remove))
        .get(wrapAsync(savingAPI.findById));
};