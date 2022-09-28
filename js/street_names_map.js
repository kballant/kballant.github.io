/* author:		Kevin Ballantyne
	updated:		20220925
	version:		1.0
*/

//var closer = document.getElementById('popup-closer');

// Page Methods

var geojson_fn = 'Ottawa_Street_Name_Origins_dev.geojson';

function addFeatIds(lyrList) {
	
	streetLayer = getLyr(lyrList, 'streets');
	
	var source = streetLayer.getSource()
	
	// Create the counter for the 
	var counter = 0
	
	// Set the key as a function to run when the source changes
	var key = source.on('change', function(event) {
		if (source.getState() == 'ready') {
		
			// Removes the 'on change' listener
			//source.unByKey(key); // OL v3
			ol.Observable.unByKey(key);
			
			// Using AJAX, load the KML file
			$.ajax('../../files/' + geojson_fn).done(function(data) {
				//kmlLayer.getSource().forEachFeature(function(feature) {
				streetLayer.getSource().forEachFeature(function(feature) {
					// For each feature in the KML file
					
					// Set its ID to the counter
					feature.setId(counter);
					
					// Increment the counter
					counter++;
				});
			});
		}
	});
}

function getChkbox(name) {
	/* Gets a checkbox element from the page with a specified ID.
	:param name: The name of the checkbox to locate on the page
	:return: The checkbox element.
	*/
	chkBox = document.getElementById(name);
	return chkBox;
}

function getOverlayStyle() {
	// Set the width of the line (road) based on the zoom level
	if (map.getView().getZoom() <= 14) {
		width = widths[0];
		outline = false;
	} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
		width = widths[1];
		outline = true;
	} else {
		width = widths[2];
		outline = true;
	}
	
	var overlayStyle = new ol.style.Style({
							stroke: new ol.style.Stroke({
								color: '#FF00FF',
								width: width
							}),
							text: new ol.style.Text({
								font: 'bold 14px "Open Sans", "Arial Unicode MS", "sans-serif"',
								placement: 'line',
								fill: new ol.style.Fill({ 
									color: 'yellow' 
								}),
								stroke: new ol.style.Stroke({
									color: 'white', 
									width: 6
								}), 
								// get the text from the feature - `this` is ol.Feature
								// and show only under certain resolution
								//text: map.getView().getZoom() > 16 ? feature.get('street_name') : ''
								text: feature.get('street_name')
							})
						});

	return overlayStyle;
}

function uncheckAll(lyrList) {
	/* Unchecks all the input checkboxes on the map page. 
	:return: None
	*/

	// Get each checkbox from the page, uncheck them and set all layers
	//		to invisible
	$('input[type=checkbox]').each(function () {
		//curLyr = getLayer(this.id);
		curLyr = getLyr(lyrList, this.id)
		this.checked = false;
		curLyr.setVisible(false);
	});
}

function cleanURL() {
	/* Removes any substrings from the URL.
	:return: None
	*/
	
	if (location.search.indexOf("?") > -1) {
		var clean_url = location.protocol + "//" + location.host + location.pathname;
		window.history.replaceState({}, document.title, clean_url);
	}
}

function resizeGeomatics() {
	/* Resizes the Geomatics text on the page
	*/ 
	$('#geomatics').width($('this').width());
};

function changeSize(size) {
	/* Changes the size in the URL substring
	*/
	
	var view = map.getView();
	var zoom = view.getZoom();
	var centre = view.getCenter();
	var rotation = view.getRotation();
	if (size == "small") {
		window.location.href = './map?map=' + zoom + '/' + centre + '/' + rotation;
	} else {
		window.location.href = './map-full?map=' + zoom + '/' + centre + '/' + rotation;
	}
}

// Popup Methods

function closePopup(featId) {
	/* Called once the popup has been closed.
	:param featId: The ID of the feature that initiated the popup.
	:return: None
	*/

	// Unlocks the map page
	POPUP_LOCK = false;
	
	// Removes the highlight of the feature with ID featId
	// setHighlight(featId);
};

function resizePopup(mapPopup) {
	if ($(window).width() > 768) {
		mapPopup.style.width = "850px";
	} else {
		mapPopup.style.width = "100% !important";
	}
}

function getPopupContent() {
	/* Gets the HTML text for the popup from a text file.
	:return: The HTML text for the popup.
	*/

	// Set the xhttp object
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			outContent = xhttp.responseText;
			return outContent;
		}
	};
	
	// Open the street_popup_html.txt file
	xhttp.open("GET", "../../files/street_popup_html.txt", false);
	xhttp.send();
	
	// Get the contents of the file
	outContent = xhttp.responseText;
	
	return outContent;
}

function getPopup(feature) {
	/* Opens the popup for the specified feature.
	:param feature: The OL feature object which initiated the popup.
	:return: None
	*/
	
	// Lock the map page
	POPUP_LOCK = true;
	
	// Get the properties and feature ID
	var props = feature.getProperties();
	var featId = feature.getId();
	
	// setHighlight(featId);
	
	// Hide the info tooltip
	info.tooltip('hide');
	
	// Call the showPopup function in popup.js
	showPopup(props, featId);
}

// Map Methods

function setHighlight(featId) {
	/* Removes the highlight of the feature with ID featId.
	:param featId: The feature ID.
	:return: None
	*/
	
	return null;

	/* if (typeof featId !== 'undefined'){
		// If featId is defined
		
		// Get the feature with ID featId from the KML layer
		//var feat = kmlLayer.getSource().getFeatureById(featId);
		var feature = streetLayer.getSource().getFeatureById(featId);
		
		var style = feature.getStyle();
		var feat_fill = style.getFill();
		
		if (POPUP_LOCK) {
			var colour = 'rgb(0,255,0)'; 
			var line_width = 3;
		} else {
			var colour = 'rgba(0,0,0,0.7)';
			var line_width = 2;
		}
		
		feature.setStyle(new ol.style.Style({
			stroke: new ol.style.Stroke(
				{
					color: colour,
					width: line_width
				}
			),
			fill: feat_fill
		}));
	}; */
};

function query_by_prop(property, value) {
	/* Gets a feature based on a property with a specified value.
	:param property: The name of the property.
	:param value: The value of the specified property.
	:return: A feature with a specified property and value.
	*/

	// Get a list of all the features in the KML layer
	//var features = kmlLayer.getSource().getFeatures();
	var features = streetLayer.getSource().getFeatures();
	
	// Go through each feature
	for (var i=0; i<features.length; i++) {
	
		// Get the feature
		var feat = features[i];
		
		// Get the properties of the feature
		var properties = feat.getProperties();
		
		// If the property has the specified value, return the feature
		if (properties[property] == value) {
			return feat;
		}
	}
}

function showToolTip(pixel, feature, lyr) {
	// The following displays the tooltip at the pixel position
	// Do not show tooltip when popup is showing
	if (!POPUP_LOCK) {
	
		// Set the tooltip position based on pixel
		info.css({
			left: pixel[0] + 'px',
			top: (pixel[1] - 15) + 'px'
		});
		
		//feature = feature_list[0];
		//lyr = feature_list[1];
		
		if (feature) {
			if (lyr != undefined) {
				if (lyr.get('name') == 'streets') {
					// If the feature's layer is 'streets'
					// Set up the tool tip
					info.tooltip({
						animation: false,
						trigger: 'hover'
					});
					// Modify the CSS 'road-info' class
					$('.tooltip > .tooltip-inner').removeClass('road-info').addClass('road-info');
					
					// Get the name of the tool name
					var toolname = $('<div>').html(feature.get('NAME')).html().replace(/&amp;/g, '&');
					
					// Hide any previous tooltips
					info.tooltip('hide')
					// Change the 'data-original-title' attribute to the tool name
						.attr('data-original-title', toolname)
					// Set the title of the tool tip
						.tooltip('fixTitle')
					// Show the tool tip where the cursor is
						.tooltip('show');
				} else {
					// If the feature's layer is a building
					// Set up the tool tip
					info.tooltip({
						animation: false,
						trigger: 'hover'
					});
					// Modify the CSS 'road-info' class
					$('.tooltip > .tooltip-inner').removeClass('road-info');
					
					// Get the name of the tool name
					//var toolname = $('<div>').html(feature.get('name')).html().replace(/&amp;/g, '&');
					var props = feature.getProperties();
					var buildName = props['buildingName']
					
					// Hide any previous tooltips
					info.tooltip('hide')
					// Change the 'data-original-title' attribute to the tool name
						.attr('data-original-title', buildName)
					// Set the title of the tool tip
						.tooltip('fixTitle')
					// Show the tool tip where the cursor is
						.tooltip('show');
				}
			}
		} else {
			// If no feature, hide the tool tip
			info.tooltip('hide');
		}
	}
}

// Set the info variable
var info = $('#info');

// Add all the base layers
lyrList = addBaseLayers()

// Add the railways layer
var streetOpts = {};
streetOpts['Name'] = 'streets'
streetOpts['Title'] = 'The Origin of Ottawa Street Names'
streetOpts['URL'] = '../../files/' + geojson_fn, 
streetOpts['dataProj'] = 'EPSG:4269'
streetOpts['featProj'] = 'EPSG:3857'

widths = [3, 6, 10]

var streetStyleFunc = function (feature, resolution) {
	
	// Set the width of the line (road) based on the zoom level
	if (map.getView().getZoom() <= 14) {
		width = widths[0];
		outline = false;
	} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
		width = widths[1];
		outline = true;
	} else {
		width = widths[2];
		outline = true;
	}
	
	var outStyle = [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				//color: 'rgba(0,255,255,0.7)',
				color: 'rgb(21,195,249)',
				width: width
			}),
			text: new ol.style.Text({
				font: 'bold 14px "Open Sans", "Arial Unicode MS", "sans-serif"',
				placement: 'line',
				fill: new ol.style.Fill({ 
					color: 'black' 
				}),
				stroke: new ol.style.Stroke({
					color: 'white', width: 6
				}), 
				// get the text from the feature - `this` is ol.Feature
				// and show only under certain resolution
				//text: map.getView().getZoom() > 16 ? feature.get('street_name') : ''
				text: feature.get('street_name')
			}), 
			zIndex: 1
		})
	]
				
	if (outline == true) {
		outStyle.unshift(
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					//color: '#FFA24B',
					color: 'rgba(0,0,255,0.7)',
					//lineDashOffset: 2, 
					width: width + 10
				}), 
				zIndex: 0
			})
		)
	}
				
	return outStyle;
};

// Add the streets layer
lyrList = addLayer(streetOpts, lyrList, streetStyleFunc);

// Make the street layer clickable
var streetLayer = getLyr(lyrList, 'streets')
var lyrDict = {'streets': streetLayer} 

// Set the zoom, centre and rotation of the map
var viewInfo = {};
viewInfo['zoom'] = 13;
viewInfo['centre'] = ol.proj.transform([-75.67824, 45.41501], "EPSG:4326", "EPSG:3857");
viewInfo['rotation'] = 0;

// Reset the centre variable based on the URL
viewInfo = getCentre(viewInfo);

// Create the map
map = createMap(lyrList, viewInfo);

var counter = 0
streetLayer.getSource().forEachFeature(function(feature) {
	// For each feature in the KML file
	
	// Set its ID to the counter
	feature.setId(counter);
	
	// Increment the counter
	counter++;
});

addFeatIds(lyrList);

//railLayer.setStyle(styleFunction());

// Set the text for the street layer
// for (var i=0; i<lyrList.length; i++) {
    // if (lyrList[i].get('name') == 'roads') { 
        // lyrList[i].getStyle()[0].getText().setText(map.getView().getZoom() > 16 ? feature.get('street_name') : '');
    // }
// }
// text: map.getView().getZoom() > 16 ? feature.get('street_name') : ''

/* for (var i=0; i<lyrList.length; i++) {
    if (lyrList[i].get('name') == 'roads') { 
		lyrList[i].setStyle(styleFunction());
	}
} */

bindResize();

// Bind the popup close
bindClose();

// Bind the popup open
bindOpen();

// Create the feature overlay for highlighting buildings
var collection = new ol.Collection();
/* var buildOverlay = new ol.layer.Vector({
	//map: map,
	source: new ol.source.Vector({
		features: collection,
		useSpatialIndex: false // optional, might improve performance
	}),
	updateWhileAnimating: true, // optional, for instant visual feedback
	updateWhileInteracting: true // optional, for instant visual feedback
});

// Add buildings overlay for highlighting
buildOverlay.set('name', 'buildings_overlay');
map.addOverlay(buildOverlay); */

var params = {};
params.strokeColour = '#FF00FF';
params.textFont = 'bold 14px "Open Sans", "Arial Unicode MS", "sans-serif"';
params.textPlacement = 'line';
params.textFillColour = 'black';
params.textStrokeColour = '#FFFF55';
params.textWidth = 6;

// Add streets overlay for highlighting
featStreetOverlay = addFeatOverlay(map, 'streets_overlay', widths, 'street_name', params);
map.addOverlay(featStreetOverlay);
//featOverlays.push(featRoadsOverlay);

// Add the popup
map, popup = addPopup(map);

// Reset all the styles
// resetStyles(lyrList, styles);

// Set the building layer radio button
// var buildingRad = document.getElementById('buildings');
// buildingRad.click();

// When the KML layer changes
//kmlLayer.getSource().on('change', function(evt){
/* buildingLayer.getSource().on('change', function(evt){
    var source = evt.target;
    
    // Position and zoom the map based on the URL substring
    if(source.getState() === 'ready'){
		locVal = location.search.substring(1)
        if (locVal != "" && locVal.indexOf("id") > -1) {
			// Get the 'id' passed in from the URL
			queryString = location.search.substring(1);
			idVal = queryString.split('=')[1];
			//alert(idVal);
			if (isNaN(idVal)) {
				cleanURL();
			} else {
				var feat = query_by_prop('id', idVal)
				//var centre = feat.geometry.getCentroid();
				var extent = feat.getGeometry().getExtent();
				var featId = feat.getId();
				map.getView().fit(extent, map.getSize());
				//map.getView().setCenter(ol.proj.fromLonLat([lon, lat]))
				map.getView().setZoom(18);
				cleanURL();
			}
		}
    }
}); */

// Add the click event to the map
map = addSingleClick(map, true, geomType='line');

// Set the layers visible
setVisible(lyrList);

// Add mouse move event to the map
map = addPointerMove(map);
