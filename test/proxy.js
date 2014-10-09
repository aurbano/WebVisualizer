/**
 * Test the Proxy server running, requires the server to be running locally for the tests
 */
var should = require('should'),
	request = require('supertest');

describe('Proxy server', function () {
	describe('Get version', function () {
		it('should return an image', function (done) {
			var port = process.env.PORT || 5000;
			request('http://localhost:' + port)
				.get('/proxy/https%3A%2F%2Fwww.google.com%2Fimages%2Fsrpr%2Flogo11w.png')
				.expect(200)
				.expect('Content-Type', 'image/png')
				.end(function (err, res) {
					done()
				})
		});
	});
});