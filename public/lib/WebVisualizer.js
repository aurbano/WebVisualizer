var WebGraph = function (options) {
	var wg = {
		Viva: {
			graph: null,
			graphics: null,
			layout: null,
			renderer: null
		}
	};

	// Default settings
	var settings = {
		container: null,
		history: $('#history')
	};
	settings = $.extend(settings, options);

	if (!settings.container) {
		console.error("You must specify a container in the settings.");
		return false;
	}

	init();

	wg.search = function (website) {
		console.info("Starting Graph for " + website);
		addToHistory(website);
		addNode(website, {
			favicon: favicon('http://' + website),
			url: 'http://' + website
		});
		// Now start searching
		search(website);
	};

	// ------------------------------------- //
	//          INTERNAL FUNCTIONS           //
	// ------------------------------------- //         

	function init() {
		wg.Viva.graph = Viva.Graph.graph();

		wg.Viva.layout = Viva.Graph.Layout.forceDirected(wg.Viva.graph, {
			springLength: 80,
			springCoeff: 0.0004,
			dragCoeff: 0.05,
			gravity: -10,
			theta: 0.5
		});

		// Set custom nodes appearance
		wg.Viva.graphics = Viva.Graph.View.webglGraphics();

		wg.Viva.graphics.setNodeProgram(Viva.Graph.View.webglImageNodeProgram());

		wg.Viva.graphics.node(function (node) {
			return new Viva.Graph.View.webglImage(20, proxyURL(node.data.favicon));
		});

		wg.Viva.renderer = Viva.Graph.View.renderer(wg.Viva.graph, {
			container: settings.container.get(0),
			graphics: wg.Viva.graphics,
			layout: wg.Viva.layout
		});

		wg.Viva.renderer.run();
	};

	function search(query) {
		$.get("/search", {
			query: 'related: ' + query
		}).done(function (data) {
			console.log("Data Loaded: ", data);
			var total = data.length;
			for (var i = 0; i < total; i++) {
				addNode(data[i].DisplayUrl, {
					favicon: favicon(data[i].Url),
					url: data[i].Url,
					description: data[i].Description
				});

				addLink(query, data[i].DisplayUrl)
			}
		});
	}

	function addNode(name, data) {
		wg.Viva.graph.addNode(name, data);
	}

	function addLink(from, to) {
		wg.Viva.graph.addLink(from, to);
	}

	function addToHistory(search) {
		settings.history.append('<li>' + search + '</li>');
	}

	function proxyURL(url) {
		var url = '/proxy/' + encodeURIComponent(url);
		return url;
	}

	function favicon(website) {
		var faviconApp = 'http://getfavicon.appspot.com/';
		return faviconApp + website;
	}

	return wg;
};