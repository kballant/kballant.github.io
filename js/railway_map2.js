var mapObj = new Map();

// Create the rail layer from the GeoJSON file
var railLayer = new ol.layer.Vector({
	title: '1930 Railways',
	source: new ol.source.Vector({
		url: '../files/1930_Ottawa_Railways.geojson', 
		format: new ol.format.GeoJSON({
			dataProjection: 'EPSG:4269', featureProjection: 'EPSG:3857'
		})
	}),
	style: styleFunction
})

railLayer.set('name', 'rails');

mapObj.addLayer(railLayer);

mapObj.createMap();

map = mapObj.getMap();

mapObj.bindPopupClose();

mapObj.bindPopupOpen();

mapObj.createFeatureOverlay();

// Create a style cache dictionary for highlighting rails
var highlightStyleCache = {};

// Create a feature overlay for highlighting rails
var featRailOverlay = new ol.layer.Vector({
	source: new ol.source.Vector(),
	map: map,
	style: function(feature, resolution) {
		if (map.getView().getZoom() <= 14) {
			width = 2;
		} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
			width = 3;
		} else {
			width = 5;
		}
		var text = resolution < 5000 ? feature.get('name') : '';
		if (!highlightStyleCache[text]) {
			highlightStyleCache[text] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: '#FF00FF',
					width: width
				}),
				text: new ol.style.Text({
					font: '12px Calibri,sans-serif',
					text: text,
					fill: new ol.style.Fill({
						color: '#000'
					}),
					stroke: new ol.style.Stroke({
						color: '#f00',
					width: 3
					})
				})
			});
		}
		return highlightStyleCache[text];
	}
});

mapObj.setPopup();

mapObj.addClickEvent();

mapObj.setVisible();

mapObj.addPointMove();