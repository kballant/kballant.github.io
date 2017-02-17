//var closer = document.getElementById('popup-closer');

var POPUP_LOCK = false;

// Declare of styles:

function create_stylemap(rgb_color) {
	var style_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(' + rgb_color + ',0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
	var style_hl = new ol.style.Style({
		  fill: new ol.style.Fill({
			color: 'rgba(' + rgb_color + ',1)'
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
var residential_map = create_stylemap('255,255,0')
// Hotel:
var hotel_map = create_stylemap('255,128,0')
// Commercial:
var comm_map = create_stylemap('255,0,0')
// Industrial:
var industrial_map = create_stylemap('160,32,240')
// Institute:
var institute_map = create_stylemap('0,0,255')
// Health:
var health_map = create_stylemap('51,204,255')
// Religious:
var relig_map = create_stylemap('47,204,79')
// Recreational:
var rec_map = create_stylemap('0,255,0')
// Transportation:
var trans_map = create_stylemap('128,128,128')
// Undefined:
var undef_map = create_stylemap('255,255,255')
			
// Create all building layers
var resLayer = create_vector_layer('residential')
var hotelLayer = create_vector_layer('hotel')
var commLayer = create_vector_layer('comm')
var indLayer = create_vector_layer('industrial')
var instLayer = create_vector_layer('institute')
var healthLayer = create_vector_layer('health')
var relLayer = create_vector_layer('relig')
var recLayer = create_vector_layer('rec')
var transLayer = create_vector_layer('trans')
var unknownLayer = create_vector_layer('undefined')

var lyr_dict = {'residential': resLayer, 
				'hotel': hotelLayer,
				'comm': commLayer,
				'industrial': indLayer,
				'institute': instLayer,
				'health': healthLayer,
				'relig': relLayer,
				'rec': recLayer,
				'trans': transLayer,
				'undefined': unknownLayer}

var styles = {"residential_map": residential_map, 
				"hotel_map": hotel_map, 
				"comm_map": comm_map, 
				"industrial_map": industrial_map, 
				"institute_map": institute_map, 
				"health_map": health_map, 
				"relig_map": relig_map, 
				"rec_map": rec_map, 
				"trans_map": trans_map, 
				"undefined": undef_map};

/* kmlLayer.getSource().forEachFeature(function(feature) {
	feature.setId(counter);
	var properties = feature.getProperties();
	//var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
	var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
	// if(typeof tmpstyle !== 'undefined'){
		// feature.setStyle(tmpstyle[0]);
	// } else {
		// feature.setStyle(styles['undefined'][0]);
	// };
	
	resLayer.getSource().addFeature(feature);
	counter++;
});		 */		
				
function reset_styles(styles) {
	var source = kmlLayer.getSource()
	var counter = 0
	var key = source.on('change', function(event) {
		if (source.getState() == 'ready') {
			source.unByKey(key);
			$.ajax('../files/Ottawa_Bygone_Buildings.kml').done(function(data) {
				kmlLayer.getSource().forEachFeature(function(feature) {
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
					//window.alert(tmpstyle[0]);
					/* switch(style_map) {
						case 'residential_map':
							resLayer.getSource().addFeature(feature);
							break;
						case 'hotel_map':
							hotelLayer.getSource().addFeature(feature);
							break;
						case 'comm_map':
							commLayer.getSource().addFeature(feature);
							break;
						case 'industrial_map':
							indLayer.getSource().addFeature(feature);
							break;
						case 'institute_map':
							instLayer.getSource().addFeature(feature);
							break;
						case 'health_map':
							healthLayer.getSource().addFeature(feature);
							break;
						case 'relig_map':
							relLayer.getSource().addFeature(feature);
							break;
						case 'rec_map':
							recLayer.getSource().addFeature(feature);
							break;
						case 'trans_map':
							transLayer.getSource().addFeature(feature);
							break;
						case 'undefined':
							unknownLayer.getSource().addFeature(feature);
							break;
					} */
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
				
function styleFunction(feature, resolution) {
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

function getLayer(srch_name) {
	var total_layers = map.getLayers().getLength();
	for (i = 0; i < total_layers; i++) {
		var lyr_name = map.getLayers().item(i).get('name')
		if (lyr_name == srch_name) {
			return map.getLayers().item(i);
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
	/* var check_rad = $("input[name='building_layer']:checked")[0].id;
	
	// Make all layers invisible except the checked one
	var total_layers = map.getLayers().getLength();
	for (i = 2; i < total_layers; i++) {
		var lyr_name = map.getLayers().item(i).get('name')
		if (lyr_name == check_rad) {
			map.getLayers().item(i).setVisible(true);
		}
	} */
	
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

//window.alert(bing_src.getProjection().getCode());

var kmlLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '../files/Ottawa_Bygone_Buildings.kml',
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

bingLayer.set('name', 'bingmap');
osmLayer.set('name', 'osm');
kmlLayer.set('name', 'kml');

//window.alert(kmlLayer.getSource().getExtent());

var lyr_list = [osmLayer, bingLayer, kmlLayer]

for (var key in lyr_dict) {
	lyr_list.push(lyr_dict[key]);
}

var map = new ol.Map({
    layers: lyr_list,
    //target: document.getElementById('map'),
	target: document.getElementById('map'),
    view: new ol.View({
        //center: [-8426422.45316044, 5688395.36969644],
		center:ol.proj.transform([-75.697840, 45.420619], "EPSG:4326", "EPSG:3857"), 
        projection: projection,
        zoom: 15
    })
});

function removeHighlight(featId) {
	var feat = kmlLayer.getSource().getFeatureById(featId);
	var properties = feat.getProperties();
	//var style = feat.getStyle();
	//var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
	var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
	if(typeof tmpstyle !== 'undefined'){
		feat.setStyle(tmpstyle[0]);
	} else {
		feat.setStyle(styles['undefined'][0]);
	};
};

function closePopup(featId) {
	//removeHighlight($(feature));
	//var feature = kmlLayer.getSource().getFeatureById(featId);
	//$(elem).popover("hide");
	removeHighlight(featId);
	POPUP_LOCK = false;
};

function resizePopup(img) {
	//alert("Made it resizePopup()");
	//alert(img);
	height = img.height;
	width = img.width;
	map_popup = document.getElementById('inline_content').style;
	alert(map_popup.cssText);
	popup_height = map_popup.style.height;
	
	alert("height: " + height + ", width: " + width + ", popup_height: " + popup_height);
	
	//document.getElementById('map-popup').height;
}

function getPopupContent() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			out_content = xhttp.responseText;
			//alert(out_content);
			return out_content;
		}
	};
	xhttp.open("GET", "../files/popup_html.txt", false);
	xhttp.send();
	out_content = xhttp.responseText;
	//alert(out_content);
	return out_content;
}

function create_photo_html(photos) {
	
	// Bootstrap Carousel:
	var photo_html = `
<div class="container carousel-container">
	<br>
	<div id="photoCarousel" class="carousel slide" data-ride="carousel" data-interval="false">`
		//<!-- Indicators -->
		//<ol class="carousel-indicators">`
	
	// Create the indicators for each image in the carousel
	/*for (var i = 0; i < photos.length; i++) {
		if (i == 0) {
			active_str = ' class="active"';
		} else {
			active_str = '';
		}
		photo_html += `
			<li data-target="#photoCarousel" data-slide-to="${i}"${active_str}></li>`
	}*/
	//photo_html += `
		//</ol>
	photo_html += `
		<!-- Wrapper for slides -->
		<div class="carousel-inner" role="listbox">`
	
	// Create the warppers for each image in the carousel
	for (var i = 0; i < photos.length; i++) {
		caption = photos[i]['caption'];
		link = photos[i]['link'];
		img_src = photos[i]['img_src'];
		date_taken = photos[i]['date_taken'].replace('Date Taken: ', '');
		source = photos[i]['source'].replace('Source: ', '');
		if (i == 0) {
			active_str = ' active';
		} else {
			active_str = '';
		}
		photo_html += `
			<div class="item${active_str} carousel-item">
				<a target="_blank" href="${link}">
					<img class="carousel-img" src="${img_src}" alt="">
				</a>
				<div class="carousel-caption">
					<p class="carousel-caption-txt">${caption}</p>
					<p class="carousel-text-sm">Date Taken: ${date_taken}</p>
					<p class="carousel-text-sm">Source: ${source}</p>
				</div>
			</div>`
	}
	
	photo_html += `
		</div>
		
		<!-- Left and right controls -->`
	
	// Create the left and right arrows for the carousel if more than one image
	if (photos.length > 1) {
		photo_html += `
		<a class="left carousel-control" href="#photoCarousel" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#photoCarousel" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>`
	}
	
	// Create thumbnails for carousel
	
	photo_html += `
		<ul class="thumbnails-carousel clearfix">`
	
	for (var i = 0; i < photos.length; i++) {
		img_src = photos[i]['img_src'];
		photo_html += `
			<li><img class="tn" src="${img_src}" alt=""></li>`
	}
	
	photo_html += `
		</ul>
	</div>
</div>`

	return photo_html;
}

var info = $('#info');

function checkInput(in_text) {
	if (in_text) {
		return in_text;
	} else {
		return "n/a";
	}
}

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

function showPopup(feature, layer) {
	POPUP_LOCK = true;
	
	var props = feature.getProperties();
	var featId = feature.getId();
	
	info.tooltip('hide');

	$(".modal-title").html(props['name']).text();

	popup_html = getPopupContent();
	popup_html = popup_html.replace('${dateBuilt}', checkInput(props['dateBuilt']));
	popup_html = popup_html.replace('${dateDemolished}', checkInput(props['dateDemolished']));
	popup_html = popup_html.replace('${status}', checkInput(props['status']));
	popup_html = popup_html.replace('${history}', checkInput(props['history']));
	popup_html = popup_html.replace('${addrss}', checkInput(props['addrss']));
	popup_html = popup_html.replace('${occupant}', checkInput(props['occupant']));
	
	// Create links for sources:
	/* src_text = props['sources'];
	start_pos = src_text.indexOf("http");
	end_pos = src_text.indexOf("\n", start_pos); */
	sources = checkInput(props['sources']);
	sources = sources.replace(/<a/g, '<a target="_blank" class="popup-a"');
	popup_html = popup_html.replace('${sources}', sources);
	
	// Parse the photos HTML:
	//alert(props['photos']);
	// parsed_html = $.parseHTML(props['photos']);
	// //alert(parsed_html);
	// nodeNames = [];
	// nodeData = [];
	
	// $.each(parsed_html, function(i, el) {
		// //alert(el.nodeName);
		// //alert(el.length);
		// //alert(el.data);
		// nodeNames[i] = el.nodeName;
		// nodeData[i] = el.data;
	// });
	
	photo_html = props['photos'];
	parser = new DOMParser();
	htmlDoc = parser.parseFromString(photo_html, "text/html");
	//td_elements = htmlDoc.getElementsByTagName('td');
	table_elements = htmlDoc.getElementsByTagName('table');
	//a_elements = htmlDoc.getElementsByTagName('a');
	
	//alert(htmlDoc);
	//alert(a_elements);
	// for (var i = 0; i < a_elements.length; i++) {
	//	alert(a_elements[i]);
	// }
	
	// Grab each photo info:
	var photos = [];
	for (var i = 0; i < table_elements.length; i++) {
		//alert('Node Name: ' + table_elements[i].nodeName);
		//alert('Text: ' + table_elements[i].innerText);
		var photo = {};
		child_elements = table_elements[i].children;
		//alert(child_elements);
		for (var j = 0; j < child_elements.length; j++) {
			//alert(child_elements[j].rows);
			table_rows = child_elements[j].rows;
			// Get the caption of the current photo:
			caption = table_rows[0].innerText;
			photo['caption'] = caption;
			//alert('Caption: ' + caption.trim());
			// Get the link of the current photo:
			a_element = table_rows[1].getElementsByTagName('a');
			if (a_element.length == 0) {
				photo['link'] = "";
			} else {
				link = a_element[0].href;
				photo['link'] = link;
			}
			//alert('Link: ' + link.trim());
			// Get the src of the image:
			img_element = table_rows[1].getElementsByTagName('img');
			img_src = img_element[0].src;
			photo['img_src'] = img_src;
			//alert('Src: ' + src);
			// Get the source info and parse:
			source_str = table_rows[2].innerText;
			sources = source_str.trim().split(/\r?\n/).filter(Boolean);
			date_taken = sources[0];
			source = sources[1];
			photo['date_taken'] = date_taken;
			photo['source'] = source;
			//alert('Date Taken: ' + date_taken);
			//alert('Source: ' + source);
			photos.push(photo);
		}
	}
	
	new_ph_html = create_photo_html(photos);
	//alert(new_ph_html);
	
	popup_html = popup_html.replace('${photos}', new_ph_html);
	popup_html += "\n<!--Feature_ID=" + featId.toString() + "-->"
	
	$(".modal-body").html(popup_html);
	
	$(document).trigger("open.wb-lbx", [
		[
			{
				src: "#inline_content",
				type: "inline"
			}
		]
	]);
	
	// Added from website to have proper working thumbnails
	(function(window, $, undefined) {

		var conf = {
			center: true,
			backgroundControl: false
		};

		var cache = {
			$carouselContainer: $('.thumbnails-carousel').parent(),
			$thumbnailsLi: $('.thumbnails-carousel li'),
			$controls: $('.thumbnails-carousel').parent().find('.carousel-control')
		};

		function init() {
			cache.$carouselContainer.find('ol.carousel-indicators').addClass('indicators-fix');
			cache.$thumbnailsLi.first().addClass('active-thumbnail');

			if(!conf.backgroundControl) {
				cache.$carouselContainer.find('.carousel-control').addClass('controls-background-reset');
			}
			else {
				cache.$controls.height(cache.$carouselContainer.find('.carousel-inner').height());
			}

			if(conf.center) {
				cache.$thumbnailsLi.wrapAll("<div class='center clearfix'></div>");
			}
		}

		function refreshOpacities(domEl) {
			cache.$thumbnailsLi.removeClass('active-thumbnail');
			cache.$thumbnailsLi.eq($(domEl).index()).addClass('active-thumbnail');
		}	

		function bindUiActions() {
			cache.$carouselContainer.on('slide.bs.carousel', function(e) {
				refreshOpacities(e.relatedTarget);
			});

			cache.$thumbnailsLi.click(function(){
				cache.$carouselContainer.carousel($(this).index());
			});
		}

		$.fn.thumbnailsCarousel = function(options) {
			conf = $.extend(conf, options);

			init();
			bindUiActions();

			return this;
		}

	})(window, jQuery);

	$('.thumbnails-carousel').thumbnailsCarousel();
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
	
	//alert(popup_html);
	
	parser = new DOMParser();
	htmlDoc = parser.parseFromString(popup_html, "text/html");
	//td_elements = htmlDoc.getElementsByTagName('td');
	img_elements = htmlDoc.getElementsByTagName('img');
	
	//alert(img_elements.length);
	
	function calculateWidth(img, height) {
		img_height = img.height;
		img_width = img.width;
		
		aspect = img_width / img_height;
		
		new_width = height * aspect;
		
		new_width = parseInt(new_width.toString());
		
		return new_width;
	}
	
	var map_popup = document.getElementById('inline_content');
	
	if ($(window).width() > 768) {
	
		map_popup.style.width = "600px";
		
		max_width = 0;
		for (var i = 0; i < img_elements.length; i++) {
			cur_img = img_elements[i];
			if (cur_img.height == 0) {
				var image = new Image();
				image.src = cur_img.src;
				//alert(image.width);
				//alert(map_popup.clientWidth);
				carousel_classes = document.getElementsByClassName('carousel-img');
				carousel_class = carousel_classes[0];
				carousel_style = window.getComputedStyle(carousel_class, null);
				max_height = parseInt(carousel_style.height.replace("px", ""));
				img_width = calculateWidth(image, max_height);
				//alert(img_width > map_popup.clientWidth);
				if (img_width > max_width){
					// Get the padding of the modal-body
					mod_classes = document.getElementsByClassName('modal-body');
					mod_class = mod_classes[0];
					mod_style = window.getComputedStyle(mod_class, null);
					pad_str = mod_style.padding;
					pad_str = pad_str.replace("px", "");
					pad_val = parseInt(pad_str);
					max_width = img_width + (pad_val * 2);
				}
			}
		}
		map_popup.style.width = max_width + "px";
	} else {
		map_popup.style.width = "100% !important";
		/* car_img = document.getElementById('carousel-img');
		car_img.style.height = "auto !important";
		car_img.style.width = "100% important!"; */
	}
});

// FeatureOverlay no longer used after v3.7
/* var featureOverlay = new ol.FeatureOverlay({
	map: map,
	style: styleFunction
});
 */

var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
	map: map,
	source: new ol.source.Vector({
		features: collection,
		useSpatialIndex: false // optional, might improve performance
	}),
	//style: overlayStyle,
	updateWhileAnimating: true, // optional, for instant visual feedback
	updateWhileInteracting: true // optional, for instant visual feedback
});

//map.addLayer(raster);
//map.addLayer(kmlLayer);

var element = document.getElementById('popup');

var popup = new ol.Overlay({
	element: element
});
map.addOverlay(popup);

//var source = kmlLayer.getSource().getFeatures()

//window.alert(source.length)

//kmlLayer.getSource().forEachFeature(function(feature) {
//	var properties = feature.getProperties();
	//var style = feature.getStyle();
//	var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
//	if(typeof tmpstyle !== 'undefined'){
//		feature.setStyle(tmpstyle[0]);
//	}
//});

reset_styles(styles);

var highlight;
var highlightFeature = function(pixel) {
	
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	
	// Do not show tooltip when popup is showing:
	if (!POPUP_LOCK) {
	
		info.css({
			left: pixel[0] + 'px',
			top: (pixel[1] - 15) + 'px'
		});
		
		info.tooltip({
			animation: false,
			trigger: 'hover'
		});
		
		if (feature) {
			info.tooltip('hide')
				//.attr('data-original-title', feature.get('name'))
				.attr('data-original-title', $('<div>').html(feature.get('name')).html())
				.tooltip('fixTitle')
				.tooltip('show');
		} else {
			info.tooltip('hide');
		}
	}

	if (feature !== highlight) {
		if (highlight) {
			featureOverlay.getSource().removeFeature(highlight);
		}
		if (feature) {
			featureOverlay.getSource().addFeature(feature);
		}
		highlight = feature;
	}
};

var popup_html = getPopupContent();
//alert(popup_html);

//var featId = -1;

// $('#map').mousedown(function() {
	// POPUP_LOCK = true;
// });

// display popup on click
map.on('click', function(evt) {
	POPUP_LOCK = true;
	var feature, layer = map.forEachFeatureAtPixel(evt.pixel,
		function(feature, layer) {
		// do stuff here with feature
			var element_pop = popup.getElement();
			if (feature) {
				//window.alert(evt.coordinate)
				var properties = feature.getProperties();
				//var style = feature.getStyle();
				//var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
				var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
				if(typeof tmpstyle !== 'undefined'){
					feature.setStyle(tmpstyle[1]);
				} else {
					feature.setStyle(styles['undefined'][0]);
				};
				//$(element_pop).popover('destroy');
				popup.setPosition(evt.coordinate);
				// Set the view to the building location:
				var view_tmp = map.getView();
				var featId = feature.getId();
				showPopup(feature, layer);
				/* $(element_pop).data('fid', featId);
				view_tmp.setCenter(evt.coordinate);
				popup_html = getPopupContent();
				popup_html = popup_html.replace('${dateBuilt}', properties['dateBuilt'])
				popup_html = popup_html.replace('${dateDemolished}', properties['dateDemolished'])
				popup_html = popup_html.replace('${status}', properties['status'])
				popup_html = popup_html.replace('${history}', properties['history'])
				popup_html = popup_html.replace('${addrss}', properties['addrss'])
				popup_html = popup_html.replace('${occupant}', properties['occupant'])
				popup_html = popup_html.replace('${sources}', properties['sources'])
				popup_html = popup_html.replace('${photos}', properties['photos'])
				$(element_pop).popover({
				  'placement': 'auto left',
				  'animation': false,
				  'html': true,
				  //'title': properties['name'], 
				  //'title': feature.get('name') + '<button type="button" id="close" class="close" onclick="$(&quot;#' + $(element_pop).attr('id') + '&quot;).popover(&quot;hide&quot;);">&times;</button>', 
				  'title': feature.get('name') + '<button type="button" id="close" class="close" onclick="closePopup(&quot;#' + $(element_pop).attr('id') + '&quot;, ' + featId + ');">&times;</button>', 
				  'content': popup_html
				});
				$(element_pop).popover('show'); */
				return feature, layer;
			} else {
				$(element_pop).popover('destroy');
			}
		
			//console.log(properties['id']);
			//console.log(properties['room_id']);
			//window.alert(properties['name']);
			//window.alert(properties['dateBuilt']);
		});
	if(typeof feature === 'undefined'){
		var element_pop = popup.getElement();
		$(element_pop).popover('destroy');
		popup_html = '';
		popup_html = getPopupContent();
		var featId = $(element_pop).data('fid'); 
		removeHighlight(featId, layer);
	};
	//POPUP_LOCK = false;
	$('#info').tooltip('hide');
});

// Set Bing Maps layer visible on load:
var osmRad = document.getElementById('osm');
bingLayer.setVisible(false);
//kmlLayer.setVisible(false);
osmLayer.setVisible(true);
osmRad.click();

// Set the building layer radio button:
var kmlRad = document.getElementById('kml');
kmlRad.click();

// change mouse cursor when over marker
map.on('pointermove', function(e) {
//	//featureOverlay.getFeatures().clear();
//	var coordinate = e.coordinate;
//	var pixel = e.pixel;
//	// then for each feature at the mouse position ...
//	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
//		if (feature) {
//			var properties = feature.getProperties();
//			var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
//			if(typeof tmpstyle !== 'undefined'){
//				feature.setStyle(tmpstyle[1]);
//			}
//		} else {
//			reset_styles(styles);
//		}
//	});
//	if(typeof feature === 'undefined'){
//		reset_styles(styles);
//	};
	var pixel = map.getEventPixel(e.originalEvent);
	highlightFeature(pixel);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});