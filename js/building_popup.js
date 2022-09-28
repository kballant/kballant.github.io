
var template_fn = "../../files/building_popup_html.txt";

function getKml() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			out_content = xhttp.responseText;
			//alert(out_content);
			return out_content;
		}
	};
	xhttp.open("GET", "../../files/Ottawa_Bygone_Buildings.geojson", false);
	xhttp.send();
	out_content = xhttp.responseText;
	//alert(out_content);
	return out_content;
}

function createPopup(id_num) {
	//var xmlDoc = new DOMParser().parseFromString(getKml(),'text/xml');
	
	jsonDoc = getKml();
	
	json_data = JSON.parse(jsonDoc);
	
	//alert(json_data);
	
	features = json_data.features;
	
	//alert(features)

	var build_id = "";
	
	for (i=0; i<features.length; i++) {
		var feat = features[i];
		var props = feat.properties;
		
		var building_info = new Object();
		
		//alert(props['id']);
		
		building_info['id'] = props['id'];
		building_info['buildingName'] = props['buildingName'];
		building_info['dateBuilt'] = props['dateBuilt'];
		building_info['dateDemolished'] = props['dateDemolished'];
		building_info['architect'] = props['architects']['name'];
		building_info['status'] = props['status'];
		building_info['history'] = props['history'];
		building_info['occupant'] = props['occupant'];
		building_info['address'] = props['address'];
		building_info['architects'] = props['architects'];
		
		building_info['sources'] = props['sources'];
		
		building_info['photos'] = props['photos'];
		
		if (id_num == building_info["id"]) { break; }
	}
	
	showPopup(building_info);
}

function checkInput(in_text) {
	if (in_text) {
		return in_text;
	} else {
		return "n/a";
	}
}

function createPhotoHtml(photos) {
	
	// Bootstrap Carousel:
	var photo_html = ['<div class="container carousel-container">',
						'<br>',
						'<div id="photoCarousel" class="carousel slide" data-ride="carousel" data-interval="false">',
					 ].join('\n');
		//<!-- Indicators -->
		//<ol class="carousel-indicators">`
	
	photo_html += ['', '<!-- Wrapper for slides -->', 
					'<div class="carousel-inner" role="listbox">', 
				  ].join('\n');
	
	// Create the warppers for each image in the carousel
	for (var i = 0; i < photos.length; i++) {
		caption = photos[i]['caption'];
		//link = photos[i]['link'];
		img_url = photos[i]['url'];
		modern_url = photos[i]['modernUrl'];
		date_taken = photos[i]['dateTaken']; //.replace('Date Taken: ', '');
		//source = photos[i]['source'].replace('Source: ', '');
		source = photos[i]['sources'][0];
		src_link = source['url'];
		src_name = source['name'];
		if (i == 0) {
			active_str = ' active';
		} else {
			active_str = '';
		}
		
		if (modern_url) {
			photo_html += ['', '<div class="item' + active_str + ' carousel-item">', 
								'<div id="cf2">', 
									'<img class="bottom carousel-img" src="' + modern_url + '" alt="" onclick="imgClick()">', 
									//'<div class="mag-div magnify">', 
									'<div class="mag-div">', 
										'<div class="large"></div>', 
										'<img class="small top carousel-img" src="' + img_url + '" alt="" onclick="imgClick()">', 
									'</div>',
								'</div>', 
								'<div class="carousel-caption">', 
									'<p class="carousel-text-sm">***Click on image to toggle between then & now***</p>', 
									'<hr class="trim" style="height:1px;border:none;color:#333;background-color:#AAAAAA">', 
									'<p class="carousel-caption-txt">' + caption + '</p>', 
									'<p class="carousel-text-sm">Date Taken: ' + date_taken + '</p>', 
									'<p class="carousel-text-sm">Source: <a href="' + src_link + '" target="_blank">' + src_name + '</a></p>', 
								'</div>', 
							'</div>'
						  ].join('\n');
		} else {
			photo_html += ['', '<div class="item' + active_str + ' carousel-item">', 
								//'<div class="mag-div magnify">',
								'<div class="mag-div">',
									'<div class="large"></div>',
									'<img class="small carousel-img" src="' + img_url + '" alt="">', 
								'</div>', 
								'<div class="magbutton">', 
									//'<button type="button" class="btn btn-info" onclick="toggleMagnify(this)" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="glyphicon glyphicon-zoom-in"></i></button>', 									
									'<p>',
										//'<button type="button" class="btn btn-info" onclick="toggleMagnify(this)" data-toggle="button" aria-pressed="false" autocomplete="off">Magnify</button>', 
										'<button type="button" class="btn btn-info" onclick="toggleMagnify(this)" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="mag-text glyphicon glyphicon-zoom-in"></i></button>', 
									'</p>', 
									'<hr class="trim" style="height:1px;border:none;color:#333;background-color:#AAAAAA">', 
								'</div>', 
								'<div class="carousel-caption">', 
									'<p class="carousel-caption-txt">' + caption + '</p>', 
									'<p class="carousel-text-sm">Date Taken: ' + date_taken + '</p>', 
									'<p class="carousel-text-sm">Source: <a href="' + src_link + '" target="_blank">' + src_name + '</a></p>', 
								'</div>', 
							'</div>'
						  ].join('\n');
		}
	}
	
	photo_html += ['', '</div>', 
					'<!-- Left and right controls -->'
				  ].join('\n')
	
	// Create the left and right arrows for the carousel if more than one image
	if (photos.length > 1) {
		photo_html += ['', '<a class="left arrow carousel-control" href="#photoCarousel" role="button" data-slide="prev">', 
			'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>', 
			'<span class="sr-only">Previous</span>', 
		'</a>', 
		'<a class="right arrow carousel-control" href="#photoCarousel" role="button" data-slide="next">', 
			'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>', 
			'<span class="sr-only">Next</span>', 
		'</a>'
					  ].join('\n');
	}
	
	// Create thumbnails for carousel
	
	photo_html += ['', '<ul class="thumbnails-carousel clearfix">'].join('\n');
	
	for (var i = 0; i < photos.length; i++) {
		img_src = photos[i]['url'];
		photo_html += ['', '<li><img class="tn" src="' + img_src + '" alt=""></li>'].join('\n');
	}
	
	photo_html += ['', '</ul>', '</div>', '</div>'].join('\n');

	return photo_html;
}

function showPopup(props, featId) {
	//info.tooltip('hide');

	$(".modal-title").html(props['buildingName']).text();
	
	
	// Get the address
	address_json = props['address'];
	unit_numbs = address_json['unitNumber'].split(';');
	streets = address_json['street'].split(';');
	addresses = [];
	for (var i=0; i<unit_numbs.length; i++) {
		addresses.push(unit_numbs[i] + " " + streets[i]);
	}
	address_str = addresses.join("; ");
	//building_info['addrss'] = address_str;
	
	if (address_str == "") {
		address_str = 'n/a';
	}
	
	// Get the architects
	arch_lst = props['architects'];
	arch_html = "";
	for (var i=0; i<arch_lst.length; i++) {
		arch_name = arch_lst[i]['name'];
		arch_url = arch_lst[i]['url'];
		arch_html += ['<a class="on-white" href="' + arch_url + '" target="_blank">', 
							arch_name, 
					  '</a>', 
					  '<br>'
					  ].join('\n');
	}
	
	if (arch_html == "") {
		arch_html = 'n/a';
	}
	
	popup_html = getPopupContent(template_fn);
	popup_html = popup_html.replace('${id}', checkInput(props['id']));
	popup_html = popup_html.replace('${dateBuilt}', checkInput(props['dateBuilt']));
	popup_html = popup_html.replace('${dateDemolished}', checkInput(props['dateDemolished']));
	popup_html = popup_html.replace('${architect}', arch_html);
	popup_html = popup_html.replace('${status}', checkInput(props['status']));
	popup_html = popup_html.replace('${history}', checkInput(props['history']));
	popup_html = popup_html.replace('${addrss}', address_str);
	popup_html = popup_html.replace('${occupant}', checkInput(props['occupant']));
	
	// Create links for sources:
	sources = checkInput(props['sources']);
	if (sources.length > 0) {
		//sources = sources.replace(/<a/g, '<a target="_blank" class="popup-a"');
		source_html = '';
		for (var i = 0; i < sources.length; i++) {
			src_name = sources[i]['name'];
			src_url = sources[i]['url'];
			source_html += [src_name + ':',
							'<a class="on-white" href="' + src_url + '" target="_blank">', 
								src_url, 
							'</a>', 
							'<br>'
						  ].join('\n');
		}
		popup_html = popup_html.replace('${sources}', source_html);
	} else {
		popup_html = popup_html.replace('${sources}', 'n/a');
	}
	
	photo_info = props['photos'];
	
	//alert(photo_info);
	
	new_ph_html = createPhotoHtml(photo_info);
	//alert(new_ph_html);
	
	popup_html = popup_html.replace('${photos}', new_ph_html);
	if (featId > -1 && featId != null) {
		popup_html += "\n<!--Feature_ID=" + featId.toString() + "-->"
	}
	
	triggerPopup(popup_html);
	
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