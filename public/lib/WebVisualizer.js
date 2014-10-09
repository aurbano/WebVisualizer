var WebGraph = function (options) {
	var wg = {};

	// Default settings
	var settings = {
		container: null
	};
	settings = $.extend(settings, options);

	if (!settings.container) {
		console.error("You must specify a container in the settings.");
		return false;
	}

	wg.start = function (website) {
		$(document).ready(function () {
			console.log("Starting with web=" + website);
			wg.render();
		});
	};

	wg.render = function () {
		console.info("Starting graph");

		var graph = Viva.Graph.graph();

		// Construct the graph
		graph.addNode('anvaka', {
			url: 'https://secure.gravatar.com/avatar/91bad8ceeec43ae303790f8fe238164b'
		});
		graph.addNode('manunt', {
			url: 'https://secure.gravatar.com/avatar/c81bfc2cf23958504617dd4fada3afa8'
		});
		graph.addNode('thlorenz', {
			url: 'https://secure.gravatar.com/avatar/1c9054d6242bffd5fd25ec652a2b79cc'
		});
		graph.addNode('bling', {
			url: 'https://secure.gravatar.com/avatar/24a5b6e62e9a486743a71e0a0a4f71af'
		});
		graph.addNode('diyan', {
			url: 'https://secure.gravatar.com/avatar/01bce7702975191fdc402565bd1045a8?'
		});
		graph.addNode('pocheptsov', {
			url: 'https://secure.gravatar.com/avatar/13da974fc9716b42f5d62e3c8056c718'
		});
		graph.addNode('dimapasko', {
			url: 'https://secure.gravatar.com/avatar/8e587a4232502a9f1ca14e2810e3c3dd'
		});

		graph.addLink('anvaka', 'manunt');
		graph.addLink('anvaka', 'thlorenz');
		graph.addLink('anvaka', 'bling');
		graph.addLink('anvaka', 'diyan');
		graph.addLink('anvaka', 'pocheptsov');
		graph.addLink('anvaka', 'dimapasko');

		var layout = Viva.Graph.Layout.forceDirected(graph, {
			springLength: 80,
			springCoeff: 0.0004,
			dragCoeff: 0.05,
			gravity: -50,
			theta: 0.5
		});

		// Set custom nodes appearance
		var graphics = Viva.Graph.View.webglGraphics();

		graphics.setNodeProgram(Viva.Graph.View.webglImageNodeProgram());

		graphics.node(function (node) {
			return new Viva.Graph.View.webglImage(20, proxyURL(node.data.url));
		});

		var renderer = Viva.Graph.View.renderer(graph, {
			container: settings.container.get(0),
			graphics: graphics,
			layout: layout
		});

		renderer.run();
	};

	function proxyURL(url) {
		var url = '/proxy/' + encodeURIComponent(url);
		console.log("Loading " + url);
		return url;
	}

	return wg;
};