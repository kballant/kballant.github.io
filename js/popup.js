function getPopupContent() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			outContent = xhttp.responseText;
			//alert(outContent);
			return outContent;
		}
	};
	xhttp.open("GET", "../files/popup_html2.txt", false);
	xhttp.send();
	outContent = xhttp.responseText;
	//alert(outContent);
	return outContent;
}

function getKML() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			outContent = xhttp.responseText;
			//alert(outContent);
			return outContent;
		}
	};
	xhttp.open("GET", "../files/Ottawa_Bygone_Buildings.geojson", false);
	xhttp.send();
	outContent = xhttp.responseText;
	//alert(outContent);
	return outContent;
}

function createPopup(idNum) {
	//var xmlDoc = new DOMParser().parseFromString(get_kml(),'text/xml');
	
	jsonDoc = getKML();
	
	jsonData = JSON.parse(jsonDoc);
	
	//alert(jsonData);
	
	features = jsonData.features;
	
	//alert(features)

	var buildID = "";
	
	for (i=0; i<features.length; i++) {
		var feat = features[i];
		var props = feat.properties;
		
		var buildingInfo = new Object();
		
		//alert(props['id']);
		
		buildingInfo['id'] = props['id'];
		buildingInfo['buildingName'] = props['buildingName'];
		buildingInfo['dateBuilt'] = props['dateBuilt'];
		buildingInfo['dateDemolished'] = props['dateDemolished'];
		buildingInfo['architect'] = props['architects']['name'];
		buildingInfo['status'] = props['status'];
		buildingInfo['history'] = props['history'];
		buildingInfo['occupant'] = props['occupant'];
		buildingInfo['address'] = props['address'];
		buildingInfo['architects'] = props['architects'];
		
		buildingInfo['sources'] = props['sources'];
		
		buildingInfo['photos'] = props['photos']
		
		if (idNum == buildingInfo["id"]) { break; }
	}
	
	showPopup(buildingInfo);
	
	/* var kml = xmlDoc.getElementsByTagName("Placemark");
	
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
	} */
	
	//alert(building_info['name']);
	
}

function checkInput(inText) {
	if (inText) {
		return inText;
	} else {
		return "n/a";
	}
}

var imgHeight = 0;
var imgWidth = 0;

function createPhotoHTML(photos) {
	
	// Bootstrap Carousel:
	var photoHTML = ['<div class="container carousel-container">',
						'<br>',
						'<div id="photoCarousel" class="carousel slide" data-ride="carousel" data-interval="false">',
					 ].join('\n');
		//<!-- Indicators -->
		//<ol class="carousel-indicators">`
	
	// Create the indicators for each image in the carousel
	/*for (var i = 0; i < photos.length; i++) {
		if (i == 0) {
			activeStr = ' class="active"';
		} else {
			activeStr = '';
		}
		photoHTML += `
			<li data-target="#photoCarousel" data-slide-to="${i}"${activeStr}></li>`
	}*/
	//photoHTML += `
		//</ol>
	
	photoHTML += ['', '<!-- Wrapper for slides -->', 
					'<div class="carousel-inner" role="listbox">', 
				  ].join('\n');
	
	// Create the warppers for each image in the carousel
	for (var i = 0; i < photos.length; i++) {
		caption = photos[i]['caption'];
		//link = photos[i]['link'];
		imgURL = photos[i]['url'];
		modernURL = photos[i]['modernUrl'];
		dateTaken = photos[i]['dateTaken']; //.replace('Date Taken: ', '');
		//source = photos[i]['source'].replace('Source: ', '');
		source = photos[i]['sources'][0]
		srcLink = source['url']
		srcName = source['name']
		if (i == 0) {
			activeStr = ' active';
		} else {
			activeStr = '';
		}
		
		// Get dimensions of the current image
		//var imageObject = new Image();
		//imageObject.src = imgSrc[0]
		
		//imgWidth = imageObject.width;
		//imgHeight = imageObject.height;
		
		/* $("<img/>").attr("src", imgSrc[0]).load(function(){
			//s = {w:this.width, h:this.height};
			imgWidth = this.width;
			imgHeight = this.height;
			alert(imgWidth + ' ' + imgHeight);      
		});
		
		var carousel_height = 480;
		//window.alert(carheight_str);
		//carheight_str = carheight_str.replace("px", "");
		//carousel_height = parseInt(carheight_str);
		
		window.alert("imgHeight: " + imgHeight);
		window.alert("carousel_height: " + carousel_height); */
	
		//if (imgHeight > carousel_height) {
		if (modernURL) {
			photoHTML += ['', '<div class="item' + activeStr + ' carousel-item">', 
								'<div id="cf2">', 
									'<img class="bottom carousel-img" src="' + modernURL + '" alt="" onclick="imgClick()">', 
									//'<div class="mag-div magnify">', 
									'<div class="mag-div">', 
										'<div class="large"></div>', 
										'<img class="small top carousel-img" src="' + imgURL + '" alt="" onclick="imgClick()">', 
									'</div>',
								'</div>', 
								'<div class="carousel-caption">', 
									'<p class="carousel-text-sm">***Click on image to toggle between then & now***</p>', 
									'<hr class="trim" style="height:1px;border:none;color:#333;background-color:#AAAAAA">', 
									'<p class="carousel-caption-txt">' + caption + '</p>', 
									'<p class="carousel-text-sm">Date Taken: ' + dateTaken + '</p>', 
									'<p class="carousel-text-sm">Source: <a href="' + srcLink + '" target="_blank">' + srcName + '</a></p>', 
								'</div>', 
							'</div>'
						  ].join('\n');
		} else {
			photoHTML += ['', '<div class="item' + activeStr + ' carousel-item">', 
								//'<div class="mag-div magnify">',
								'<div class="mag-div">',
									'<div class="large"></div>',
									'<img class="small carousel-img" src="' + imgURL + '" alt="">', 
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
									'<p class="carousel-text-sm">Date Taken: ' + dateTaken + '</p>', 
									'<p class="carousel-text-sm">Source: <a href="' + srcLink + '" target="_blank">' + srcName + '</a></p>', 
								'</div>', 
							'</div>'
						  ].join('\n');
		}
		/* } else {
			if (imgSrc.length > 1) {
				photoHTML += ['', '<div class="item' + activeStr + ' carousel-item">', 
									'<div id="cf2">', 
										'<img class="bottom carousel-img" src="' + imgSrc[1] + '" alt="" onclick="imgClick()">', 
										'<img class="top carousel-img" src="' + imgSrc[0] + '" alt="" onclick="imgClick()">', 
									'</div>', 
									'<div class="carousel-caption">', 
										'<p class="carousel-text-sm">***Click on image to toggle between then & now***</p>', 
										'<p class="carousel-caption-txt">' + caption + '</p>', 
										'<p class="carousel-text-sm">Date Taken:' + dateTaken + '</p>', 
										'<p class="carousel-text-sm">Source: <a href="' + link + '">' + source + '</a></p>', 
									'</div>', 
								'</div>'
							  ].join('\n');
			} else {
				photoHTML += ['', '<div class="item' + activeStr + ' carousel-item">', 
									'<img class="carousel-img" src="' + imgSrc[0] + '" alt="">', 
									'<div class="carousel-caption">', 
										'<p class="carousel-caption-txt">' + caption + '</p>', 
										'<p class="carousel-text-sm">Date Taken: ' + dateTaken + '</p>', 
									'<p class="carousel-text-sm">Source: <a href="' + link + '">' + source + '</a></p>', 
									'</div>', 
								'</div>'
							  ].join('\n');
			}
		} */
	}
	
	photoHTML += ['', '</div>', 
					'<!-- Left and right controls -->'
				  ].join('\n')
	
	// Create the left and right arrows for the carousel if more than one image
	if (photos.length > 1) {
		photoHTML += ['', '<a class="left arrow carousel-control" href="#photoCarousel" role="button" data-slide="prev">', 
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
	
	photoHTML += ['', '<ul class="thumbnails-carousel clearfix">'].join('\n');
	
	for (var i = 0; i < photos.length; i++) {
		imgSrc = photos[i]['url'];
		photoHTML += ['', '<li><img class="tn" src="' + imgSrc + '" alt=""></li>'].join('\n');
	}
	
	photoHTML += ['', '</ul>', '</div>', '</div>'].join('\n');

	return photoHTML;
}

function imgClick() {
	$("#cf2 img.top").toggleClass("transparent");
}

var realWidth = 0;
var realHeight = 0;
var prevSrc = "";

function addMouseMoveMag(obj) {
	
	obj.mousemove(function(e){
		if (obj.parent().hasClass("active")) {
			
			//Find the child button
			//var button_child = $(this).children(".btn");
			
			//if (button_child.hasClass("active")) {
			
			var largeChild = obj.children(".large");
			var smallChild = obj.children(".small");
			
			if (prevSrc != smallChild.attr("src")) {
				realWidth = 0;
				realHeight = 0;
				prevSrc = smallChild.attr("src");
				//largeChild.css('margin', smallChild.css('margin'));
				margins = smallChild.css('margin').split(" ");
			}
		
			//When the user hovers on the image, the script will first calculate
			//the native dimensions if they don't exist. Only after the native dimensions
			//are available, the script will show the zoomed version.
			if (!realWidth && !realHeight) {
				//This will create a new image object with the same image as that in .small
				//We cannot directly get the dimensions from .small because of the 
				//width specified to 200px in the html. To get the actual dimensions we have
				//created this image object.
				var imageObject = new Image();
				imageObject.src = smallChild.attr("src");
				
				//This code is wrapped in the .load function which is important.
				//width and height of the object would return 0 if accessed before 
				//the image gets loaded.
				realWidth = imageObject.width;
				realHeight = imageObject.height;
			} else {
				//x/y coordinates of the mouse
				//This is the position of .magnify with respect to the document.
				//NOTE: $(this) = div.magnify
				var magnifyOffset = obj.offset();
				//var magnifyOffset = $(this).position()
				
				//We will deduct the positions of .magnify from the mouse positions with
				//respect to the document to get the mouse positions with respect to the 
				//container(.magnify)
				var mouseX = e.pageX - magnifyOffset.left;
				var mouseY = e.pageY - magnifyOffset.top;
				
				//Finally the code to fade out the glass if the mouse is outside the 
				//	container
				if (mouseX < obj.width() && mouseY < obj.height() && 
					mouseX > 0 && mouseY > 0) {
					largeChild.fadeIn(100);
				} else {
					largeChild.fadeOut(100);
				}
				
				if (largeChild.is(":visible"))
				{
					//The background position of .large will be changed according to the position
					//of the mouse over the .small image. So we will get the ratio of the pixel
					//under the mouse pointer with respect to the image and use that to position 
					//the large image inside the magnifying glass
					var lrgImgX = Math.round(mouseX / smallChild.width() * realWidth - 
						largeChild.width() / 2) * -1;
					var lrgImgY = Math.round(mouseY / smallChild.height() * realHeight - 
						largeChild.height() / 2) * -1;
					//Margin adjustment
					ratio = realWidth / smallChild.width();
					if (margins[1] == undefined) {
						objWidth = obj.width();
						smallWidth = smallChild.width();
						xMargin = ((objWidth - smallWidth) / 2) * ratio;
					} else {
						xMargin = parseInt(margins[1].replace("px", "")) * ratio;
					}
					var bgp = (lrgImgX + xMargin) + "px " + lrgImgY + "px";
					
					//Time to move the magnifying glass with the mouse
					var magX = mouseX - largeChild.width() / 2;
					var magY = mouseY - largeChild.height() / 2;
					//Now the glass moves with the mouse
					//The logic is to deduct half of the glass's width and height from the 
					//mouse coordinates to place it with its center at the mouse coordinates
					
					//If you hover on the image now, you should see the magnifying glass in action
					largeChild.css({left: magX, top: magY, backgroundPosition: bgp});
				}
			}
		}
	})
}

function toggleMagnify(btn) {
	var mgObj = $(btn).closest(".magbutton").siblings(".mag-div");
	if ($(btn).hasClass("active")) {
		mgObj.removeClass("magnify");
		mgObj.unbind('mousemove');
	} else {
		mgObj.addClass("magnify");
		addMouseMoveMag(mgObj);
	}
}

$(document).on("wb-ready.wb-lbx", function(event) {
	/* var realWidth = 0;
	var realHeight = 0;
	var prevSrc = ""; */
	
	//$(".large").css("background","url('" + $(".small").attr("src") + "') no-repeat");
	$(".large").each(function() {
		smallSib = $(this).siblings(".small");
		$(this).css("background","url('" + smallSib.attr("src") + "') no-repeat");
		var imageObject = new Image();
		imageObject.src = smallSib.attr("src");
		smWidth = smallSib.width();
		smHeight = smallSib.height();
		lgWidth = imageObject.width;
		lgHeight = imageObject.height;
		
		if (smWidth == lgWidth && smHeight == lgHeight) {
			$(this).parent().removeClass("magnify");
		}
	});
	
	//Now the mousemove function
	/* $(".magnify").mousemove(function(e){
		if ($(this).parent().hasClass("active")) {
			
			//Find the child button
			//var button_child = $(this).children(".btn");
			
			//if (button_child.hasClass("active")) {
			
			var largeChild = $(this).children(".large");
			var smallChild = $(this).children(".small");
			
			if (prevSrc != smallChild.attr("src")) {
				realWidth = 0;
				realHeight = 0;
				prevSrc = smallChild.attr("src");
				//largeChild.css('margin', smallChild.css('margin'));
				margins = smallChild.css('margin').split(" ");
			}
		
			//When the user hovers on the image, the script will first calculate
			//the native dimensions if they don't exist. Only after the native dimensions
			//are available, the script will show the zoomed version.
			if (!realWidth && !realHeight) {
				//This will create a new image object with the same image as that in .small
				//We cannot directly get the dimensions from .small because of the 
				//width specified to 200px in the html. To get the actual dimensions we have
				//created this image object.
				var imageObject = new Image();
				imageObject.src = smallChild.attr("src");
				
				//This code is wrapped in the .load function which is important.
				//width and height of the object would return 0 if accessed before 
				//the image gets loaded.
				realWidth = imageObject.width;
				realHeight = imageObject.height;
			} else {
				//x/y coordinates of the mouse
				//This is the position of .magnify with respect to the document.
				//NOTE: $(this) = div.magnify
				var magnifyOffset = $(this).offset();
				//var magnifyOffset = $(this).position()
				
				//We will deduct the positions of .magnify from the mouse positions with
				//respect to the document to get the mouse positions with respect to the 
				//container(.magnify)
				var mouseX = e.pageX - magnifyOffset.left;
				var mouseY = e.pageY - magnifyOffset.top;
				
				//Finally the code to fade out the glass if the mouse is outside the 
				//	container
				if (mouseX < $(this).width() && mouseY < $(this).height() && 
					mouseX > 0 && mouseY > 0) {
					largeChild.fadeIn(100);
				} else {
					largeChild.fadeOut(100);
				}
				
				if (largeChild.is(":visible"))
				{
					//The background position of .large will be changed according to the position
					//of the mouse over the .small image. So we will get the ratio of the pixel
					//under the mouse pointer with respect to the image and use that to position 
					//the large image inside the magnifying glass
					var lrgImgX = Math.round(mouseX / smallChild.width() * realWidth - 
						largeChild.width() / 2) * -1;
					var lrgImgY = Math.round(mouseY / smallChild.height() * realHeight - 
						largeChild.height() / 2) * -1;
					//Margin adjustment
					ratio = realWidth / smallChild.width();
					xMargin = parseInt(margins[1].replace("px", "")) * ratio;
					var bgp = (lrgImgX + xMargin) + "px " + lrgImgY + "px";
					
					//Time to move the magnifying glass with the mouse
					var magX = mouseX - largeChild.width() / 2;
					var magY = mouseY - largeChild.height() / 2;
					//Now the glass moves with the mouse
					//The logic is to deduct half of the glass's width and height from the 
					//mouse coordinates to place it with its center at the mouse coordinates
					
					//If you hover on the image now, you should see the magnifying glass in action
					largeChild.css({left: magX, top: magY, backgroundPosition: bgp});
				}
			}
		}
	}) */
});

function showPopup(props, featId) {
	//info.tooltip('hide');

	$(".modal-title").html(props['buildingName']).text();
	
	
	// Get the address
	addressJSON = props['address'];
	addressStr = addressJSON['unitNumber'] + " " + addressJSON['street'];
	//building_info['addrss'] = addressStr;
	
	if (addressStr == "") {
		addressStr = 'n/a';
	}
	
	// Get the architects
	archLst = props['architects'];
	archHTML = "";
	for (var i=0; i<archLst.length; i++) {
		archName = archLst[i]['name'];
		archURL = archLst[i]['url'];
		archHTML += ['<a class="on-white" href="' + archURL + '" target="_blank">', 
							archName, 
					  '</a>', 
					  '<br>'
					  ].join('\n');
	}
	
	if (archHTML == "") {
		archHTML = 'n/a';
	}
	
	popupHTML = getPopupContent();
	popupHTML = popupHTML.replace('${id}', checkInput(props['id']));
	popupHTML = popupHTML.replace('${dateBuilt}', checkInput(props['dateBuilt']));
	popupHTML = popupHTML.replace('${dateDemolished}', checkInput(props['dateDemolished']));
	popupHTML = popupHTML.replace('${architect}', archHTML);
	popupHTML = popupHTML.replace('${status}', checkInput(props['status']));
	popupHTML = popupHTML.replace('${history}', checkInput(props['history']));
	popupHTML = popupHTML.replace('${addrss}', addressStr);
	popupHTML = popupHTML.replace('${occupant}', checkInput(props['occupant']));
	
	// Create links for sources:
	sources = checkInput(props['sources']);
	if (sources.length > 0) {
		//sources = sources.replace(/<a/g, '<a target="_blank" class="popup-a"');
		sourceHTML = '';
		for (var i = 0; i < sources.length; i++) {
			srcName = sources[i]['name'];
			srcURL = sources[i]['url'];
			sourceHTML += [srcName + ':',
							'<a class="on-white" href="' + srcURL + '" target="_blank">', 
								srcURL, 
							'</a>', 
							'<br>'
						  ].join('\n');
		}
		popupHTML = popupHTML.replace('${sources}', sourceHTML);
	} else {
		popupHTML = popupHTML.replace('${sources}', 'n/a');
	}
	
	/* photoHTML = props['photos'];
	parser = new DOMParser();
	htmlDoc = parser.parseFromString(photoHTML, "text/html");
	
	// Correct htmlDoc if null
	if (htmlDoc == null) {
		htmlDoc = document.createElement('div');
		htmlDoc.innerHTML = photoHTML;
	}
	
	table_elements = htmlDoc.getElementsByClassName('container');
	
	// Grab each photo info:
	var photos = [];
	for (var i = 0; i < table_elements.length; i++) {
		
		var photo = {};
		child_elements = table_elements[i].children;
		
		// Get the caption
		caption = child_elements[0].innerText;
		photo['caption'] = caption;
		
		// Get the source URL of photo
		img_element = child_elements[1].getElementsByTagName('img');
		var imgSrc = [];
		if (img_element.length > 1) {
			imgSrc.push(img_element[1].src);
			imgSrc.push(img_element[0].src);
		} else {
			imgSrc.push(img_element[0].src);
		}
		photo['imgSrc'] = imgSrc;
		
		// Parse source info
		source_str = child_elements[2].innerText;
		sources = source_str.trim().split(/\r?\n/).filter(Boolean);
		var filter_srcs = sources.filter(function(v){return v.replace(/\s/g,'')!==''});
		dateTaken = filter_srcs[0];
		if (filter_srcs.length == 3) {
			source = filter_srcs[2];
		} else {
			source = "";
		}
		photo['dateTaken'] = dateTaken;
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
	} */
	
	photoInfo = props['photos'];
	
	//alert(photoInfo);
	
	newPhHTML = createPhotoHTML(photoInfo);
	//alert(newPhHTML);
	
	popupHTML = popupHTML.replace('${photos}', newPhHTML);
	if (featId > -1 && featId != null) {
		popupHTML += "\n<!--Feature_ID=" + featId.toString() + "-->"
	}
	
	$(".modal-body").html(popupHTML);
	
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