//var app = process.env.COVERAGE ? require('./app-cov') : require('./app');

var app = require('./app');

if (require.main === module) {
    app.start();
}

module.exports = app;