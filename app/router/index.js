var express = require('express');
var bodyParser = require('body-parser');

var config = r_require('/config.js');

/* configure express */

var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
	}
};

/* Authentication module */

/*var auth = require('http-auth');
var basicAuth = auth.basic({
    realm: "OfflineNetwork Admin",
    file: __dirname + "/../users.htpasswd" // 
});*/

module.exports = function (app) {

	// serve static content from public directory
    if (config.servePublicDir)
	   app.use(config.baseUrl,express.static('public',options));

    //app.use(config.baseUrl+'api/submissions/delete', auth.connect(basicAuth));

	// parse application/x-www-form-urlencoded
	//app.use(config.baseUrl+'api/submissions', bodyParser.urlencoded({ extended: false }));
    app.use(config.baseUrl+'api/submissions', bodyParser.json());
    app.use(config.baseUrl+'api/submissions', require('./submissions'));

    app.use(config.baseUrl+'api/questions', require('./questions'));
};