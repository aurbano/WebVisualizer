/**
 * Simple image proxy for Nodejs
 * @param  {Express} app Express app
 * @return {function}
 */
var http = require('http'),
	url = require('url');

module.exports = function (app) {
	app.get('/proxy/:image', function (request_from_client, response_to_client) {
		var image_url = decodeURIComponent(request_from_client.params.image),
			image = url.parse(image_url);

		var options = {
			hostname: image.host,
			port: image.port || 80,
			path: image.path,
			method: 'GET'
		};

		var image_get_request = http.get(options, function (proxy_response) {
			proxy_response.headers = request_from_client.headers;
			proxy_response.pipe(response_to_client);
		});
		image_get_request.end();
	});
}