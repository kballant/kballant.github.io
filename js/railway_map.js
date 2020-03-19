/* author:		Kevin Ballantyne
	updated:		20190112
	version:		1.0
*/

function resizePopup(img) {
	/* Resizes the popup based on the input image.
		NOTE: This method is no longer used.
	*/ 

	height = img.height;
	width = img.width;
	mapPopup = document.getElementById('inline_content').style;
	//alert(mapPopup.cssText);
	popupHeight = mapPopup.style.height;
	
	//alert("height: " + height + ", width: " + width + ", popup_height: " + popupHeight);
}

function changeColour(feature, year, alpha='1') {
	//outStyle = changeColour(feature);
	
	//var owner = feature.get('OWNER')
	
	// Set the width of the line (road) based on the zoom level
	if (map.getView().getZoom() <= 13) {
		width = 3;
		dash = false;
	} else if (map.getView().getZoom() > 13 & map.getView().getZoom() <= 16) {
		width = 4;
		dash = true;
	} else if (map.getView().getZoom() > 16 & map.getView().getZoom() <= 18) {
		width = 4;
		dash = true;
	} else {
		width = 5;
		dash = true;
	}
	
	if (year == 'Intro' || year === undefined) {
		colour = 'rgba(0,0,0,0)';
		outStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: colour,
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
		});
		
		return outStyle
	}
	
	var company = feature.get('companies')[parseInt(year)];
	
	if (company === undefined) {
		colour = 'rgba(0,0,0,' + alpha + ')';
		outline = 'rgba(0,0,0,' + alpha + ')';
		capColour = 'rgba(0,0,0,' + alpha + ')';
	} else {
		colour = company[1];
		outline = '#000000';
		capColour = '#FFFFFF';
	}
	
	/* switch(owner) {
		case 'Canadian National Railways':
			colour = 'rgba(220,0,0,' + alpha + ')' //,0.7)'
			break;
		case 'Canadian Pacific Railway':
			colour = 'rgba(149,62,0,' + alpha + ')'
			break;
		case 'New York Central Railway':
			colour = 'rgba(0,0,200,' + alpha + ')'
			break;
		case 'Ottawa Terminal Railway':
			colour = 'rgba(255,95,0,' + alpha + ')'
			break;
		default:
			//window.alert(owner);
			colour = 'rgba(0,0,0,' + alpha + ')'
	}; */
	var outStyle = [
		// Create outline around line
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: colour,
				lineJoin: 'bevel', 
				lineCap: 'butt', 
				width: width + 2
			})
		}), 
		// Create centre colour
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: colour, 
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

	if (dash == true) {
		outStyle.push(
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					//color: '#FFA24B',
					color: capColour, 
					lineCap: 'square', 
					lineDash: [10, 20], 
					//lineDashOffset: 2, 
					width: width
				})
			})
		)
	};
	
	return outStyle
}

// #######################################################################

// Set the projection of the map, in this case WGS84 Web Mercator
// var projection = ol.proj.get('EPSG:3857');

function setPanel() {
	// Set the height of the carousel item
	var sideBars = $(".sidepanel-bar");
	var sideBar = sideBars[0];
	var carousel = $('.carousel');
	var legends = $('.sidepanel-legend');
	//var carouselItems = $('.item');
	var sidePanels = $(".sidepanel-text");

	var sideBarHeight = sideBar.clientHeight;
	var restHeight = carousel.height();
	//var legHeight = legend.clientHeight();
	var remainHeight = parseFloat(restHeight) - parseFloat(sideBarHeight);
	for (i = 0; i < sidePanels.length; i++) {
		var sidePanel = sidePanels[i];
		//var legend = legends[i];
		//var legendHeight = legend.clientHeight;
		//panelHeight = remainHeight - parseFloat(legendHeight);
		panelHeight = remainHeight - 10;
		//sidePanel.height = remainHeight;
		//sidePanel.css({'height': remainHeight + "px"});
		sidePanel.style.height = panelHeight + 'px';
	}
}

$(document).ready(function(event){
	setPanel();
});

window.addEventListener('resize', function(event){
	setPanel();
});

//var clickType = 'none';

//document.getElementsByClassName("sidepanel-bar").style.height = "50px";

years = ['Intro', '1855', '1870', '1871', '1880', '1883', 
		'1893', '1896', '1898', '1901', '1909', '1912', 
		'1913', '1915', '1939', '1952', '1953', '1957', 
		'1960', '1962', '1967', '1970', '1972', '1982', 
		'1984', '1986', '1990', '1998', '1999', '2002', 
		'2014'];

// Add all the base layers
lyrList = addBaseLayers()

// Add the railways layer
var opts = {};
opts['Name'] = 'rails'
opts['Title'] = 'Railways'
//opts['URL'] = '../files/1930_Ottawa_Railways.geojson', 
opts['URL'] = '../files/Ottawa_Railway_Temporal.geojson', 
opts['dataProj'] = 'EPSG:4269'
opts['featProj'] = 'EPSG:3857'

var styleFunction = function (feature, resolution) {
	/* Sets the style for the rails layer based on the map's zoom
	:return: A OL Style object with the colour and width of the road based
				on the zoom.
	*/
	
	outStyle = changeColour(feature);
	
	return outStyle;
	
	// Return the new style for the line
	/* return [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				//color: '#FFA24B',
				color: colour,
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
	] */
};

lyrList = addLayer(opts, lyrList, styleFunction);

// ############################################################################

// Set the zoom, centre and rotation of the map
var viewInfo = {};
viewInfo['zoom'] = 10;
viewInfo['centre'] = ol.proj.transform([-75.67824, 45.41501], "EPSG:4326", "EPSG:3857");
viewInfo['rotation'] = 0;

//var custContr = createCustControl();

fullScreen = ol.control.defaults().extend([
				new ol.control.FullScreen({
					source: 'fullscreen'
				})
			]);

// Create the map
map = createMap(lyrList, viewInfo, fullScreen); //custContr);

//railLayer.setStyle(styleFunction());

// Bind the popup close
bindClose();

// Bind the popup open
bindOpen();

// Create the feature overlay for highlighting
featOverlays = []
widths = [2, 3, 5];
featRailOverlay = addFeatOverlay(map, 'rails_overlay', widths);
map.addOverlay(featRailOverlay);
featOverlays.push(featRailOverlay);

map.on('moveend', function(e) {
	/*var lyr = map.getLayersByName('vectorLayer')[0];
	map.removeLayer(lyr);*/
	var curYear = $('div.active')[0].id;
	setStyles(curYear);
});

var carClicked = false;

// Add popup
//map = addPopup(map);

// Add single click event to map
map = addSingleClick(map)

// Set the layer visible
setVisible(lyrList);

// Add mouse move event to map
map = addPointerMove(map);

function setStyles(val) {
	
	// Get all the features from the rails layer
	var lyrs = map.getLayers();
	var lyrTotal = lyrs.getLength();
	for (i = 0; i < lyrTotal; i++) {
		var curLyr = lyrs.getArray()[i]
		var lyrName = curLyr.get('name');
		if (lyrName == 'rails') {
			var feats = curLyr.getSource().getFeatures()
			//var lyrStyle = styleFunction
		}
	}
	
	if (val == 'Intro' || val === undefined) {
		for (i = 0; i < feats.length; i++) {
			var curFeat = feats[i];
			chgStyle = changeColour(curFeat, val, '0');
			curFeat.setStyle(chgStyle);
		}	
		return null;
	}
	
	for (i = 0; i < feats.length; i++) {
		// Get the completed and removed dates from
		//	each feature
		var curFeat = feats[i];
		var featStyle = curFeat.getStyleFunction();
		var completed = curFeat.get('completed');
		var removed = curFeat.get('removed');
		//var companies = curFeat.get('companies')[parseInt(val)];
		
		// Compare current year with date completed
		var dVal = new Date(val + '-12-31');
		var dComp = new Date(completed);
		
		// If there is no removed date, make it today
		if (removed === undefined || removed == "") {
			var dRem = new Date();
		} else {
			var dRem = new Date(removed);
		}
		
		// Set the transparency of the feature based 
		//	on the date
		if (dComp < dVal && dRem > dVal) {
			//color = featStyle.getFill();
			//console.log(color);
			chgStyle = changeColour(curFeat, val, '1');
		} else if (dRem < dVal) {
			//chgStyle = changeColour(curFeat, '0.3');
			chgStyle = changeColour(curFeat, val, '0');
		} else {
			chgStyle = changeColour(curFeat, val, '0');
		}
		curFeat.setStyle(chgStyle);
	}
}

function setYear(year, origin) {
	
	setStyles(year);
	
	if (origin == 'carousel') {
		mySlider.setValues(year);
	} else {
		setCarousel(year)
	}
	
	//items = $('.item');
	//var totalItems = $('.item').length;
}

function setCarousel(val) {
	//if (clickType != 'carousel') {
	// Set the carousel to the date
	var carouselEl = $('#myCarousel');
	var carouselItems = $('.item');
	
	for (i = 0; i < carouselItems.length; i++) {
		var item = carouselItems[i];
		var curYear = item.id;
		if (curYear == val) {
			carouselEl.carousel(i);
		}
	}
	//}
}

/* $('#myCarousel').on('slid.bs.carousel', function () {
	
	var curYear = $('div.active')[0].id;
	setYear(curYear, 'carousel');
	
	//mySlider.setValues(curYear);
}) */

$('.right.carousel-control').click(function () {
	var curYear = $('div.active')[0].id;
	
	var yearIdx = years.indexOf(curYear);
	
	if (yearIdx < years.length - 1) {
		var curYear = years[yearIdx + 1];
	} else {
		var curYear = years[0]
	}
	
	setYear(curYear, 'carousel');
})

$('.left.carousel-control').click(function () {
	var curYear = $('div.active')[0].id;
	
	var yearIdx = years.indexOf(curYear);
	
	if (yearIdx > 0) {
		var curYear = years[yearIdx - 1];
	} else {
		var curYear = years[years.length - 1]
	}
	
	setYear(curYear, 'carousel');
})

// Create the slider object
var mySlider = new rSlider({
    target: '#slider',
    /*values: [1855, 1870, 1871, 1880, 1883, 1893, 
			1896, 1898, 1901, 1909, 1912, 1913, 
			1915, 1924, 1939, 1942, 1952, 1953, 
			1957, 1960, 1962, 1967, 1970, 1972, 
			1982, 1984, 1986, 1990, 1998, 1999, 
			2002, 2014], */
	values: years,
    range: false, // range slider
	width: 1000, 
	tooltip: false, 
	onChange: function (vals) {
				//console.log('slider');
				//console.log(vals);
				setYear(vals, 'slider');
				//setCarousel(vals);
			}
});
