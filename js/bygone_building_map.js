/* author:		Kevin Ballantyne
	updated:		20180909
	version:		1.0
*/

//var closer = document.getElementById('popup-closer');

// Style Methods

function createStylemap(rgbColour) {
	/* Creates a stylemap for the KML
	:param rgbColour: RGB colour value taken from the CSS
	:return: The stylemap with the specified colour.
	*/
	
	// Change the rgb to rgba to allow for transparency
	var rgbaColour = rgbColour.replace('rgb', 'rgba')
	
	// Set the style for the building in normal conditions (not highlighted)
	var styleNormal = new ol.style.Style({
		fill: new ol.style.Fill({
			color: rgbaColour.replace(')', ', 0.5)')
		}),
		stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		})
    });
    
   //  Set the style for when the building is highlighted
	var styleHl = new ol.style.Style({
		  fill: new ol.style.Fill({
			color: rgbaColour.replace(')', ', 1)')
		  }),
		  stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		  })
		});
		
	// Add both styles to the style map as an array
	var outMap = [styleNormal, styleHl]
	
	return outMap
}

function resetStyles(lyrList, styles) {
	/* Initializes the KML layer of the map and sets the ID for each feature.
	:param styles: A list of stylemaps.
	:return: None
	*/
	
	//Get the source of the KML layer
	// var source = kmlLayer.getSource()
	
	buildingLayer = getLyr(lyrList, 'buildings');
	
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
			$.ajax('../../files/Ottawa_Bygone_Buildings.geojson').done(function(data) {
				//kmlLayer.getSource().forEachFeature(function(feature) {
				buildingLayer.getSource().forEachFeature(function(feature) {
					// For each feature in the KML file
					
					// Set its ID to the counter
					feature.setId(counter);
					
					// Get the properties of the feature
					var properties = feature.getProperties();
					
					// Get the classification of the feature
					classification = properties['classification']
					
					feature.setStyle(createStyle(feature))
					
					// Go through the layer dictionary, find the layer with
					//		name that matches the style_map and add the feature
					//		to the layer
					for (var key in lyrDict) {
						if (classification == key) {
							lyrDict[key].getSource().addFeature(feature);
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
	var checkRad = $("input[name='base_layer']:checked")[0].id;
	
	// Make all layers invisible except the checked one
	var totalLayers = map.getLayers().getLength();
	for (i = 0; i < 2; i++) {
		var lyrName = map.getLayers().item(i).get('name')
		if (lyrName == checkRad) {
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
		checkStatus = checkbox.checked
		// Uncheck all the checkboxes
		uncheckAll(lyrList);
		// Set the checkbox back to its original status
		checkbox.checked = checkStatus;
	} else {
		// Uncheck the 'kml' checkbox
		kmlChkbox = getChkbox('buildings');
		kmlChkbox.checked = false;
	}
	
	// Now set the visibility of each layer based on the checkbox statuses
	$('input[type=checkbox]').each(function () {
		//curLyr = getLayer(this.id);
		curLyr = getLyr(lyrList, this.id);
		if (this.checked) {
			curLyr.setVisible(true);
		} else {
			curLyr.setVisible(false);
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
		//curLyr = getLayer(this.id);
		curLyr = getLyr(lyrList, this.id);
		if (this.checked) {
			curLyr.setVisible(true);
		} else {
			curLyr.setVisible(false);
		}
	});
}

function createVectorLyr(layerName) {
	/* Creates a new OL vector layer for the map with name layerName.
	:param layerName: The name of the new layer.
	:return: The new layer
	*/

	var outLayer = new ol.layer.Vector({
		source: new ol.source.Vector({})
	});
	outLayer.set('name', layerName);
	
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

function createStyle(feature) {
	
	var outStyle = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: 'rgba(0,0,0,0.7)',
							width: 2
						}),
						fill: new ol.style.Fill({
							color: fillFeature(feature)
						})
					})
	return outStyle
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

function resizePopup(mapPopup) {
	if ($(window).width() > 768) {
		mapPopup.style.width = "600px";
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
	
	// Open the popup_html.txt file
	xhttp.open("GET", "../../files/building_popup_html.txt", false);
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
	
	setHighlight(featId);
	
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
			}
		} else {
			// If no feature, hide the tool tip
			info.tooltip('hide');
		}
	}
}

// Set the info variable
var info = $('#info');

// ############################################################################
//	Set all the styles

// Create the style maps for the layer
// Residential:
var resColour = $('.res').css("backgroundColor");
var residentialMap = createStylemap(resColour);
// Mix:
var mixColour = $('.mix').css("backgroundColor");
var mixMap = createStylemap(mixColour);
// Hotel:
var hotelColour = $('.hotel').css("backgroundColor");
var hotelMap = createStylemap(hotelColour);
// Commercial:
var commColour = $('.comm').css("backgroundColor");
var commMap = createStylemap(commColour);
// Bank:
var bankColour = $('.bank').css("backgroundColor");
var bankMap = createStylemap(bankColour);
// Industrial:
var industColour = $('.indust').css("backgroundColor");
var industrialMap = createStylemap(industColour);
// Institute:
var instColour = $('.inst').css("backgroundColor");
var instituteMap = createStylemap(instColour);
// Education:
var eduColour = $('.edu').css("backgroundColor");
var eduMap = createStylemap(eduColour);
// Health:
var healthColour = $('.health').css("backgroundColor");
var healthMap = createStylemap(healthColour);
// Religious:
var religColour = $('.rel').css("backgroundColor");
var religMap = createStylemap(religColour);
// Recreational:
var recColour = $('.rec').css("backgroundColor");
var recMap = createStylemap(recColour);
// Transportation:
var transColour = $('.trans').css("backgroundColor");
var transMap = createStylemap(transColour);
// Undefined:
var undefColour = $('.unknown').css("backgroundColor");
var undefMap = createStylemap(undefColour);

// Add the style maps for the styles dictionary
var styles = {"residentialMap": residentialMap, 
				"mixMap": mixMap, 
				"hotelMap": hotelMap, 
				"commMap": commMap, 
				"bankMap": bankMap, 
				"industrialMap": industrialMap, 
				"instituteMap": instituteMap, 
				"eduMap": eduMap, 
				"healthMap": healthMap, 
				"religMap": religMap, 
				"recMap": recMap, 
				"transMap": transMap, 
				"undefined": undefMap};

// ############################################################################
// Set all the layers

// Create all building layers
var resLayer = createVectorLyr('residential')
var hotelLayer = createVectorLyr('hotel')
var mixLayer = createVectorLyr('mix')
var bankLayer = createVectorLyr('bank')
var commLayer = createVectorLyr('commercial')
var indLayer = createVectorLyr('industrial')
var instLayer = createVectorLyr('institute')
var eduLayer = createVectorLyr('education')
var healthLayer = createVectorLyr('health')
var relLayer = createVectorLyr('religious')
var recLayer = createVectorLyr('recreational')
var transLayer = createVectorLyr('transportation')
var unknownLayer = createVectorLyr('undefined')

// Add the layer objects to the dictionary
var lyrDict = {'residential': resLayer, 
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

// Add all the base layers
lyrList = addBaseLayers()

// Add the railways layer
var roadOpts = {};
roadOpts['Name'] = 'roads'
roadOpts['Title'] = '1912 Roads'
roadOpts['URL'] = '../../files/1912_Roads.geojson', 
roadOpts['dataProj'] = 'EPSG:4269'
roadOpts['featProj'] = 'EPSG:3857'

var roadStyleFunc = [
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

// Add the roads layer
lyrList = addLayer(roadOpts, lyrList, roadStyleFunc);

// Add the railways layer
var buildOpts = {};
buildOpts['Name'] = 'buildings'
buildOpts['Title'] = 'Bygone Buildings of Ottawa'
buildOpts['URL'] = '../../files/Ottawa_Bygone_Buildings.geojson', 
buildOpts['dataProj'] = 'EPSG:3857'
buildOpts['featProj'] = 'EPSG:3857'

var buildStyleFunc = function (feature) {
						return [createStyle(feature)]
					}

// Add the buildings layer
lyrList = addLayer(buildOpts, lyrList, buildStyleFunc);

// Add the layer dictionary to the layer list
for (var key in lyrDict) {
	lyrList.push(lyrDict[key]);
}

// Set the zoom, centre and rotation of the map
var viewInfo = {};
viewInfo['zoom'] = 13;
viewInfo['centre'] = ol.proj.transform([-75.67824, 45.41501], "EPSG:4326", "EPSG:3857");
viewInfo['rotation'] = 0;

// Reset the centre variable based on the URL
viewInfo = getCentre(viewInfo);

// Create the map
map = createMap(lyrList, viewInfo);

//railLayer.setStyle(styleFunction());

bindResize();

// Bind the popup close
bindClose();

// Bind the popup open
bindOpen();

// Create the feature overlay for highlighting buildings
var collection = new ol.Collection();
var buildOverlay = new ol.layer.Vector({
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
map.addOverlay(buildOverlay);

// Add roads overlay for highlighting
widths = [2, 5, 9]
featRoadsOverlay = addFeatOverlay(map, 'roads_overlay', widths);
map.addOverlay(featRoadsOverlay);
//featOverlays.push(featRoadsOverlay);

// Add the popup
map, popup = addPopup(map);

// Reset all the styles
resetStyles(lyrList, styles);

// Set the building layer radio button
var buildingRad = document.getElementById('buildings');
buildingRad.click();

// When the KML layer changes
//kmlLayer.getSource().on('change', function(evt){
buildingLayer.getSource().on('change', function(evt){
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
});

// Add the click event to the map
map = addSingleClick(map, true);

// Set the layers visible
setVisible(lyrList);

// Add mouse move event to the map
map = addPointerMove(map);
