'use strict';

Saillog.Map = L.Map.extend({
	options: {
		zoomControl: false,
		attributionControl: false,
		center: [52.6, 4.5],
		zoom: 5
	},
	initialize: function (app) {
		this.app = app;

		L.Map.prototype.initialize.call(this, 'map');

		this.initLayers();
		//this.initControls();
	},

	initControls: function () {
		this.layerControl = L.control.layers({}, {
			OpenSeaMap: this.layers.openseamap
		}, {
			position: 'bottomleft',
			collapsed: false
		}).addTo(this);
	},

	initLayers: function () {
		this.layers = {};
		this.layers.base = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
		});

		this.layers.sat =  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});

		this.layers.openseamap = L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
			attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
			minZoom: 6
		}).addTo(this);

		this.layers.vesselfinder = L.tileLayer('https://map.vesselfinder.net/bright@2x/{z}/{x}/{y}.png', {
			attribution: 'Vesselfinder'
		}).addTo(this);

		this.layers.flytoraster = L.tileLayer('https://viewer.flytomap.com/noaatiles/{z}/{x}/{y}.png', {
			attribution: 'FlyToMap'
		});

		this.layers.flytovector = L.tileLayer('https://viewer.flytomap.com/ftm_tiles/{z}/{x}/{y}.png', {
			attribution: 'FlyToMap'
		});





		L.control.layers({
			'VF': this.layers.vesselfinder,
			'Satelliet': this.layers.sat,
			'Kaart': this.layers.base,
			'Navigation Raster': this.layers.flytoraster,
			'Navigation Vector': this.layers.flytovector
		}, {
			'Open Seamap': this.layers.openseamap
		}, {
			position: 'topleft'
		}).addTo(this);
	},

	replaceBaseLayer: function (layer) {
		this.layers.oldbase = this.layers.base;
		this.layers.base = L.tileLayer(layer.url, layer.options);
	},

	fitBounds: function (bounds) {
		if (bounds) {
			L.Map.prototype.fitBounds.call(this, bounds, {
				paddingBottomRight: [this.app.sidebarPadding(), 0]
			});
		}
	},

	panTo: function (thing, zoom) {
		if (!thing) {
			return this;
		}

		if (Saillog.util.isArray(thing) && thing.length > 0) {
			return this.setView(thing, zoom);
		}
		if (thing.bringToFront) {
			thing.bringToFront();
		}
		if (thing.getBounds) {
			this.fitBounds(thing.getBounds());
		} else if (thing.getLatLng) {
			L.Map.prototype.panTo.call(this, thing.getLatLng(), {
				paddingBottomRight: [this.app.sidebarPadding(), 0]
			});
		}
		return this;
	},

	maxZoom: function (zoom) {
		if (this.getZoom() > zoom) {
			this.setZoom(zoom);
		}
		return this;
	}


});
