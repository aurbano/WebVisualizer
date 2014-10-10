var express = require('express'),
	app = express();

module.exports = function () {
	var port = process.env.PORT || 5000;

	var server = app.listen(port, function () {
		console.log('Proxy server started on %d', server.address().port);
	});

	app.get('/version', function (req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send({
			version: require('../package.json').version
		});
	});

	app.use(express.static('./public'));

	require('./proxy.js')(app);

	// Use Bing Search API
	require('./search/bing.js')(app);
};