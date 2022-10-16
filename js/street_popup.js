
var template_fn = "../../files/street_popup_html.txt";

var img_height = 0;
var img_width = 0;

function imgClick() {
	$("#cf2 img.top").toggleClass("transparent");
}

function parseOrigin(origin) {
	origin = checkInput(origin)
	var out_origin = '<p class="street-p">' 
					+ origin.replaceAll('<br>', '</p><p class="street-p">') 
					+ "</p>";
	return out_origin;
}

function createPhotoHtml(photos) {
	
	var photo_html = '';
	
	for (var i = 0; i < photos.length; i++) {
		caption = photos[i]['caption'];
		//link = photos[i]['link'];
		img_url = photos[i]['url'];
		source_url = photos[i]['sourceUrl'];
		date_taken = photos[i]['date'];
		
		var img = document.createElement('img');

		img.onload = function () { 
			// alert(img.width + ' x ' + img.height); 
			var img_photo = document.getElementById("image-photo");
			var img_height = img.height;
			var img_width = img.width;
			
			if (img_height > img_width) {
				img_photo.style.width = "40%";
			}
		};

		img.src = img_url;
		
		photo_html += ['', '<div id="image-photo" class="street-photo" style="width: 50%">', 
						'<figure>', 
						'<a href="' + source_url + '">', 
						'<img style="width: 100%" href="' + source_url + '" src="' + img_url + '">', 
						'</a>', 
						'<figcaption class="street-figcaption">' + caption + '</figcaption>', 
						'</figure>', 
						'</div>'
					].join('\n');
	}
					
	return photo_html;
}

function showPopup(props, featId) {
	//info.tooltip('hide');

	$(".modal-title").html(props['street_name']).text();
	
	origin = props['origin'];
	photos = props['photos'];
	source = props['source'];
	
	popup_html = getPopupContent(template_fn);
	popup_html = popup_html.replace('${id}', checkInput(props['id']));
	
	origin_html = parseOrigin(origin);
	popup_html = popup_html.replace('${origin}', origin_html);
	// popup_html = popup_html.replace('${photo}', checkInput(props['photo']));
	// popup_html = popup_html.replace('${source}', checkInput(props['source']));
	
	photo_html = createPhotoHtml(photos);
	popup_html = popup_html.replace('${photo}', photo_html);
	
	// Create links for sources:
	sources = checkInput(props['sources']);
	if (sources.length > 0) {
		//sources = sources.replace(/<a/g, '<a target="_blank" class="popup-a"');
		source_html = '';
		for (var i = 0; i < sources.length; i++) {
			var src_type = sources[i]['type'];
			var accessed = new Date(sources[i]['accessed']);
			var author = sources[i]['author'];
			var title = sources[i]['title'];
			var city = sources[i]['city'];
			var print_date = new Date(sources[i]['date']);
			var publisher = sources[i]['publisher'];
			var title = sources[i]['title'];
			var url = sources[i]['url'];
			if (src_type == 'newspaper') {
				if (author != null && author != 'null') {
					author = author + ". ";
				} else {
					author = '';
				}
				citation = (i + 1) + '. ' 
							+ author + '"' 
							+ title + '". ' 
							+ publisher + '. ' 
							+ formatDate(print_date) + '. ' 
							+ '<a class="on-white" href="' + url + '" target="_blank">' 
							+ url + '</a>. (accessed ' 
							+ formatDate(accessed) + ").";
			} else if (src_type == 'webpage') {
				if (author != null && author != 'null') {
					author = author + ". ";
				} else {
					author = '';
				}
				citation = (i + 1) + '. ' 
							+ author + '"' 
							+ title + '". ' 
							+ '<a class="on-white" href="' 
							+ url + '" target="_blank">' 
							+ url + '</a>. (accessed - ' 
							+ formatDate(accessed) + ").";
			} else if (src_type == 'book') {
				citation = (i + 1) + '. ' 
							+ author + '"' 
							+ title + '". ' 
							+ city + ': ' + publisher + '. ' 
							+ formatDate(print_date) + '.';
			}
			// src_name = (i + 1) + ". " + sources[i]['name'];
			// src_url = sources[i]['url'];
			source_html += [citation, 
							'<br>'
						  ].join('\n');
		}
		popup_html = popup_html.replace('${sources}', source_html);
	} else {
		popup_html = popup_html.replace('${sources}', 'n/a');
	}
	
	if (featId > -1 && featId != null) {
		popup_html += "\n<!--Feature_ID=" + featId.toString() + "-->"
	}
	
	triggerPopup(popup_html);
}