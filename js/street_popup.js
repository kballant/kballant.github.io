
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

	if (photos == null) {
		return photo_html;
	}
	
	out_photos = new Map();
	for (var i = 0; i < photos.length; i++) {
		primary = photos[i]['primary_image'];
		img_orient = photos[i]['orientation'];
		caption = photos[i]['caption'];
		//link = photos[i]['link'];
		img_url = photos[i]['photo_url'];
		source_name = photos[i]['source_name'];
		source_url = photos[i]['source_url'];
		date_taken = photos[i]['date'];
		
		var img = document.createElement('img');

		img.onload = function () { 
			// alert(img.width + ' x ' + img.height); 
			var img_photo = document.getElementById("image-photo");
			var img_height = img.height;
			var img_width = img.width;
			
			/*if (img_height > img_width) {
				img_photo.style.width = "40%";
			}*/
			if (img_orient == 'landscape') {
				img_photo.style.width = "60%";
			} else {
				img_photo.style.width = "40%";
			}
		};

		console.log(window.location.hostname);
		console.log("img_url: " + img_url);

		if (window.location.hostname == "127.0.0.1") {
			img_url = img_url.replace("www.kballantyne.ca", window.location.host);
			console.log("img_url: " + img_url);
		}

		img.src = img_url;

		other_photos = out_photos.get('others')

		if (typeof other_photos == 'undefined') {
			other_photos = [];
		}

		src_html = `<p class="street-photo-source">Source: ${source_name}</p>`;
		if (source_url != null && source_url.includes("http")) {
			// if (primary == true) {
			// 	src_html = '<br><a class="street-photo-source" href="' + source_url + '">Source</a>';
			// } else {
			// 	src_html = '(<a class="street-photo-source" href="' + source_url + '">Source</a>)';
			// }
			src_html = `<p class="street-photo-source">Source: <a class="street-photo-source" href="${source_url}">${source_name}</a></p>`;
		}
		
		if (primary == true) {
			photo_html = ['', '<div id="image-photo" class="street-photo" style="width: 50%">', 
							'<figure>', 
							`<a href="${img_url}">`, 
							`<img class="street-photo-img" href="${img_url}" src="${img_url}">`, 
							'</a>', 
							'<figcaption class="street-figcaption">',
							caption,
							'<hr class="street-photo-source">',
							src_html,
							'</figcaption>', 
							'</figure>', 
							'</div>'
						].join('\n');
			out_photos.set("primary", photo_html);
			continue;
		}

		photo_html = ['', '<div id="other-photo" class="street-photo" style="width: 100%">', 
						'<figure>', 
						'<figcaption class="street-figcaption">',
						caption,
						'</figcaption>', 
						`<a href="${img_url}">`, 
						`<img class="street-photo-img" href="${img_url}" src="${img_url}">`, 
						'</a>', 
						'<figcaption class="street-figcaption">',
						src_html,
						'</figcaption>', 
						'</figure>', 
						'</div>'
					].join('\n');
		other_photos.push(photo_html);
		out_photos.set('others', other_photos);
	}
					
	return out_photos;
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
	
	photo_htmls = createPhotoHtml(photos);
	if (photo_htmls) {
		prime_html = photo_htmls.get('primary');
		if (prime_html) {
			popup_html = popup_html.replace('${photo}', prime_html);
		} else {
			popup_html = popup_html.replace('${photo}', '');
		}
		others = photo_htmls.get('others');
		if (others) {
			other_photos_html = others.join('\n');
			popup_html = popup_html.replace('${other_photos}', other_photos_html);
		} else {
			popup_html = popup_html.replace('${other_photos}', '');
		}

		console.log([...photo_htmls.entries()]);
	} else {
		popup_html = popup_html.replace('${photo}', '');
		popup_html = popup_html.replace('${other_photos}', '');
	}
	
	// Create links for sources:
	sources = checkInput(props['sources']);
	console.log('sources: ' + sources);
	if (sources == 'n/a') {
		popup_html = popup_html.replace('${sources}', 'n/a');
	} else {
		if (sources.length > 0) {
			//sources = sources.replace(/<a/g, '<a target="_blank" class="popup-a"');
			source_html = '';
			for (var i = 0; i < sources.length; i++) {
				var src_type = sources[i]['source_type'];
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
				} else if (src_type == 'book') {
					citation = (i + 1) + '. ' 
								+ author + '"' 
								+ title + '". ' 
								+ city + ': ' + publisher + '. ' 
								+ formatDate(print_date) + '.';
				} else {
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
	}
	
	if (featId > -1 && featId != null) {
		popup_html += "\n<!--Feature_ID=" + featId.toString() + "-->"
	}
	
	triggerPopup(popup_html);
}