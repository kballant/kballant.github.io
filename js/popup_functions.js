
/* // Make the DIV element draggable:
dragElement(document.getElementById("inline_content"));

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
} */

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getPopupContent(template) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			out_content = xhttp.responseText;
			//alert(out_content);
			return out_content;
		}
	};
	xhttp.open("GET", template, false);
	xhttp.send();
	out_content = xhttp.responseText;
	//alert(out_content);
	return out_content;
}

function getImageDimensions(img_url) {
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', img_url, true);
	xhr.onreadystatechange = function(){
		if ( xhr.readyState == 4 ) {
			if ( xhr.status == 200 ) {
				alert('Size in bytes: ' + xhr.getResponseHeader('Content-Length'));
			} else {
				alert('ERROR');
			}
		}
	};
	xhr.send(null);
}

function checkInput(in_text) {
	if (in_text) {
		return in_text;
	} else {
		return "n/a";
	}
}

function formatDate(in_date, format='historic') {
	var out_date = '';
	if (format == 'historic') {
		out_date = in_date.getDate() + ' ' + months[in_date.getMonth()] + ' ' + in_date.getFullYear();
	}
	
	return out_date;
}

var real_width = 0;
var real_height = 0;
var prev_src = "";

function addMouseMoveMag(obj) {
	
	obj.mousemove(function(e){
		if (obj.parent().hasClass("active")) {
			
			//Find the child button
			//var button_child = $(this).children(".btn");
			
			//if (button_child.hasClass("active")) {
			
			var large_child = obj.children(".large");
			var small_child = obj.children(".small");
			
			if (prev_src != small_child.attr("src")) {
				real_width = 0;
				real_height = 0;
				prev_src = small_child.attr("src");
				//large_child.css('margin', small_child.css('margin'));
				margins = small_child.css('margin').split(" ");
			}
		
			//When the user hovers on the image, the script will first calculate
			//the native dimensions if they don't exist. Only after the native dimensions
			//are available, the script will show the zoomed version.
			if (!real_width && !real_height) {
				//This will create a new image object with the same image as that in .small
				//We cannot directly get the dimensions from .small because of the 
				//width specified to 200px in the html. To get the actual dimensions we have
				//created this image object.
				var image_object = new Image();
				image_object.src = small_child.attr("src");
				
				//This code is wrapped in the .load function which is important.
				//width and height of the object would return 0 if accessed before 
				//the image gets loaded.
				real_width = image_object.width;
				real_height = image_object.height;
			} else {
				//x/y coordinates of the mouse
				//This is the position of .magnify with respect to the document.
				//NOTE: $(this) = div.magnify
				var magnify_offset = obj.offset();
				//var magnify_offset = $(this).position()
				
				//We will deduct the positions of .magnify from the mouse positions with
				//respect to the document to get the mouse positions with respect to the 
				//container(.magnify)
				var mouse_x = e.pageX - magnify_offset.left;
				var mouse_y = e.pageY - magnify_offset.top;
				
				//Finally the code to fade out the glass if the mouse is outside the 
				//	container
				if (mouse_x < obj.width() && mouse_y < obj.height() && 
					mouse_x > 0 && mouse_y > 0) {
					large_child.fadeIn(100);
				} else {
					large_child.fadeOut(100);
				}
				
				if (large_child.is(":visible"))
				{
					//The background position of .large will be changed according to the position
					//of the mouse over the .small image. So we will get the ratio of the pixel
					//under the mouse pointer with respect to the image and use that to position 
					//the large image inside the magnifying glass
					var lrg_img_x = Math.round(mouse_x / small_child.width() * real_width - 
						large_child.width() / 2) * -1;
					var lrg_img_y = Math.round(mouse_y / small_child.height() * real_height - 
						large_child.height() / 2) * -1;
					//Margin adjustment
					ratio = real_width / small_child.width();
					if (margins[1] == undefined) {
						obj_width = obj.width();
						small_width = small_child.width();
						x_margin = ((obj_width - small_width) / 2) * ratio;
					} else {
						x_margin = parseInt(margins[1].replace("px", "")) * ratio;
					}
					var bgp = (lrg_img_x + x_margin) + "px " + lrg_img_y + "px";
					
					//Time to move the magnifying glass with the mouse
					var mag_x = mouse_x - large_child.width() / 2;
					var mag_y = mouse_y - large_child.height() / 2;
					//Now the glass moves with the mouse
					//The logic is to deduct half of the glass's width and height from the 
					//mouse coordinates to place it with its center at the mouse coordinates
					
					//If you hover on the image now, you should see the magnifying glass in action
					large_child.css({left: mag_x, top: mag_y, backgroundPosition: bgp});
				}
			}
		}
	})
}

function toggleMagnify(btn) {
	var mg_obj = $(btn).closest(".magbutton").siblings(".mag-div");
	if ($(btn).hasClass("active")) {
		mg_obj.removeClass("magnify");
		mg_obj.unbind('mousemove');
	} else {
		mg_obj.addClass("magnify");
		addMouseMoveMag(mg_obj);
	}
}

$(document).on("wb-ready.wb-lbx", function(event) {
	/* var real_width = 0;
	var real_height = 0;
	var prev_src = ""; */
	
	//$(".large").css("background","url('" + $(".small").attr("src") + "') no-repeat");
	$(".large").each(function() {
		small_sib = $(this).siblings(".small");
		$(this).css("background","url('" + small_sib.attr("src") + "') no-repeat");
		var image_object = new Image();
		image_object.src = small_sib.attr("src");
		sm_width = small_sib.width();
		sm_height = small_sib.height();
		lg_width = image_object.width;
		lg_height = image_object.height;
		
		if (sm_width == lg_width && sm_height == lg_height) {
			$(this).parent().removeClass("magnify");
		}
	});
});

function triggerPopup(popup_html) {
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