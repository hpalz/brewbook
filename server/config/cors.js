var cors = require('cors');


module.exports = function(app, config) {
    app.use(cors(config.cors));
}