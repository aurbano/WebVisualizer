/**
 * Search endpoint using Bing service.
 *
 * You can get your keys at https://datamarket.azure.com/dataset/bing/search
 *
 * @param  {Express} app Express app
 * @return {function}
 */



module.exports = function (app) {

	var bingAPIkey = process.env.bingAPIkey;

	if (!bingAPIkey) {
		console.error("[ERROR] No API key for Bing detected, please set the 'bingAPIkey' env variable.");
		return;
	}

	var rootUri = 'https://api.datamarket.azure.com/Bing/Search/v1',
		auth = new Buffer([bingAPIkey, bingAPIkey].join(':')).toString('base64'),
		request = require('request').defaults({
			headers: {
				'Authorization': 'Basic ' + auth
			}
		});

	// Setup the service
	app.get('/search', function (req, res) {
		var service_op = req.query.service_op || 'Web',
			query = req.query.query;

		var url = rootUri + '/' + service_op;

		console.log("Bing Search: " + url + " -> " + query);

		request.get({
			url: url,
			qs: {
				$format: 'json',
				Query: "'" + query + "'", // Single quotes required
			}
		}, function (err, response, body) {
			if (err) {
				return res.status(500).send(err.message);
			}
			if (response.statusCode !== 200) {
				return res.status(500).send(response.body);
			}

			var results = JSON.parse(response.body);
			res.send(results.d.results);
		});
	});
};