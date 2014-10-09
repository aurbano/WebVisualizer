var express = require('express'),
	app = express(),
	http = require('http'),
	url = require('url');

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

	app.get('/proxy/:image', function (request_from_client, response_to_client) {
		var image_url = decodeURIComponent(request_from_client.params.image),
			image = url.parse(image_url);

		var options = {
			hostname: image.host,
			port: image.port || 80,
			path: image.path,
			method: 'GET'
		};

		console.log(options.method + ': ' + options.hostname + ':' + options.port + options.path);

		var image_get_request = http.get(options, function (proxy_response) {
			proxy_response.headers = request_from_client.headers;
			proxy_response.pipe(response_to_client);
		});
		image_get_request.end();
	});
};