const proxy = require('http-proxy-middleware');
const path = require('path');
const other = require('@metaexplorer-mods/onboarding/src/onboardingEditor.json');

module.exports = function(app) {
  app.use(proxy('/interpreters', { target: 'http://localhost:7000/' }));
  app.get('/static/interpreters.json', function (req, res) {
    res.send(other);
    //res.sendFile(path.join(__dirname + '/static/interpreters.json'));
  });
};