// const commentAPI = require('./comment')
//     , photoAPI = require('./photo')
//     , userAPI = require('./user');

// module.exports = { commentAPI, photoAPI, userAPI };
const userAPI = require('./user')
    , paymentAPI = require('./payment');

module.exports = { userAPI, paymentAPI };