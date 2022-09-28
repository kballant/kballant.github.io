
var template_fn = "../../files/street_popup_html.txt";

var img_height = 0;
var img_width = 0;

function imgClick() {
	$("#cf2 img.top").toggleClass("transparent");
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
	popup_html = popup_html.replace('${origin}', checkInput(props['origin']));
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
			src_name = (i + 1) + ". " + sources[i]['name'];
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
	
	if (featId > -1 && featId != null) {
		popup_html += "\n<!--Feature_ID=" + featId.toString() + "-->"
	}
	
	triggerPopup(popup_html);
}