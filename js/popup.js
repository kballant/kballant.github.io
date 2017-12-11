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
	xhttp.open("GET", "../files/popup_html2.txt", false);
	xhttp.send();
	out_content = xhttp.responseText;
	//alert(out_content);
	return out_content;
}

function get_kml() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			out_content = xhttp.responseText;
			//alert(out_content);
			return out_content;
		}
	};
	xhttp.open("GET", "../files/Ottawa_Bygone_Buildings.kml", false);
	xhttp.send();
	out_content = xhttp.responseText;
	//alert(out_content);
	return out_content;
}

function create_popup(id_num) {
	var xmlDoc = new DOMParser().parseFromString(get_kml(),'text/xml');
	
	var kml = xmlDoc.getElementsByTagName("Placemark");
	
	var build_id = "";
	
	for (i=0; i<kml.length; i++) { 
			//extended_data = kml.item(i).getElementsByTagName("ExtendedData");
			data_list = kml.item(i).getElementsByTagName("Data");
			//build_id = data.getElementsByName("id")[0];
			//build_name = kml.item(i).getElementsByTagName("name")[0].firstChild.nodeValue;
			
			var building_info = new Object();
			
			for (j=0; j<data_list.length; j++) {
				field_name = data_list[j].attributes['name'].nodeValue
				value = data_list[j].getElementsByTagName("value")[0].textContent
				building_info[field_name] = value
			}
			
			if (id_num == building_info["id"]) { break; }
			
			//if (build_id == id_num) {
			//	alert(build_name)
			//}
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

function create_photo_html(photos) {
	
	// Bootstrap Carousel:
	var photo_html = ['<div class="container carousel-container">',
						'<br>',
						'<div id="photoCarousel" class="carousel slide" data-ride="carousel" data-interval="false">',
					 ].join('\n');
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
	
	photo_html += ['', '<!-- Wrapper for slides -->', 
					'<div class="carousel-inner" role="listbox">', 
				  ].join('\n');
	
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
		if (img_src.length > 1) {
			photo_html += ['', '<div class="item' + active_str + ' carousel-item">', 
								'<div id="cf2">', 
									'<img class="bottom carousel-img" src="' + img_src[1] + '" alt="" onclick="imgClick()">', 
									'<img class="top carousel-img" src="' + img_src[0] + '" alt="" onclick="imgClick()">', 
								'</div>', 
								'<div class="carousel-caption">', 
									'<p class="carousel-text-sm">***Click on image to toggle between then & now***</p>', 
									'<p class="carousel-caption-txt">' + caption + '</p>', 
									'<p class="carousel-text-sm">Date Taken:' + date_taken + '</p>', 
									'<p class="carousel-text-sm">Source: <a href="' + link + '">' + source + '</a></p>', 
								'</div>', 
							'</div>'
						  ].join('\n');
		} else {
			photo_html += ['', '<div class="item' + active_str + ' carousel-item">', 
								'<img class="carousel-img" src="' + img_src[0] + '" alt="">', 
								'<div class="carousel-caption">', 
									'<p class="carousel-caption-txt">' + caption + '</p>', 
									'<p class="carousel-text-sm">Date Taken: ' + date_taken + '</p>', 
								'<p class="carousel-text-sm">Source: <a href="' + link + '">' + source + '</a></p>', 
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
		photo_html += ['', '<a class="left carousel-control" href="#photoCarousel" role="button" data-slide="prev">', 
			'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>', 
			'<span class="sr-only">Previous</span>', 
		'</a>', 
		'<a class="right carousel-control" href="#photoCarousel" role="button" data-slide="next">', 
			'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>', 
			'<span class="sr-only">Next</span>', 
		'</a>'
					  ].join('\n');
	}
	
	// Create thumbnails for carousel
	
	photo_html += ['', '<ul class="thumbnails-carousel clearfix">'].join('\n');
	
	for (var i = 0; i < photos.length; i++) {
		img_src = photos[i]['img_src'][0];
		photo_html += ['', '<li><img class="tn" src="' + img_src + '" alt=""></li>'].join('\n');
	}
	
	photo_html += ['', '</ul>', '</div>', '</div>'].join('\n');

	return photo_html;
}

function imgClick() {
	$("#cf2 img.top").toggleClass("transparent");
}

function showPopup(props, featId) {
	//info.tooltip('hide');

	$(".modal-title").html(props['name']).text();

	popup_html = getPopupContent();
	popup_html = popup_html.replace('${id}', checkInput(props['id']));
	popup_html = popup_html.replace('${dateBuilt}', checkInput(props['dateBuilt']));
	popup_html = popup_html.replace('${dateDemolished}', checkInput(props['dateDemolished']));
	popup_html = popup_html.replace('${architect}', checkInput(props['architect']));
	popup_html = popup_html.replace('${status}', checkInput(props['status']));
	popup_html = popup_html.replace('${history}', checkInput(props['history']));
	popup_html = popup_html.replace('${addrss}', checkInput(props['addrss']));
	popup_html = popup_html.replace('${occupant}', checkInput(props['occupant']));
	//featId = checkInput(props['id'])
	
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
	
	// Correct htmlDoc if null
	if (htmlDoc == null) {
		htmlDoc = document.createElement('div');
		htmlDoc.innerHTML = photo_html;
	}
	
	//td_elements = htmlDoc.getElementsByTagName('td');
	table_elements = htmlDoc.getElementsByClassName('container');
	//a_elements = htmlDoc.getElementsByTagName('a');
	
	//alert(table_elements.length);
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
		
		// Get the caption
		caption = child_elements[0].innerText;
		photo['caption'] = caption;
		
		// Get the source URL of photo
		img_element = child_elements[1].getElementsByTagName('img');
		var img_src = [];
		if (img_element.length > 1) {
			img_src.push(img_element[1].src);
			img_src.push(img_element[0].src);
		} else {
			img_src.push(img_element[0].src);
		}
		photo['img_src'] = img_src;
		
		// Parse source info
		source_str = child_elements[2].innerText;
		sources = source_str.trim().split(/\r?\n/).filter(Boolean);
		var filter_srcs = sources.filter(function(v){return v.replace(/\s/g,'')!==''});
		date_taken = filter_srcs[0];
		if (filter_srcs.length == 3) {
			source = filter_srcs[2];
		} else {
			source = "";
		}
		photo['date_taken'] = date_taken;
		photo['source'] = source;
		
		// Get the link info from source
		a_element = child_elements[2].getElementsByTagName('a');
		if (a_element.length == 0) {
			photo['link'] = "";
		} else {
			link = a_element[0].href;
			photo['link'] = link;
		}
		photos.push(photo);
		
		/* child_elements = table_elements[i].children;
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
		} */
	}
	
	new_ph_html = create_photo_html(photos);
	//alert(new_ph_html);
	
	popup_html = popup_html.replace('${photos}', new_ph_html);
	if (featId > -1 && featId != null) {
		popup_html += "\n<!--Feature_ID=" + featId.toString() + "-->"
	}
	
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