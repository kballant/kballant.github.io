/* author:		Kevin Ballantyne
	updated:		20190112
	version:		1.0
*/

//var closer = document.getElementById('popup-closer');

// Determines whether the page will be locked or not
var POPUP_LOCK = false;

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

function change_size(size) {
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

function create_style(feature) {
	
	var out_style = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'rgba(0,0,0,0.7)',
							width: 2
						}),
						fill: new ol.style.Fill({
							color: fillFeature(feature)
						})
					})
	return out_style
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

// Popup Methods

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

function create_style(feature, width) {
	
	var out_style = new ol.style.Style({
						stroke: new ol.style.Stroke({
							//color: '#FFA24B',
							color: fillFeature(feature),
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
	return out_style
}

function fillFeature(feature) {
	/* Gets the colour for the style based on the owner attribute
	:param feature: A feature object.
	*/
	
	var owner = feature.getProperties()['OWNER'];
	
	switch(owner) {
		case 'Canadian National Railways':
			colour = 'rgba(220,0,0,0.5)'
			break;
		case 'Canadian Pacific Railways':
			colour = 'rgba(149,62,0,0.5)'
			break;
		case 'New York Central Railway':
			colour = 'rgba(0,0,200,0.5)'
			break;
		case 'Ottawa Terminal Railway':
			colour = 'rgba(255,95,0,0.5)'
			break;
		default:
			window.alert(owner);
			colour = 'rgba(255,255,255,0.5)'
	}
	
	return colour
}

function resizePopup(img) {
	/* Resizes the popup based on the input image.
		NOTE: This method is no longer used.
	*/ 

	height = img.height;
	width = img.width;
	map_popup = document.getElementById('inline_content').style;
	alert(map_popup.cssText);
	popup_height = map_popup.style.height;
	
	alert("height: " + height + ", width: " + width + ", popup_height: " + popup_height);
}

function styleFunction(feature, resolution) {
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

function getPopupContent() {
	/* Gets the HTML text for the popup from a text file.
	:return: The HTML text for the popup.
	*/

	// Set the xhttp object
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			out_content = xhttp.responseText;
			return out_content;
		}
	};
	
	// Open the popup_html.txt file
	xhttp.open("GET", "../files/popup_html.txt", false);
	xhttp.send();
	
	// Get the contents of the file
	out_content = xhttp.responseText;
	
	return out_content;
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
	
	setHighlight(featId);
	
	// Hide the info tooltip
	info.tooltip('hide');
	
	// Call the showPopup function in popup.js
	showPopup(props, featId);
}

// Map Methods

function get_centre() {
	/* Determines the centre of the map based on the URL substring's id
	:return: None
	*/
	
	// Get the URL substring
	var loc_val = location.search.substring(1);
	
	// If the URL substring as 'id'
	if (loc_val != "" && loc_val.indexOf("id") == -1) {
		// Get the 'id' passed in from the URL
		queryString = location.search.substring(1);
		// Set the coordinates
		coordinates = queryString.split('/');
		// Set the zoom level
		zoom = parseInt(coordinates[0].replace('map=', ''));
		// Set the centre
		centre = coordinates[1].split(',').map(function(item) {
			return parseFloat(item);
		});
		// Set the rotation
		rotation = parseInt(coordinates[2]);
	}
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
	var total_layers = map.getLayers().getLength();
	for (i = 0; i < 2; i++) {
		var lyr_name = map.getLayers().item(i).get('name')
		if (lyr_name == check_rad) {
			map.getLayers().item(i).setVisible(true);
		} else {
			map.getLayers().item(i).setVisible(false);
		}
	}
};

// #######################################################################

// Set the projection of the map, in this case WGS84 Web Mercator
var projection = ol.proj.get('EPSG:3857');

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
	/* style: [
		/* new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'black',
				lineCap: 'butt',
				width: width + 2
			})
		}), 
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: 'rgba(0,0,255,0.7)',
				width: 1
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
	] */
})

// Set all the layer names
bingLayer.set('name', 'bingmap');
osmLayer.set('name', 'osm');
railLayer.set('name', 'rails');

// Code for no layer groups
// Create a layer list
var lyr_list = [osmLayer, bingLayer, railLayer]//kmlLayer]

//Code for layer groups:
//var lyr_list = [osmLayer, bingLayer, railLayer, kmlLayer]
//var build_lyrs = []
//for (var key in lyr_dict) {
//	build_lyrs.push(lyr_dict[key]);
//}
//var lyr_group = new ol.layer.Group({layers: build_lyrs})
//lyr_list.push(lyr_group);

// ############################################################################

// Set the zoom, centre and rotation of the map
var zoom = 13;
var centre = ol.proj.transform([-75.67824, 45.41501], "EPSG:4326", 
										"EPSG:3857");
var rotation = 0;

// Reset the centre variable based on the URL
get_centre();

// Create the OL map object
var map = new ol.Map({
    layers: lyr_list,
	target: document.getElementById('map'),
    view: new ol.View({
		center: centre, 
        projection: projection,
        zoom: zoom
    })
});

//railLayer.setStyle(styleFunction());

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

// When the Magnific popup is closed
$(document).on("mfpClose", function(event) {

	// Get the popup HTML
	var popup_html = $(".modal-body").html();
	
	// Find the location of the Feature_ID in the popup HTML text
	var start_pos = popup_html.search("Feature_ID");
	var end_pos = popup_html.indexOf("-->", start_pos);
	var sub_str = popup_html.substring(start_pos, end_pos);
	var feat_str = sub_str.split("=")[1];
	
	// Get the feature ID
	var featId = parseInt(feat_str)

	// Call the closePopup in the popup.js with the feature ID
	closePopup(featId);
});

// When the Magnific popup is opened
$(document).on("mfpOpen", function(event) {

	// Get the HTML text for the popup from the modal-body element on the page
	var popup_html = $(".modal-body").html();
	
	// Convert the HTML text to a DOMParser
	parser = new DOMParser();
	htmlDoc = parser.parseFromString(popup_html, "text/html");
	
	// Correct htmlDoc if null
	if (htmlDoc == null) {
		htmlDoc = document.createElement('div');
		htmlDoc.innerHTML = popup_html;
	}
	
	// Get the img element
	img_elements = htmlDoc.getElementsByTagName('img');
	
	// Calculate the width of the image based on the height
	function calculateWidth(img, height) {
		var new_img = document.createElement('img');
		new_img.src = img.src;
		
		if (new_img.naturalWidth) {
			img_height = new_img.naturalHeight;
			img_width = new_img.naturalWidth;
		}
		
		aspect = img_width / img_height;
		
		new_width = height * aspect;
		
		new_width = parseInt(new_width.toString());
		
		return new_width;
	}
	
	// Get the contents of the popup from the page (element 
	//		with id 'inline_content')
	var map_popup = document.getElementById('inline_content');
	
	// Set the width of the popup based on the window size
	if ($(window).width() > 768) {
		map_popup.style.width = "600px";
	} else {
		map_popup.style.width = "100% !important";
	}
});

// Create the feature overlay for highlighting buildings
var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
	map: map,
	source: new ol.source.Vector({
		features: collection,
		useSpatialIndex: false // optional, might improve performance
	}),
	updateWhileAnimating: true, // optional, for instant visual feedback
	updateWhileInteracting: true // optional, for instant visual feedback
});

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

// Get the <div> with id 'popup' from the map page
var element = document.getElementById('popup');

// Create the popup overlay on the map
var popup = new ol.Overlay({
	element: element
});
map.addOverlay(popup);

var buildHighlight;
var railsHighlight;

var highlightFeature = function(pixel) {
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
	
	// The following displays the tooltip at the pixel position
	// Do not show tooltip when popup is showing
	/* if (!POPUP_LOCK) {
	
		// Set the tooltip position based on pixel
		info.css({
			left: pixel[0] + 'px',
			top: (pixel[1] - 15) + 'px'
		});
		
		//feature = feature_list[0];
		//lyr = feature_list[1];
		
		if (feature) {
			if (lyr.get('name') == 'rails') {
				// If the feature's layer is 'rails'
				// Set up the tool tip
				info.tooltip({
					animation: false,
					trigger: 'hover'
				});
				// Modify the CSS 'rails-info' class
				$('.tooltip > .tooltip-inner').removeClass('rails-info').addClass('rails-info');
				
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
				// Modify the CSS 'rails-info' class
				$('.tooltip > .tooltip-inner').removeClass('rails-info');
				
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
		} else {
			// If no feature, hide the tool tip
			info.tooltip('hide');
		}
	} */
	
	/* if (feature !== railsHighlight) {
		if (railsHighlight) {
			featureOverlay.getSource().removeFeature(railsHighlight);
		}
		if (feature) {
			featureOverlay.getSource().addFeature(feature);
		}
		railsHighlight = feature;
	} */

	// Highlight the proper feature using the various feature overlay layers
	if (lyr) {
		if (lyr.get('name') == 'rails') {
			// If the layer is 'rails'
			if (feature !== railsHighlight) {
				// If feature and railsHighlight are not the same
				//		meaning if the feature the cursor is over has changed
				//		from the previous highlighted feature
				if (featureOverlay.getSource().getFeatures().length > 0) {
					// If there are any highlighted building features in the 
					//		featureOverlay, remove them
					featureOverlay.getSource().removeFeature(buildHighlight);
					buildHighlight = null;
				}
				if (railsHighlight) {
					// If there are any highlighted rails features in the 
					//		featRailOverlay, remove them
					if (featRailOverlay.getSource().getFeatures().length > 0) {
						featRailOverlay.getSource().removeFeature(railsHighlight);
					}
				}
				if (feature) {
					// Add the feature to featRailOverlay
					featRailOverlay.getSource().addFeature(feature);
				}
				// Set railsHighlight to the feature to keep track of what feature
				//		if currently highlighted
				railsHighlight = feature;
			}
		} else {
			// If the layer is buildings
			if (feature !== buildHighlight) {
				// If feature and buildHighlight are not the same
				//		meaning if the feature the cursor is over has changed
				//		from the previous highlighted feature
				if (featRailOverlay.getSource().getFeatures().length > 0) {
					// If there are any highlighted building features in the 
					//		featureOverlay, remove them
					featRailOverlay.getSource().removeFeature(railsHighlight);
					railsHighlight = null;
				}
				if (buildHighlight) {
					// If there are any highlighted rails features in the 
					//		featRailOverlay, remove them
					if (featureOverlay.getSource().getFeatures().length > 0) {
						featureOverlay.getSource().removeFeature(buildHighlight);
					}
				}
				if (feature) {
					// Add the feature to featureOverlay
					featureOverlay.getSource().addFeature(feature);
				}
				// Set buildHighlight to the feature to keep track of what feature
				//		if currently highlighted
				buildHighlight = feature;
			}
		}
	} else {
		// If no layer provided, remove all previous highlights
		if (feature !== buildHighlight) {
			if (buildHighlight) {
				if (featureOverlay.getSource().getFeatures().length > 0) {
					featureOverlay.getSource().removeFeature(buildHighlight);
					buildHighlight = null;
				}
			}
		}
		if (feature !== railsHighlight) {
			if (railsHighlight) {
				if (featRailOverlay.getSource().getFeatures().length > 0) {
					featRailOverlay.getSource().removeFeature(railsHighlight);
					railsHighlight = null;
				}
			}
		}
	}
};

var displayPopup = function(evt, pixel) {
	/* Displays the popup for a feature at pixel
	*/
	
	// Lock the web page
	POPUP_LOCK = true;
	
	var features = [];
	
	// Check for mobile device
	if (detectmob) {
		// If mobile device, using the getFeature function
		var feature = getFeature(pixel);
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
		var element_pop = popup.getElement();
		
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
			var view_tmp = map.getView();
			var featId = feature.getId();
			
			setHighlight(featId);
			
			// Open the popup for the feature
			getPopup(feature);
			
			// Return the found feature
			return feature;
		} else {
			// If the feature is undefined at pixel location
			// Destroy the element's popover
			$(element_pop).popover('destroy');
		}
	} else {
		// If there are no features at pixel location
		
		// Get the element from the popup overlay
		var element_pop = popup.getElement();
		
		// Destroy the element's popover
		$(element_pop).popover('destroy');
		
		// Get the popup HTML content
		popup_html = '';
		popup_html = getPopupContent();
		
		// Get the feature ID from the popup element's content
		var featId = $(element_pop).data('fid');
		
	};
	
	// Unlock the page
	POPUP_LOCK = false;
	
	// Return the feature style back to normal
	setHighlight(featId);
	
	// Hide the tool tip
	$('#info').tooltip('hide');
}

// Get the popup HTML content
var popup_html = getPopupContent();

// Display popup on click
map.on('singleclick', function(evt) {
	//var pixel = evt;
	if (detectmob) {
		// If using a mobile device, the location is based on the 
		//		current coordinates
		var coordinates = map.getEventCoordinate(evt.originalEvent);
		//var feature = vectorlayer.getClosestFeatureToCoordinate(coordinates);
		displayPopup(evt, coordinates);
	} else {
		// If not using a mobile device, the location is based on the 
		//		cursor location
		var pixel = map.getEventPixel(evt.originalEvent);
		displayPopup(evt, pixel);
	}
});

// Set Bing Maps layer visible on load
var osmRad = document.getElementById('osm');
bingLayer.setVisible(false);
//kmlLayer.setVisible(false);
osmLayer.setVisible(true);
osmRad.click();

// Change mouse cursor when over feature
map.on('pointermove', function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	highlightFeature(pixel);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});