/* author:		Kevin Ballantyne
	updated:		20190112
	version:		1.0
*/

function resizePopup(img) {
	/* Resizes the popup based on the input image.
		NOTE: This method is no longer used.
	*/ 

	height = img.height;
	width = img.width;
	mapPopup = document.getElementById('inline_content').style;
	alert(mapPopup.cssText);
	popupHeight = mapPopup.style.height;
	
	alert("height: " + height + ", width: " + width + ", popup_height: " + popupHeight);
}

// #######################################################################

// Set the projection of the map, in this case WGS84 Web Mercator
// var projection = ol.proj.get('EPSG:3857');

// Add all the base layers
lyrList = addBaseLayers()

// Add the railways layer
var opts = {};
opts['Name'] = 'rails'
opts['Title'] = '1930 Railways'
opts['URL'] = '../files/1930_Ottawa_Railways.geojson', 
opts['dataProj'] = 'EPSG:4269'
opts['featProj'] = 'EPSG:3857'

var styleFunction = function (feature, resolution) {
	/* Sets the style for the rails layer based on the map's zoom
	:return: A OL Style object with the colour and width of the road based
				on the zoom.
	*/
	
	// Set the width of the line (road) based on the zoom level
	if (map.getView().getZoom() <= 14) {
		width = 3;
	} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
		width = 2;
	} else if (map.getView().getZoom() > 16 & map.getView().getZoom() < 18) {
		width = 2;
	} else {
		width = 4;
	}
	
	var owner = feature.get('OWNER')
	
	switch(owner) {
		case 'Canadian National Railways':
			colour = 'rgba(220,0,0)' //,0.7)'
			break;
		case 'Canadian Pacific Railway':
			colour = 'rgba(149,62,0)' //,0.7)'
			break;
		case 'New York Central Railway':
			colour = 'rgba(0,0,200)' //,0.7)'
			break;
		case 'Ottawa Terminal Railway':
			colour = 'rgba(255,95,0)' //,0.7)'
			break;
		default:
			window.alert(owner);
			colour = 'rgba(255,255,255)' //,0.7)'
	};
	
	// Return the new style for the line
	return [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: colour,
				width: width
			}),
			text: new ol.style.Text({
				font: '12px Calibri,sans-serif',
				fill: new ol.style.Fill({ color: '#000' }),
				stroke: new ol.style.Stroke({
					color: '#fff', width: 2
				})
				// get the text from the feature - `this` is ol.Feature
				// and show only under certain resolution
				//text: map.getView().getZoom() > 16 ? feature.get('NAME') : ''
			})
		})
	]
};

lyrList = addLayer(opts, lyrList, styleFunction);

// ############################################################################

// Set the zoom, centre and rotation of the map
var viewInfo = {};
viewInfo['zoom'] = 13;
viewInfo['centre'] = ol.proj.transform([-75.67824, 45.41501], "EPSG:4326", "EPSG:3857");
viewInfo['rotation'] = 0;

// Create the map
map = createMap(lyrList, viewInfo);

//railLayer.setStyle(styleFunction());

// Bind the popup close
bindClose();

// Bind the popup open
bindOpen();

// Create the feature overlay for highlighting
featOverlays = []
widths = [2, 3, 5];
featRailOverlay = addFeatOverlay(map, 'rails_overlay', widths);
map.addOverlay(featRailOverlay);
featOverlays.push(featRailOverlay);

// Add popup
//map = addPopup(map);

// Add single click event to map
map = addSingleClick(map)

// Set the layer visible
setVisible(lyrList);

// Add mouse move event to map
map = addPointerMove(map);

