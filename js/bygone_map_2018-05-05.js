//var closer = document.getElementById('popup-closer');

var POPUP_LOCK = false;

// Declare of styles:

function create_stylemap(rgb_colour) {
	var rgba_colour = rgb_colour.replace('rgb', 'rgba')
	var style_normal = new ol.style.Style({
		fill: new ol.style.Fill({
			color: rgba_colour.replace(')', ', 0.5)')
		}),
		stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		})
    });
	var style_hl = new ol.style.Style({
		  fill: new ol.style.Fill({
			color: rgba_colour.replace(')', ', 1)')
		  }),
		  stroke: new ol.style.Stroke({
			color: 'black',
			width: 2
		  })
		});
	var out_map = [style_normal, style_hl]
	
	return out_map
}

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
			
// Create all building layers
var resLayer = create_vector_layer('residential')
var hotelLayer = create_vector_layer('hotel')
var mixLayer = create_vector_layer('mix')
var bankLayer = create_vector_layer('bank')
var commLayer = create_vector_layer('comm')
var indLayer = create_vector_layer('industrial')
var instLayer = create_vector_layer('institute')
var eduLayer = create_vector_layer('edu')
var healthLayer = create_vector_layer('health')
var relLayer = create_vector_layer('relig')
var recLayer = create_vector_layer('rec')
var transLayer = create_vector_layer('trans')
var unknownLayer = create_vector_layer('undefined')

var lyr_dict = {'residential': resLayer, 
				'hotel': hotelLayer,
				'mix': mixLayer,
				'bank': bankLayer,
				'comm': commLayer,
				'industrial': indLayer,
				'institute': instLayer,
				'edu': eduLayer,
				'health': healthLayer,
				'relig': relLayer,
				'rec': recLayer,
				'trans': transLayer,
				'undefined': unknownLayer}

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
				
function reset_styles(styles) {
	var source = buildLayer.getSource()
	var counter = 0
	var key = source.on('change', function(event) {
		if (source.getState() == 'ready') {
			//source.unByKey(key); // OL v3
			ol.Observable.unByKey(key);
			$.ajax('../files/Ottawa_Bygone_Buildings.json').done(function(data) {
				buildLayer.getSource().forEachFeature(function(feature) {
					feature.setId(counter);
					var properties = feature.getProperties();
					//var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
					style_map = properties['styleUrl'].split("#")[1]
					var tmpstyle = styles[style_map];
					if(typeof tmpstyle !== 'undefined'){
						feature.setStyle(tmpstyle[0]);
					} else {
						feature.setStyle(styles['undefined'][0]);
					};
					for (var key in lyr_dict) {
						if (style_map == key + '_map') {
							lyr_dict[key].getSource().addFeature(feature);
						}
					}
					counter++;
				});
			});
		}
	});
};

function refreshLayers() {
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

function checkRoads() {
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
	var total_layers = map.getLayers().getLength();
	for (i = 0; i < total_layers; i++) {
		var lyr_name = map.getLayers().item(i).get('name')
		if (lyr_name == srch_name) {
			return map.getLayers().item(i);
		}
	}
}
function getFeature(coord) {
	//var total_layers = map.getLayers().getLength();
	//var vector_layers = map.getLayersByClass("OpenLayers.Layer.Vector")
	//var total_vect_layers = map.getLayers().getLength();
	for (var key in lyr_dict) {
		var lyr = getLayer(key);
		var lyr_src = lyr.getSource();
		var features = lyr_src.getFeaturesAtCoordinate(coord);
		if (features.length > 0) {
			return features[0];
		}
	}
	
}

function getChkbox(name) {
	chkBox = document.getElementById(name);
	return chkBox;
}

function uncheck_all() {
	$('input[type=checkbox]').each(function () {
		cur_lyr = getLayer(this.id);
		this.checked = false;
		cur_lyr.setVisible(false);
	});
}

function refreshBuildLayers(checkbox) {
	// For radio button layers
	/* var check_rad = $("input[name='building_layer']:checked")[0].id; */
	
	if (checkbox.id == 'kml') {
		check_status = checkbox.checked
		uncheck_all();
		checkbox.checked = check_status;
	} else {
		kml_chkbox = getChkbox('kml');
		kml_chkbox.checked = false;
	}
	
	// For checkbox layers
	$('input[type=checkbox]').each(function () {
		cur_lyr = getLayer(this.id);
		if (this.checked) {
			cur_lyr.setVisible(true);
		} else {
			cur_lyr.setVisible(false);
		}
	});
};

var projection = ol.proj.get('EPSG:3857');

var bingLayer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		imagerySet: 'Aerial',
		key: 'AhCYdXJJqvQnyMnREP6yvB8LBqky1iY8k_ZfEZpFpjKC7mXRduWYXfSnV1683P3_'
		//crossOrigin: 'anonymous'
	})
});

var osmSource = new ol.source.OSM();
var osmLayer = new ol.layer.Tile({source: osmSource});

var buildLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '../files/Ottawa_Bygone_Buildings.json',
        format: new ol.format.KML({
			extractStyles: false, 
            //extractAttributes: true
		})
    })
});

function create_vector_layer(layer_name) {
	var outLayer = new ol.layer.Vector({
		source: new ol.source.Vector({})
	});
	outLayer.set('name', layer_name);
	return outLayer;
}

function styleFunction(feature) {
	//var width = 7;
	if (map.getView().getZoom() <= 14) {
		width = 3;
	} else if (map.getView().getZoom() > 14 & map.getView().getZoom() < 16) {
		width = 6;
	} else {
		width = 10;
	}
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

var roadLayer = new ol.layer.Vector({
	title: '1912 Roads',
	source: new ol.source.Vector({
		url: '../files/1912_Roads.geojson',
		projection : 'EPSG:3857',
		format: new ol.format.GeoJSON()
	}),
	style: styleFunction
})

bingLayer.set('name', 'bingmap');
osmLayer.set('name', 'osm');
roadLayer.set('name', 'roads');
buildLayer.set('name', 'kml');

// No layer groups:
var lyr_list = [osmLayer, bingLayer, roadLayer, buildLayer]

for (var key in lyr_dict) {
	lyr_list.push(lyr_dict[key]);
}

var zoom = 15;
var center = ol.proj.transform([-75.697840, 45.420619], "EPSG:4326", "EPSG:3857");
var rotation = 0;

function get_center() {
	var loc_val = location.search.substring(1);
	if (loc_val != "" && loc_val.indexOf("id") == -1) {
		// Get the 'id' passed in from the URL
		queryString = location.search.substring(1);
		coordinates = queryString.split('/');
		zoom = parseInt(coordinates[0].replace('map=', ''));
		center = coordinates[1].split(',').map(function(item) {
			return parseFloat(item);
		});
		rotation = parseInt(coordinates[2]);
	}
}

get_center();

var map = new ol.Map({
    layers: lyr_list,
	target: document.getElementById('map'),
    view: new ol.View({
		center: center, 
        projection: projection,
        zoom: zoom
    })
});

function removeHighlight(featId) {
	if (typeof featId !== 'undefined'){
		var feat = buildLayer.getSource().getFeatureById(featId);
		var properties = feat.getProperties();
		var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
		if(typeof tmpstyle !== 'undefined'){
			feat.setStyle(tmpstyle[0]);
		} else {
			feat.setStyle(styles['undefined'][0]);
		};
	};
};

function query_by_prop(property, value) {
	var features = buildLayer.getSource().getFeatures();
	
	for (var i=0; i<features.length; i++) {
		var feat = features[i];
		var properties = feat.getProperties();
		if (properties[property] == value) {
			return feat;
		}
	}
}

function closePopup(featId) {
	removeHighlight(featId);
	POPUP_LOCK = false;
};

function resizePopup(img) {
	height = img.height;
	width = img.width;
	map_popup = document.getElementById('inline_content').style;
	alert(map_popup.cssText);
	popup_height = map_popup.style.height;
	
	alert("height: " + height + ", width: " + width + ", popup_height: " + popup_height);
}

function getPopupContent() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			out_content = xhttp.responseText;
			return out_content;
		}
	};
	xhttp.open("GET", "../files/popup_html.txt", false);
	xhttp.send();
	out_content = xhttp.responseText;
	return out_content;
}

var info = $('#info');

function resizeGeomatics() {
	$('#geomatics').width($('this').width());
};

$(function(){
    // The document object acts as the 'subscription service' - 
    // it receives all events via bubbling.
    $(document).bind('layout.resizeCheck', function(){
        $('#geomatics').width($('this').width());
    });

    // Whenever you need to update the size:
    $('#logo').trigger('layout.resizeCheck');
});

function cleanURL() {
	if (location.search.indexOf("?") > -1) {
		var clean_url = location.protocol + "//" + location.host + location.pathname;
		window.history.replaceState({}, document.title, clean_url);
	}
}

function change_size(size) {
	var view = map.getView();
	var zoom = view.getZoom();
	var center = view.getCenter();
	var rotation = view.getRotation();
	if (size == "small") {
		window.location.href = './map?map=' + zoom + '/' + center + '/' + rotation;
	} else {
		window.location.href = './map-full?map=' + zoom + '/' + center + '/' + rotation;
	}
}

function getPopup(feature) {
	
	POPUP_LOCK = true;
	
	var props = feature.getProperties();
	var featId = feature.getId();
	
	info.tooltip('hide');
	
	showPopup(props, featId);
}

$(document).on("mfpClose", function(event) {
	var popup_html = $(".modal-body").html();
	
	// Find the location of the Feature_ID:
	var start_pos = popup_html.search("Feature_ID");
	var end_pos = popup_html.indexOf("-->", start_pos);
	var sub_str = popup_html.substring(start_pos, end_pos);
	var feat_str = sub_str.split("=")[1];
	
	var featId = parseInt(feat_str)

	closePopup(featId);
});

$(document).on("mfpOpen", function(event) {
	var popup_html = $(".modal-body").html();
	
	parser = new DOMParser();
	htmlDoc = parser.parseFromString(popup_html, "text/html");
	
	// Correct htmlDoc if null
	if (htmlDoc == null) {
		htmlDoc = document.createElement('div');
		htmlDoc.innerHTML = popup_html;
	}
	
	img_elements = htmlDoc.getElementsByTagName('img');
	
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
	
	var map_popup = document.getElementById('inline_content');
	
	if ($(window).width() > 768) {
	
		map_popup.style.width = "600px";
		
	} else {
		map_popup.style.width = "100% !important";
	}
});

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

var highlightStyleCache = {};

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

var element = document.getElementById('popup');

var popup = new ol.Overlay({
	element: element
});
map.addOverlay(popup);

reset_styles(styles);

var buildHighlight;
var roadHighlight;

var highlightFeature = function(pixel) {
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	
	var lyr = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return layer;
	});
	
	// Do not show tooltip when popup is showing:
	if (!POPUP_LOCK) {
	
		info.css({
			left: pixel[0] + 'px',
			top: (pixel[1] - 15) + 'px'
		});
		
		//feature = feature_list[0];
		//lyr = feature_list[1];
		
		if (feature) {
			if (lyr.get('name') == 'roads') {
				info.tooltip({
					animation: false,
					trigger: 'hover'
				});
				$('.tooltip > .tooltip-inner').removeClass('road-info').addClass('road-info');
				var toolname = $('<div>').html(feature.get('NAME')).html().replace(/&amp;/g, '&');
				info.tooltip('hide')
					//.attr('data-original-title', feature.get('name'))
					.attr('data-original-title', toolname)
					.tooltip('fixTitle')
					.tooltip('show');
			} else {
				info.tooltip({
					animation: false,
					trigger: 'hover'
				});
				$('.tooltip > .tooltip-inner').removeClass('road-info');
				var toolname = $('<div>').html(feature.get('name')).html().replace(/&amp;/g, '&');
				info.tooltip('hide')
					//.attr('data-original-title', feature.get('name'))
					.attr('data-original-title', toolname)
					.tooltip('fixTitle')
					.tooltip('show');
			}
		} else {
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

	if (lyr) {
		if (lyr.get('name') == 'roads') {
			if (feature !== roadHighlight) {
				if (featureOverlay.getSource().getFeatures().length > 0) {
					featureOverlay.getSource().removeFeature(buildHighlight);
					buildHighlight = null;
				}
				if (roadHighlight) {
					if (featRoadsOverlay.getSource().getFeatures().length > 0) {
						featRoadsOverlay.getSource().removeFeature(roadHighlight);
					}
				}
				if (feature) {
					featRoadsOverlay.getSource().addFeature(feature);
				}
				roadHighlight = feature;
			}
		} else {
			if (feature !== buildHighlight) {
				if (featRoadsOverlay.getSource().getFeatures().length > 0) {
					featRoadsOverlay.getSource().removeFeature(roadHighlight);
					roadHighlight = null;
				}
				if (buildHighlight) {
					if (featureOverlay.getSource().getFeatures().length > 0) {
						featureOverlay.getSource().removeFeature(buildHighlight);
					}
				}
				if (feature) {
					featureOverlay.getSource().addFeature(feature);
				}
				buildHighlight = feature;
			}
		}
	} else {
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
	POPUP_LOCK = true;
	var features = [];
	if (detectmob) {
		var feature = getFeature(pixel);
		features.push(feature);
	} else {
		map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			features.push(feature);
		}, null);
	}
	
	if (features.length > 0) {
		var element_pop = popup.getElement();
		feature = features[0];
		if (feature) {
			//if (layer.get('name') != 'roads') {
			var properties = feature.getProperties();
			var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
			if(typeof tmpstyle !== 'undefined'){
				feature.setStyle(tmpstyle[1]);
			} else {
				feature.setStyle(styles['undefined'][0]);
			};
			popup.setPosition(evt.coordinate);
			// Set the view to the building location:
			var view_tmp = map.getView();
			var featId = feature.getId();
			getPopup(feature);
			return feature;
		} else {
			$(element_pop).popover('destroy');
		}
	} else {
		var element_pop = popup.getElement();
		$(element_pop).popover('destroy');
		popup_html = '';
		popup_html = getPopupContent();
		var featId = $(element_pop).data('fid'); 
		removeHighlight(featId);
	};
	POPUP_LOCK = false;
	$('#info').tooltip('hide');
}

function detectmob() {
	if(window.innerWidth <= 800 && window.innerHeight <= 600) {
		return true;
	} else {
		return false;
	}
}

var popup_html = getPopupContent();

// display popup on click
map.on('singleclick', function(evt) {
	//var pixel = evt;
	if (detectmob) {
		var coordinates = map.getEventCoordinate(evt.originalEvent);
		//var feature = vectorlayer.getClosestFeatureToCoordinate(coordinates);
		displayPopup(evt, coordinates);
	} else {
		var pixel = map.getEventPixel(evt.originalEvent);
		displayPopup(evt, pixel);
	}
});

// Set Bing Maps layer visible on load:
var osmRad = document.getElementById('osm');
bingLayer.setVisible(false);
//buildLayer.setVisible(false);
osmLayer.setVisible(true);
osmRad.click();

// Set the building layer radio button:
var kmlRad = document.getElementById('kml');
kmlRad.click();

buildLayer.getSource().on('change', function(evt){
    var source = evt.target;
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

// change mouse cursor when over marker
map.on('pointermove', function(e) {
	var pixel = map.getEventPixel(e.originalEvent);
	highlightFeature(pixel);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});