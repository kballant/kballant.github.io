/* author:		Kevin Ballantyne
	updated:		20190112
	version:		1.0
*/

// Determines whether the page will be locked or not
var POPUP_LOCK = false;

var prj = ol.proj.get('EPSG:3857');

// Get the popup HTML content
var popupHTML = getPopupContent();

function cleanURL() {
	/* Removes any substrings from the URL.
	:return: None
	*/
	
	if (location.search.indexOf("?") > -1) {
		var clean_url = location.protocol + "//" + location.host + location.pathname;
		window.history.replaceState({}, document.title, clean_url);
	}
}

function createCustControl() {
	
	var customControl = function(opt_options) {
		var element = document.createElement('div');
		element.className = 'custom-control ol-unselectable ol-control';
		ol.control.Control.call(this, {
			element: element
		});
	};
	ol.inherits(customControl, ol.control.Control);
	
	return customControl;
}

function resizeGeomatics() {
	/* Resizes the Geomatics text on the page
	*/ 
	$('#geomatics').width($('this').width());
};

function createView(centre, proj, zoom) {
	var outView = new ol.View({
		center: centre, 
		projection: proj, 
		zoom: zoom
	})
	
	return outView
}

function detectmob() {
	/* Determines whether the user is using a mobile device
	:return: True if the user is using a mobile device, false if not.
	*/

	//window.alert(window.innerWidth + ", " + window.innerHeight)
	
	if(window.innerWidth <= 800 && window.innerHeight <= 600) {
		return true;
	} else {
		return false;
	}
}

function addBaseLayers(lyrList=null) {
	// Create the Bing Maps background layer
	var bingLayer = new ol.layer.Tile({
		source: new ol.source.BingMaps({
			imagerySet: 'Aerial',
			key: 'AhCYdXJJqvQnyMnREP6yvB8LBqky1iY8k_ZfEZpFpjKC7mXRduWYXfSnV1683P3_'
			//crossOrigin: 'anonymous'
		})
	});
	
	// Create a OpenStreetMaps source and tile layer
	var osmSource = new ol.source.OSM();
	var osmLayer = new ol.layer.Tile({source: osmSource});
	
	bingLayer.set('name', 'bingmap');
	osmLayer.set('name', 'osm');
	
	if (lyrList == null) {
		lyrList = [bingLayer, osmLayer];
	} else {
		lyrList.push(bingLayer);
		lyrList.push(osmLayer);
	}
	
	return lyrList
}

function addLayer(opts, lyrList=null, styleFunction=null) {
	
	// Create the rail layer from the GeoJSON file
	var newLayer = new ol.layer.Vector({
		title: opts['title'],
		source: new ol.source.Vector({
			url: opts['URL'], 
			format: new ol.format.GeoJSON({
				dataProjection: opts['dataProj'], featureProjection: opts['featProj']
			})
		}),
		style: styleFunction
	})
	
	// Set all the layer names
	newLayer.set('name', opts['Name']);
	
	if (lyrList == null) {
		lyrList = [newLayer];
	} else {
		lyrList.push(newLayer);
	}
	
	return lyrList
}

// var featOverlay;

/* function addOverlay(map, name, widths) {
	// Create a style cache dictionary for highlighting rails
	var highlightStyleCache = {};

	// Create a feature overlay for highlighting rails
	var featOverlay = new ol.layer.Vector({
		source: new ol.source.Vector(),
		map: map,
		style: function(feature, resolution) {
				if (map.getView().getZoom() <= 14) {
					width = widths[0];
				} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
					width = widths[1];
				} else {
					width = widths[2];
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
	
	featOverlay.set('name', name);
	
	return featOverlay;
} */

function addFeatOverlay(map, name, widths) {
	// Create a style cache dictionary for highlighting rails
	var highlightStyleCache = {};

	// Create a feature overlay for highlighting rails
	var featOverlay = new ol.layer.Vector({
		source: new ol.source.Vector(),
		map: map,
		style: function(feature, resolution) {
				if (map.getView().getZoom() <= 14) {
					width = widths[0];
				} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
					width = widths[1];
				} else {
					width = widths[2];
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
	
	featOverlay.set('name', name);
	
	return featOverlay;
}

function addPopup(map) {
	// Get the <div> with id 'popup' from the map page
	var element = document.getElementById('popup');

	// Create the popup overlay on the map
	var popup = new ol.Overlay({
		element: element
	});
	map.addOverlay(popup);
	
	return map, popup
}

function addSingleClick(inMap, hasPopup=false) {
	// Display popup on click
	inMap.on('singleclick', function(evt) {
		//var pixel = evt;
		if (detectmob) {
			// If using a mobile device, the location is based on the 
			//		current coordinates
			var coordinates = inMap.getEventCoordinate(evt.originalEvent);
			//var feature = vectorlayer.getClosestFeatureToCoordinate(coordinates);
			if (hasPopup) {
				displayPopup(evt, coordinates);
			}
		} else {
			// If not using a mobile device, the location is based on the 
			//		cursor location
			var pixel = inMap.getEventPixel(evt.originalEvent);
			if (hasPopup) {
				displayPopup(evt, pixel);
			}
		}
	});
	
	return inMap;
}

function bindGeomatics() {
	// Bind the resizing of the geomatics text and logo to the document
	// NOTE: This is no longer needed since the geomatics text logo have been
	//			removed from the page.
	$(function(){
		// The document object acts as the 'subscription service' - 
		// it receives all events via bubbling.
		$(document).bind('layout.resizeCheck', function(){
			$('#geomatics').width($('this').width());
		});

		// Whenever you need to update the size:
		$('#logo').trigger('layout.resizeCheck');
	});
}

function bindClose() {
	// When the Magnific popup is closed
	$(document).on("mfpClose", function(event) {

		// Get the popup HTML
		var popupHTML = $(".modal-body").html();
		
		// Find the location of the Feature_ID in the popup HTML text
		var startPos = popupHTML.search("Feature_ID");
		var endPos = popupHTML.indexOf("-->", startPos);
		var subStr = popupHTML.substring(startPos, endPos);
		var featStr = subStr.split("=")[1];
		
		// Get the feature ID
		var featId = parseInt(featStr)

		// Call the closePopup in the popup.js with the feature ID
		closePopup(featId);
	});
}

function bindOpen() {
	// When the Magnific popup is opened
	$(document).on("mfpOpen", function(event) {

		// Get the HTML text for the popup from the modal-body element on the page
		var popupHTML = $(".modal-body").html();
		
		// Convert the HTML text to a DOMParser
		parser = new DOMParser();
		htmlDoc = parser.parseFromString(popupHTML, "text/html");
		
		// Correct htmlDoc if null
		if (htmlDoc == null) {
			htmlDoc = document.createElement('div');
			htmlDoc.innerHTML = popupHTML;
		}
		
		// Get the img element
		imgElements = htmlDoc.getElementsByTagName('img');
		
		// Calculate the width of the image based on the height
		function calculateWidth(img, height) {
			var newImg = document.createElement('img');
			newImg.src = img.src;
			
			if (newImg.naturalWidth) {
				imgHeight = newImg.naturalHeight;
				imgWidth = newImg.naturalWidth;
			}
			
			aspect = imgWidth / imgHeight;
			
			newWidth = height * aspect;
			
			newWidth = parseInt(newWidth.toString());
			
			return newWidth;
		}
		
		// Get the contents of the popup from the page (element 
		//		with id 'inline_content')
		var mapPopup = document.getElementById('inline_content');
		
		// Set the width of the popup based on the window size
		if ($(window).width() > 768) {
			mapPopup.style.width = "600px";
		} else {
			mapPopup.style.width = "100% !important";
		}
	});
}

function bindResize() {
		// Bind the resizing of the geomatics text and logo to the document
	// NOTE: This is no longer needed since the geomatics text logo have been
	//			removed from the page.
	$(function(){
		// The document object acts as the 'subscription service' - 
		// it receives all events via bubbling.
		$(document).bind('layout.resizeCheck', function(){
			$('#geomatics').width($('this').width());
		});

		// Whenever you need to update the size:
		$('#logo').trigger('layout.resizeCheck');
	});
}

function closePopup(featId) {
	/* Called once the popup has been closed.
	:param featId: The ID of the feature that initiated the popup.
	:return: None
	*/

	// Unlocks the map page
	POPUP_LOCK = false;
	
	// Removes the highlight of the feature with ID featId
	setHighlight(featId);
};

function createMap(lyrList, viewInfo, custControl) {
	
	// Create the OL map object
	var map = new ol.Map({
		control: ol.control.defaults().extend([
				new ol.control.FullScreen({
					source: 'fullscreen'
				})
			]), 
		layers: lyrList,
		target: document.getElementById('map'),
		view: new ol.View({
				center: viewInfo['centre'], 
				projection: prj,
				zoom: viewInfo['zoom']
			})
	});
	
	return map
}

function getCentre(viewInfo) {
	/* Determines the centre of the map based on the URL substring's id
	:return: None
	*/
	
	// Get the URL substring
	var locVal = location.search.substring(1);
	
	// If the URL substring as 'id'
	if (locVal != "" && locVal.indexOf("id") == -1) {
		// Get the 'id' passed in from the URL
		queryString = location.search.substring(1);
		// Set the coordinates
		coordinates = queryString.split('/');
		// Set the zoom level
		viewInfo['zoom'] = parseInt(coordinates[0].replace('map=', ''));
		// Set the centre
		viewInfo['centre'] = coordinates[1].split(',').map(function(item) {
			return parseFloat(item);
		});
		// Set the rotation
		viewInfo['rotation'] = parseInt(coordinates[2]);
	}
	
	return viewInfo;
}

function getFeature(coord, mapLyrs, lyrDict) {
	/* Gets a feature at the specified coordinates.
	:param coord: The coordinates where the feature is located.
	:return: The feature at the specified coordinates.
	*/
	
	// Go through each layer in the lyr_dict and return a feature if it's 
	//		found at the specified coordinates
	for (var key in lyrDict) {
		//var lyr = getLayer(key);
		var lyr = getLyr(mapLyrs, key);
		var lyrSrc = lyr.getSource();
		var features = lyrSrc.getFeaturesAtCoordinate(coord);
		if (features.length > 0) {
			return features[0];
		}
	}
	
}

function getLyr(lyrList, lyrName) {
	//for (lyr of lyrList) {
	if (lyrList instanceof Array) {
		lyrLength = lyrList.length;
		isArray = true;
	} else {
		lyrLength = lyrList.getLength();
		isArray = false;
	}
	for (i = 0; i < lyrLength; i++) {
		if (isArray) {
			lyr = lyrList[i];
		} else {
			lyr = lyrList.item(i);
		}
		curLyrName = lyr.get('name');
		if (curLyrName == lyrName) {
			var foundLyr = lyr
		}
	}
	
	return foundLyr
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
	
	// Open the popup_html.txt file
	xhttp.open("GET", "../files/popup_html.txt", false);
	xhttp.send();
	
	// Get the contents of the file
	outContent = xhttp.responseText;
	
	return outContent;
}

var prevHighlight;

function highlightFeature(pixel) { //, overlayList) {
	/* Highlights a feature that is located at pixel.
	*/
	
	// Locate the feature at the pixel location
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	
	// Locate the layer of the feature at the pixel location
	var lyr = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return layer;
	});
	
	if (typeof showToolTip === 'function') {
		showToolTip(pixel, feature, lyr);
	}
	
	// Highlight the proper feature using the various feature overlay layers
	if (lyr) {
		lyrName = lyr.get('name');
		featOverlay = getLyr(map.getOverlays(), lyrName + "_overlay");
		
		// If the layer is buildings
		if (feature !== prevHighlight) {
			// If feature and prevHighlight are not the same
			//		meaning if the feature the cursor is over has changed
			//		from the previous highlighted feature
			if (featOverlay.getSource().getFeatures().length > 0) {
				// If there are any highlighted building features in the 
				//		featureOverlay, remove them
				featOverlay.getSource().removeFeature(prevHighlight);
				prevHighlight = null;
			}
			if (prevHighlight) {
				// If there are any highlighted rails features in the 
				//		featRailOverlay, remove them
				if (featOverlay.getSource().getFeatures().length > 0) {
					featOverlay.getSource().removeFeature(prevHighlight);
				}
			}
			if (feature) {
				// Add the feature to featureOverlay
				featOverlay.getSource().addFeature(feature);
			}
			// Set prevHighlight to the feature to keep track of what feature
			//		if currently highlighted
			prevHighlight = feature;
		}
	} else {
		// If no layer provided, remove all previous highlights
		if (feature !== prevHighlight) {
			if (prevHighlight) {
				if (featOverlay.getSource().getFeatures().length > 0) {
					featOverlay.getSource().removeFeature(prevHighlight);
					prevHighlight = null;
				}
			}
		}
	}
}

function displayPopup(evt, pixel) {
	/* Displays the popup for a feature at pixel
	*/
	
	// Lock the web page
	POPUP_LOCK = true;
	
	var features = [];
	
	// Check for mobile device
	if (detectmob) {
		// If mobile device, using the getFeature function
		var feature = getFeature(pixel, lyrList, lyrDict);
		features.push(feature);
	} else {
		// Otherwise, use forEachFeatureAtPixel map function
		map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			features.push(feature);
		}, null);
	}
	
	// If features were found at pixel location
	if (features.length > 0) {
		// Get the element from the popup overlay
		var elementPop = popup.getElement();
		
		// Set the feature to the first feature found
		feature = features[0];
		
		if (feature) {
			//if (layer.get('name') != 'rails') {
			
			// Get the feature's properties
			var properties = feature.getProperties();
			
			// Set the feature's style to highlighted
			/* var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
			if(typeof tmpstyle !== 'undefined'){
				feature.setStyle(tmpstyle[1]);
			} else {
				feature.setStyle(styles['undefined'][0]);
			}; */
			
			// Set the popup's position to the event's coordinates
			popup.setPosition(evt.coordinate);
			
			// Set the view to the building location
			var viewTmp = map.getView();
			var featId = feature.getId();
			
			setHighlight(featId);
			
			// Open the popup for the feature
			getPopup(feature);
			
			// Return the found feature
			return feature;
		} else {
			// If the feature is undefined at pixel location
			// Destroy the element's popover
			$(elementPop).popover('destroy');
		}
	} else {
		// If there are no features at pixel location
		
		// Get the element from the popup overlay
		var elementPop = popup.getElement();
		
		// Destroy the element's popover
		$(elementPop).popover('destroy');
		
		// Get the popup HTML content
		popupHTML = '';
		popupHTML = getPopupContent();
		
		// Get the feature ID from the popup element's content
		var featId = $(elementPop).data('fid');
		
	};
	
	// Unlock the page
	POPUP_LOCK = false;
	
	// Return the feature style back to normal
	setHighlight(featId);
	
	// Hide the tool tip
	$('#info').tooltip('hide');
}

function setVisible(lyrList) {
	// Set Bing Maps layer visible on load
	var osmRad = document.getElementById('osm');
	
	for (i = 0; i < lyrList.length; i++) {
		lyr = lyrList[i]
		lyrName = lyr.get('name');
		if (lyrName == 'bingMap') {
			lyr.setVisible(false);
		}
		if (lyrName == 'osm') {
			lyr.setVisible(true);
		}
	}
	
	osmRad.click();
}

function addPointerMove(inMap) { //, overlayList) {
	// Change mouse cursor when over feature
	inMap.on('pointermove', function(e) {
		var pixel = inMap.getEventPixel(e.originalEvent);
		highlightFeature(pixel); //, overlayList);
		var hit = inMap.hasFeatureAtPixel(pixel);
		inMap.getTarget().style.cursor = hit ? 'pointer' : '';
	});
	
	return inMap;
}

function refreshLayers() {
	/* Sets the 2 base layers to visible or not based on which input
		button is clicked on the map page.
		NOTE: Method is called only from the base layer input buttons.
	:return: None
	*/
	
	// Get the first button in the 'checked' list of the input buttons
	var check_rad = $("input[name='base_layer']:checked")[0].id;
	
	// Make all layers invisible except the checked one
	var totalLayers = map.getLayers().getLength();
	for (i = 0; i < 2; i++) {
		var lyr_name = map.getLayers().item(i).get('name')
		if (lyr_name == check_rad) {
			map.getLayers().item(i).setVisible(true);
		} else {
			map.getLayers().item(i).setVisible(false);
		}
	}
};