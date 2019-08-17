/* author:		Kevin Ballantyne
	updated:		20180909
	version:		1.0
*/

//var closer = document.getElementById('popup-closer');

// Determines whether the page will be locked or not
var POPUP_LOCK = false;

// Style Methods

function create_stylemap(rgb_colour) {
	/* Creates a stylemap for the KML
	:param rgb_colour: RGB colour value taken from the CSS
	:return: The stylemap with the specified colour.
	*/
	
	// Change the rgb to rgba to allow for transparency
	var rgba_colour = rgb_colour.replace('rgb', 'rgba')
	
	// Set the style for the building in normal conditions (not highlighted)
	var style_normal = new ol.style.Style({
		fill: new ol.style.Fill({
			color: rgba_colour.replace(')', ', 0.5)')
		}),
		stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		})
    });
    
   //  Set the style for when the building is highlighted
	var style_hl = new ol.style.Style({
		  fill: new ol.style.Fill({
			color: rgba_colour.replace(')', ', 1)')
		  }),
		  stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		  })
		});
		
	// Add both styles to the style map as an array
	var out_map = [style_normal, style_hl]
	
	return out_map
}

function reset_styles(styles) {
	/* Initializes the KML layer of the map and sets the ID for each feature.
	:param styles: A list of stylemaps.
	:return: None
	*/
	
	//Get the source of the KML layer
	// var source = kmlLayer.getSource()
	
	var source = buildingLayer.getSource()
	
	// Create the counter for the 
	var counter = 0
	
	// Set the key as a function to run when the source changes
	var key = source.on('change', function(event) {
		if (source.getState() == 'ready') {
		
			// Removes the 'on change' listener
			//source.unByKey(key); // OL v3
			ol.Observable.unByKey(key);
			
			// Using AJAX, load the KML file
			$.ajax('../files/Ottawa_Bygone_Buildings.geojson').done(function(data) {
				//kmlLayer.getSource().forEachFeature(function(feature) {
				buildingLayer.getSource().forEachFeature(function(feature) {
					// For each feature in the KML file
					
					// Set its ID to the counter
					feature.setId(counter);
					
					// Get the properties of the feature
					var properties = feature.getProperties();
					
					// Get the classification of the feature
					classification = properties['classification']
					
					feature.setStyle(create_style(feature))
					
					// Go through the layer dictionary, find the layer with
					//		name that matches the style_map and add the feature
					//		to the layer
					for (var key in lyr_dict) {
						if (classification == key) {
							lyr_dict[key].getSource().addFeature(feature);
						}
					}
					
					// Increment the counter
					counter++;
				});
			});
		}
	});
};

function styleFunction() {
	/* Sets the style for the road layer based on the map's zoom
	:return: A OL Style object with the colour and width of the road based
				on the zoom.
	*/
	
	// Set the width of the line (road) based on the zoom level
	if (map.getView().getZoom() <= 14) {
		width = 3;
	} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
		width = 6;
	} else {
		width = 10;
	}
	
	// Return the new style for the line
	return [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: 'rgba(255,162,75,0.7)',
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

function fillFeature(feature) {
	/* Gets the colour for the style based on the classification attribute
	:param feature: A feature object.
	*/
	
	var classification = feature.getProperties()['classification'];
	
	switch(classification) {
		case 'residential':
			colour = 'rgba(255,255,0,0.5)'
			break;
		case 'hotel':
			colour = 'rgba(255,163,163,0.5)'
			break;
		case 'mix':
			colour = 'rgba(255,158,0,0.5)'
			break;
		case 'bank':
			colour = 'rgba(138,0,0,0.5)'
			break;
		case 'commercial':
			colour = 'rgba(255,0,0,0.5)'
			break;
		case 'industrial':
			colour = 'rgba(196,32,240,0.5)'
			break;
		case 'institute':
			colour = 'rgba(0,0,255,0.5)'
			break;
		case 'education':
			colour = 'rgba(95,170,255,0.5)'
			break;
		case 'health':
			colour = 'rgba(0,255,255,0.5)'
			break;
		case 'religious':
			colour = 'rgba(0,255,128,0.5)'
			break;
		case 'recreational':
			colour = 'rgba(35,136,0,0.5)'
			break;
		case 'transportation':
			colour = 'rgba(128,128,128,0.5)'
			break;
		default:
			window.alert(classification);
			colour = 'rgba(255,255,255,0.5)'
	}
	
	return colour
}

// Layer Methods

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

function refreshBuildLayers(checkbox) {
	/* Determines the visible layer based on the checkbox.
	:param checkbox: The checkbox which called this method.
	:return: None
	*/


	// For radio button layers
	/* var check_rad = $("input[name='building_layer']:checked")[0].id; */
	
	if (checkbox.id == 'buildings') {
		// If the checkbox id is 'kml'
		// Store the status of the current checkbox
		check_status = checkbox.checked
		// Uncheck all the checkboxes
		uncheck_all();
		// Set the checkbox back to its original status
		checkbox.checked = check_status;
	} else {
		// Uncheck the 'kml' checkbox
		kml_chkbox = getChkbox('buildings');
		kml_chkbox.checked = false;
	}
	
	// Now set the visibility of each layer based on the checkbox statuses
	$('input[type=checkbox]').each(function () {
		cur_lyr = getLayer(this.id);
		if (this.checked) {
			cur_lyr.setVisible(true);
		} else {
			cur_lyr.setVisible(false);
		}
	});
};

function checkRoads() {
	/* Determines whether the roads layer should be visible or not based
		on whether the 'road_layer' input button is checked or not.
		NOTE: Method is called only from the road_layer input buttons.
	:return: None
	*/

	$("input[name='road_layer']").each(function () {
		//var check_roads = $('#roads');
		cur_lyr = getLayer(this.id);
		if (this.checked) {
			cur_lyr.setVisible(true);
		} else {
			cur_lyr.setVisible(false);
		}
	});
}

function getLayer(srch_name) {
	/* Gets the layer object from the map based on a specified
		layer name.
		:param srch_name: The name of the layer to get.
		:return: The layer object.
	*/

	// Get the total number of layers
	var total_layers = map.getLayers().getLength();
	
	// Go through each layer until the layer with the srch_name is found
	for (i = 0; i < total_layers; i++) {
		var lyr_name = map.getLayers().item(i).get('name')
		if (lyr_name == srch_name) {
			return map.getLayers().item(i);
		}
	}
}

function getFeature(coord) {
	/* Gets a feature at the specified coordinates.
	:param coord: The coordinates where the feature is located.
	:return: The feature at the specified coordinates.
	*/
	
	// Go through each layer in the lyr_dict and return a feature if it's 
	//		found at the specified coordinates
	for (var key in lyr_dict) {
		var lyr = getLayer(key);
		var lyr_src = lyr.getSource();
		var features = lyr_src.getFeaturesAtCoordinate(coord);
		if (features.length > 0) {
			return features[0];
		}
	}
	
}

function create_vector_layer(layer_name) {
	/* Creates a new OL vector layer for the map with name layer_name.
	:param layer_name: The name of the new layer.
	:return: The new layer
	*/

	var outLayer = new ol.layer.Vector({
		source: new ol.source.Vector({})
	});
	outLayer.set('name', layer_name);
	
	return outLayer;
}

// Page Methods

function getChkbox(name) {
	/* Gets a checkbox element from the page with a specified ID.
	:param name: The name of the checkbox to locate on the page
	:return: The checkbox element.
	*/
	chkBox = document.getElementById(name);
	return chkBox;
}

function uncheck_all() {
	/* Unchecks all the input checkboxes on the map page. 
	:return: None
	*/

	// Get each checkbox from the page, uncheck them and set all layers
	//		to invisible
	$('input[type=checkbox]').each(function () {
		cur_lyr = getLayer(this.id);
		this.checked = false;
		cur_lyr.setVisible(false);
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

function setHighlight(featId) {
	/* Removes the highlight of the feature with ID featId.
	:param featId: The feature ID.
	:return: None
	*/

	if (typeof featId !== 'undefined'){
		// If featId is defined
		
		// Get the feature with ID featId from the KML layer
		//var feat = kmlLayer.getSource().getFeatureById(featId);
		var feature = buildingLayer.getSource().getFeatureById(featId);
		
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
		
		// Get the properties of the feature
		//var properties = feat.getProperties();
		
		// Get the style of the current feature
		/* var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
		
		// Set the style of the feature to normal (index 0 in the tmpstyle)
		if(typeof tmpstyle !== 'undefined'){
			feat.setStyle(tmpstyle[0]);
		} else {
			feat.setStyle(styles['undefined'][0]);
		}; */
	};
};

function query_by_prop(property, value) {
	/* Gets a feature based on a property with a specified value.
	:param property: The name of the property.
	:param value: The value of the specified property.
	:return: A feature with a specified property and value.
	*/

	// Get a list of all the features in the KML layer
	//var features = kmlLayer.getSource().getFeatures();
	var features = buildingLayer.getSource().getFeatures();
	
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

// Set the info variable
var info = $('#info');

// ############################################################################
//	Set all the styles

// Create the style maps for the layer
// Residential:
var res_colour = $('.res').css("backgroundColor");
var residential_map = create_stylemap(res_colour);
// Mix:
var mix_colour = $('.mix').css("backgroundColor");
var mix_map = create_stylemap(mix_colour);
// Hotel:
var hotel_colour = $('.hotel').css("backgroundColor");
var hotel_map = create_stylemap(hotel_colour);
// Commercial:
var comm_colour = $('.comm').css("backgroundColor");
var comm_map = create_stylemap(comm_colour);
// Bank:
var bank_colour = $('.bank').css("backgroundColor");
var bank_map = create_stylemap(bank_colour);
// Industrial:
var indust_colour = $('.indust').css("backgroundColor");
var industrial_map = create_stylemap(indust_colour);
// Institute:
var inst_colour = $('.inst').css("backgroundColor");
var institute_map = create_stylemap(inst_colour);
// Education:
var edu_colour = $('.edu').css("backgroundColor");
var edu_map = create_stylemap(edu_colour);
// Health:
var health_colour = $('.health').css("backgroundColor");
var health_map = create_stylemap(health_colour);
// Religious:
var relig_colour = $('.rel').css("backgroundColor");
var relig_map = create_stylemap(relig_colour);
// Recreational:
var rec_colour = $('.rec').css("backgroundColor");
var rec_map = create_stylemap(rec_colour);
// Transportation:
var trans_colour = $('.trans').css("backgroundColor");
var trans_map = create_stylemap(trans_colour);
// Undefined:
var undef_colour = $('.unknown').css("backgroundColor");
var undef_map = create_stylemap(undef_colour);

// Add the style maps for the styles dictionary
var styles = {"residential_map": residential_map, 
				"mix_map": mix_map, 
				"hotel_map": hotel_map, 
				"comm_map": comm_map, 
				"bank_map": bank_map, 
				"industrial_map": industrial_map, 
				"institute_map": institute_map, 
				"edu_map": edu_map, 
				"health_map": health_map, 
				"relig_map": relig_map, 
				"rec_map": rec_map, 
				"trans_map": trans_map, 
				"undefined": undef_map};

// ############################################################################
// Set all the layers

// Create all building layers
var resLayer = create_vector_layer('residential')
var hotelLayer = create_vector_layer('hotel')
var mixLayer = create_vector_layer('mix')
var bankLayer = create_vector_layer('bank')
var commLayer = create_vector_layer('commercial')
var indLayer = create_vector_layer('industrial')
var instLayer = create_vector_layer('institute')
var eduLayer = create_vector_layer('education')
var healthLayer = create_vector_layer('health')
var relLayer = create_vector_layer('religious')
var recLayer = create_vector_layer('recreational')
var transLayer = create_vector_layer('transportation')
var unknownLayer = create_vector_layer('undefined')

// Add the layer objects to the dictionary
var lyr_dict = {'residential': resLayer, 
				'hotel': hotelLayer,
				'mix': mixLayer,
				'bank': bankLayer,
				'commercial': commLayer,
				'industrial': indLayer,
				'institute': instLayer,
				'education': eduLayer,
				'health': healthLayer,
				'religious': relLayer,
				'recreational': recLayer,
				'transportation': transLayer,
				'undefined': unknownLayer}	
				
/* function styleFunction(feature, resolution) {
	var style;
	var properties = feature.getProperties();
	//var style = feature.getStyle();
	//var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
	var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
	if(typeof tmpstyle !== 'undefined'){
		style = tmpstyle[1];
	} else {
		style = styles['undefined'][1];
	};
	return [style];
}; */

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

// Create the KML layer using the Ottawa_Bygone_Buildings.kml file
/* var kmlLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '../files/Ottawa_Bygone_Buildings.kml',
        format: new ol.format.KML({
			extractStyles: false, 
            //extractAttributes: true
		})
    })
}); */


// Create the roads layer from the 1912_Roads GeoJSON file
var roadLayer = new ol.layer.Vector({
	title: '1912 Roads',
	source: new ol.source.Vector({
		url: '../files/1912_Roads.geojson', 
		format: new ol.format.GeoJSON({
			dataProjection: 'EPSG:4269', featureProjection: 'EPSG:3857'
		})
	}),
	style: [
		/* new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'black',
				lineCap: 'butt',
				width: width + 2
			})
		}), */
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: 'rgba(255,162,75,0.7)',
				width: 3
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
})

// Create the buildings layer from the GeoJSON file
var buildingLayer = new ol.layer.Vector({
	title: 'Bygone Buildings of Ottawa',
	source: new ol.source.Vector({
		url: '../files/Ottawa_Bygone_Buildings.geojson', 
		format: new ol.format.GeoJSON({
			dataProjection: 'EPSG:3857', featureProjection: 'EPSG:3857'
		})
	}),
	/* style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'blue',
			lineDash: [4],
			width: 3
		}),
		fill: new ol.style.Fill({
			color: 'rgba(0, 0, 255, 0.1)'
		})
	}) */
	style: function (feature) {
		return [create_style(feature)]
	}
	/* style: [
		/* new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'black',
				lineCap: 'butt',
				width: width + 2
			})
		}), */
		/*
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: 'rgba(255,162,75,0.7)',
				width: 3
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
roadLayer.set('name', 'roads');
//kmlLayer.set('name', 'kml');
buildingLayer.set('name', 'buildings')

// Code for no layer groups
// Create a layer list
var lyr_list = [osmLayer, bingLayer, roadLayer, buildingLayer]//kmlLayer]

// Add the layer dictionary to the layer list
for (var key in lyr_dict) {
	lyr_list.push(lyr_dict[key]);
}

//Code for layer groups:
//var lyr_list = [osmLayer, bingLayer, roadLayer, kmlLayer]
//var build_lyrs = []
//for (var key in lyr_dict) {
//	build_lyrs.push(lyr_dict[key]);
//}
//var lyr_group = new ol.layer.Group({layers: build_lyrs})
//lyr_list.push(lyr_group);

// ############################################################################

// Set the zoom, centre and rotation of the map
var zoom = 15;
var centre = ol.proj.transform([-75.697840, 45.420619], "EPSG:4326", 
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

roadLayer.setStyle(styleFunction());

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

// Create a style cache dictionary for highlighting roads
var highlightStyleCache = {};

// Create a feature overlay for highlighting roads
var featRoadsOverlay = new ol.layer.Vector({
	source: new ol.source.Vector(),
	map: map,
	style: function(feature, resolution) {
		if (map.getView().getZoom() <= 14) {
			width = 2;
		} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
			width = 5;
		} else {
			width = 9;
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

// Reset all the styles
reset_styles(styles);

var buildHighlight;
var roadHighlight;

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
	if (!POPUP_LOCK) {
	
		// Set the tooltip position based on pixel
		info.css({
			left: pixel[0] + 'px',
			top: (pixel[1] - 15) + 'px'
		});
		
		//feature = feature_list[0];
		//lyr = feature_list[1];
		
		if (feature) {
			if (lyr.get('name') == 'roads') {
				// If the feature's layer is 'roads'
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
		} else {
			// If no feature, hide the tool tip
			info.tooltip('hide');
		}
	}
	
	/* if (feature !== roadHighlight) {
		if (roadHighlight) {
			featureOverlay.getSource().removeFeature(roadHighlight);
		}
		if (feature) {
			featureOverlay.getSource().addFeature(feature);
		}
		roadHighlight = feature;
	} */

	// Highlight the proper feature using the various feature overlay layers
	if (lyr) {
		if (lyr.get('name') == 'roads') {
			// If the layer is 'roads'
			if (feature !== roadHighlight) {
				// If feature and roadHighlight are not the same
				//		meaning if the feature the cursor is over has changed
				//		from the previous highlighted feature
				if (featureOverlay.getSource().getFeatures().length > 0) {
					// If there are any highlighted building features in the 
					//		featureOverlay, remove them
					featureOverlay.getSource().removeFeature(buildHighlight);
					buildHighlight = null;
				}
				if (roadHighlight) {
					// If there are any highlighted road features in the 
					//		featRoadsOverlay, remove them
					if (featRoadsOverlay.getSource().getFeatures().length > 0) {
						featRoadsOverlay.getSource().removeFeature(roadHighlight);
					}
				}
				if (feature) {
					// Add the feature to featRoadsOverlay
					featRoadsOverlay.getSource().addFeature(feature);
				}
				// Set roadHighlight to the feature to keep track of what feature
				//		if currently highlighted
				roadHighlight = feature;
			}
		} else {
			// If the layer is buildings
			if (feature !== buildHighlight) {
				// If feature and buildHighlight are not the same
				//		meaning if the feature the cursor is over has changed
				//		from the previous highlighted feature
				if (featRoadsOverlay.getSource().getFeatures().length > 0) {
					// If there are any highlighted building features in the 
					//		featureOverlay, remove them
					featRoadsOverlay.getSource().removeFeature(roadHighlight);
					roadHighlight = null;
				}
				if (buildHighlight) {
					// If there are any highlighted road features in the 
					//		featRoadsOverlay, remove them
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
		if (feature !== roadHighlight) {
			if (roadHighlight) {
				if (featRoadsOverlay.getSource().getFeatures().length > 0) {
					featRoadsOverlay.getSource().removeFeature(roadHighlight);
					roadHighlight = null;
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
			//if (layer.get('name') != 'roads') {
			
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

// Set the building layer radio button
var buildingRad = document.getElementById('buildings');
buildingRad.click();

// When the KML layer changes
//kmlLayer.getSource().on('change', function(evt){
buildingLayer.getSource().on('change', function(evt){
    var source = evt.target;
    
    // Position and zoom the map based on the URL substring
    if(source.getState() === 'ready'){
		loc_val = location.search.substring(1)
        if (loc_val != "" && loc_val.indexOf("id") > -1) {
			// Get the 'id' passed in from the URL
			queryString = location.search.substring(1);
			id_val = queryString.split('=')[1];
			//alert(id_val);
			if (isNaN(id_val)) {
				cleanURL();
			} else {
				var feat = query_by_prop('id', id_val)
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
});

// Change mouse cursor when over feature
map.on('pointermove', function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	highlightFeature(pixel);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});