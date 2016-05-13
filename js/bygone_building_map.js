//var closer = document.getElementById('popup-closer');

var POPUP_LOCK = false;

// Declare of styles:
// Residential:
var res_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255,255,0,0.5]
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var res_hl = new ol.style.Style({
      fill: new ol.style.Fill({
		color: [255,255,0,1]
      }),
      stroke: new ol.style.Stroke({
		color: 'black',
		width: 2
      })
    });
var residential_map = [res_normal, res_hl]

// Hotel:
var hotel_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,128,0,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var hotel_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,128,0,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var hotel_map = [hotel_normal, hotel_hl]

// Commercial:
var comm_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var comm_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var comm_map = [comm_normal, comm_hl]

// Industrial:
var ind_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(160,32,240,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var ind_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(160,32,240,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var industrial_map = [ind_normal, ind_hl]

// Institute:
var inst_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0,0,255,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var inst_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0,0,255,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var institute_map = [inst_normal, inst_hl]

// Health:
var health_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(51,204,255,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var health_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(51,204,255,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var health_map = [health_normal, health_hl]

// Religious:
var relig_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(47,204,79,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var relig_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(47,204,79,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var relig_map = [relig_normal, relig_hl]

// Recreational:
var rec_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0,255,0,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var rec_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0,255,0,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var rec_map = [rec_normal, rec_hl]

// Transportation:
var trans_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(128,128,128,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var trans_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(128,128,128,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var trans_map = [trans_normal, trans_hl]

// Undefined:
var undef_normal = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var undef_hl = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    });
var undef_map = [undef_normal, undef_hl]

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

function reset_styles(styles) {
	var source = vector.getSource()
	var counter = 0
	var key = source.on('change', function(event) {
		if (source.getState() == 'ready') {
			source.unByKey(key);
			$.ajax('../files/Ottawa_Bygone_Buildings.kml').done(function(data) {
				vector.getSource().forEachFeature(function(feature) {
					feature.setId(counter);
					var properties = feature.getProperties();
					//var tmpstyle = styles[properties['styleUrl'].replace("#", "")];
					var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
					if(typeof tmpstyle !== 'undefined'){
						feature.setStyle(tmpstyle[0]);
					} else {
						feature.setStyle(styles['undefined'][0]);
					};
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
	var bingRad = document.getElementById('bingmaps');
	var osmRad = document.getElementById('osm');
	var layers = [];
    /* map.getLayers().forEach(function (lyr) {
		layers.push({
			key: lyr.get('name'), 
			value: lyr
		});
    }); */
	//alert(map.getLayers().item(0).get('name'));
	if (bingRad.checked) {
		map.getLayers().item(1).setVisible(true);
		map.getLayers().item(0).setVisible(false);
	} else {
		map.getLayers().item(1).setVisible(false);
		map.getLayers().item(0).setVisible(true);
	};
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

var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '../files/Ottawa_Bygone_Buildings.kml',
        format: new ol.format.KML({
			extractStyles: false, 
            //extractAttributes: true
		})
    })
});
bingLayer.set('name', 'bingMap');
osmLayer.set('name', 'osm');

//window.alert(vector.getSource().getExtent());

var map = new ol.Map({
    layers: [osmLayer, bingLayer, vector],
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
	var feat = vector.getSource().getFeatureById(featId);
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
	//var feature = vector.getSource().getFeatureById(featId);
	//$(elem).popover("hide");
	removeHighlight(featId);
	POPUP_LOCK = false;
};

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
	<div id="photoCarousel" class="carousel slide" data-ride="carousel" data-interval="false">
		<!-- Indicators -->
		<ol class="carousel-indicators">`
	
	for (var i = 0; i < photos.length; i++) {
		if (i == 0) {
			active_str = ' class="active"';
		} else {
			active_str = '';
		}
		photo_html += `
			<li data-target="#photoCarousel" data-slide-to="${i}"${active_str}></li>`
	}
	photo_html += `
		</ol>
		
		<!-- Wrapper for slides -->
		<div class="carousel-inner" role="listbox">`
			
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
		photo_html += `\
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
		
	if (photos.length > 1) {
		photo_html += `<a class="left carousel-control" href="#photoCarousel" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#photoCarousel" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>`
	}
	photo_html += `
	</div>
</div>`
			
	// Wet-Boew Carousel:
	/* var photo_html = '\
		<div class="wb-tabs carousel-s2 show-thumbs carousel-padding"> \
			<ul role="tablist">';
	
	// Create HTML for tab list:
	for (var i = 0; i < photos.length; i++) {
		caption = photos[i]['caption'];
		link = photos[i]['link'];
		img_src = photos[i]['img_src'];
		date_taken = photos[i]['date_taken'];
		source = photos[i]['source'];
		if (i == 0) {
			active_str = 'class="active"';
			//tabindex="0";
		}
		else {
			active_str = '';
			//tabindex="-1";
		}
		photo_html += `<li ${active_str} role="presentation"><a href="#panel${i + 1}">
			<img class="popover-thumb" src="${img_src}" alt="${caption}" /></a></li>`;
		//photo_html += `<li role="presentation"><a href="#panel${i + 1}"  tabindex="${tabindex}" role="tab" aria-controls="panel${i + 1}" id="panel${i + 1}-lnk">
		//	<img class="popover-thumb" src="${img_src}" alt="${caption}" /></a></li>`;
	}
	
	photo_html += '</ul> \
			<div class="tabpanels">';
	
	// Create tab panels:
	for (var i = 0; i < photos.length; i++) {
		caption = photos[i]['caption'].trim();
		link = photos[i]['link'].trim();
		img_src = photos[i]['img_src'].trim();
		date_taken = photos[i]['date_taken'].trim();
		source = photos[i]['source'].trim();
		if (i == 0) {
			fade_str = 'in'; 
		}
		else {
			fade_str = 'out';
		}
		fade_str += ' slide';
		photo_html += `<div role="tabpanel" id="panel${i + 1}" class="${fade_str}"> \
					<figure> \
						<img class="popover-img" src="${img_src}" alt="" /> \
						<figcaption> \
							<p> \
								${caption} \
							</p> \
						</figcaption> \
					</figure> \
				</div>`;
	}
	
	photo_html += '</div> \
			</div>';
			
	return photo_html; */
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

function showPopup(feature) {
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
//map.addLayer(vector);

var element = document.getElementById('popup');

var popup = new ol.Overlay({
	element: element
});
map.addOverlay(popup);

//var source = vector.getSource().getFeatures()

//window.alert(source.length)

//vector.getSource().forEachFeature(function(feature) {
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
				.attr('data-original-title', feature.get('name'))
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
	var feature = map.forEachFeatureAtPixel(evt.pixel,
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
				showPopup(feature);
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
				return feature;
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
		removeHighlight(featId);
	};
	//POPUP_LOCK = false;
	$('#info').tooltip('hide');
});

// Set Bing Maps layer visible on load:
var osmRad = document.getElementById('osm');
bingLayer.setVisible(false);
osmLayer.setVisible(true);
osmRad.click();

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