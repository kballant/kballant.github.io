class Map {
	
	constructor() {
		// Determines whether the page will be locked or not
		this.POPUP_LOCK = false;
		
		// Set the projection of the map, in this case WGS84 Web Mercator
		this.projection = ol.proj.get('EPSG:3857');
		
		// Create the Bing Maps background layer
		this.bingLayer = new ol.layer.Tile({
			source: new ol.source.BingMaps({
				imagerySet: 'Aerial',
				key: 'AhCYdXJJqvQnyMnREP6yvB8LBqky1iY8k_ZfEZpFpjKC7mXRduWYXfSnV1683P3_'
				//crossOrigin: 'anonymous'
			})
		});
		
		// Create a OpenStreetMaps source and tile layer
		this.osmSource = new ol.source.OSM();
		this.osmLayer = new ol.layer.Tile({source: this.osmSource});
		
		this.bingLayer.set('name', 'bingmap');
		this.osmLayer.set('name', 'osm');
		
		this.lyrList = [this.bingLayer, this.osmLayer];
		
		// Set the zoom, centre and rotation of the map
		this.zoom = 13;
		this.centre = ol.proj.transform([-75.67824, 45.41501], "EPSG:4326", 
										"EPSG:3857");
		this.rotation = 0;
		
		// Get the popup HTML content
		this.popup_html = getPopupContent();
		
		// Reset the centre variable based on the URL
		getCentre();
	}
		
	bindPopupClose() {
		
		// When the Magnific popup is closed
		$(document).on("mfpClose", function(event) {

			// Get the popup HTML
			var popupHTML = $(".modal-body").html();
			
			// Find the location of the Feature_ID in the popup HTML text
			var startPos = popupHTML.search("Feature_ID");
			var endPos = popupHTML.indexOf("-->", startPos);
			var subStr = popupHTML.substring(startPos, endPos);
			var featStr = subStr.split("=")[1];
			
			// Get the feature ID
			var featId = parseInt(featStr)

			// Call the closePopup in the popup.js with the feature ID
			closePopup(featId);
		});
	}
	
	bindPopupOpen() {
		// When the Magnific popup is opened
		$(document).on("mfpOpen", function(event) {

			// Get the HTML text for the popup from the modal-body element on the page
			var popupHTML = $(".modal-body").html();
			
			// Convert the HTML text to a DOMParser
			parser = new DOMParser();
			htmlDoc = parser.parseFromString(popupHTML, "text/html");
			
			// Correct htmlDoc if null
			if (htmlDoc == null) {
				htmlDoc = document.createElement('div');
				htmlDoc.innerHTML = popupHTML;
			}
			
			// Get the img element
			imgElements = htmlDoc.getElementsByTagName('img');
			
			// Calculate the width of the image based on the height
			function calculateWidth(img, height) {
				var newImg = document.createElement('img');
				newImg.src = img.src;
				
				if (newImg.naturalWidth) {
					imgHeight = newImg.naturalHeight;
					imgWidth = newImg.naturalWidth;
				}
				
				aspect = imgWidth / imgHeight;
				
				newWidth = height * aspect;
				
				newWidth = parseInt(newWidth.toString());
				
				return newWidth;
			}
			
			// Get the contents of the popup from the page (element 
			//		with id 'inline_content')
			var mapPopup = document.getElementById('inline_content');
			
			// Set the width of the popup based on the window size
			if ($(window).width() > 768) {
				mapPopup.style.width = "600px";
			} else {
				mapPopup.style.width = "100% !important";
			}
		});
	}
	
	createFeatureOverlay() {
		
		// Create the feature overlay for highlighting buildings
		this.collection = new ol.Collection();
		this.featureOverlay = new ol.layer.Vector({
			map: this.map,
			source: new ol.source.Vector({
				features: this.collection,
				useSpatialIndex: false // optional, might improve performance
			}),
			updateWhileAnimating: true, // optional, for instant visual feedback
			updateWhileInteracting: true // optional, for instant visual feedback
		});
	}
	
	addLayer(inLayer) {
		this.lyrList.push(inLayer);
	}
	
	createMap() {
		// Create the OL map object
		this.map = new ol.Map({
			layers: this.lyr_list,
			target: document.getElementById('map'),
			view: new ol.View({
				center: this.centre, 
				projection: this.projection,
				zoom: this.zoom
			})
		});
	}
	
	getCentre() {
		/* Determines the centre of the map based on the URL substring's id
		:return: None
		*/
		
		// Get the URL substring
		var loc_val = location.search.substring(1);
		
		// If the URL substring as 'id'
		if (loc_val != "" && loc_val.indexOf("id") == -1) {
			// Get the 'id' passed in from the URL
			queryString = location.search.substring(1);
			// Set the coordinates
			coordinates = queryString.split('/');
			// Set the zoom level
			this.zoom = parseInt(coordinates[0].replace('map=', ''));
			// Set the centre
			this.centre = coordinates[1].split(',').map(function(item) {
				return parseFloat(item);
			});
			// Set the rotation
			this.rotation = parseInt(coordinates[2]);
		}
	}
	
	getMap() {
		return this.map;
	}
	
	setPopup() {
		// Get the <div> with id 'popup' from the map page
		var element = document.getElementById('popup');

		// Create the popup overlay on the map
		var popup = new ol.Overlay({
			element: element
		});
		this.map.addOverlay(popup);
	};
	
	highlightFeature(pixel) {
		/* Highlights a feature that is located at pixel.
		*/
		
		var buildHighlight;
		var railsHighlight;
		
		// Locate the feature at the pixel location
		var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return feature;
		});
		
		// Locate the layer of the feature at the pixel location
		var lyr = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return layer;
		});
		
		// Highlight the proper feature using the various feature overlay layers
		if (lyr) {
			if (lyr.get('name') == 'rails') {
				// If the layer is 'rails'
				if (feature !== railsHighlight) {
					// If feature and railsHighlight are not the same
					//		meaning if the feature the cursor is over has changed
					//		from the previous highlighted feature
					if (featureOverlay.getSource().getFeatures().length > 0) {
						// If there are any highlighted building features in the 
						//		featureOverlay, remove them
						featureOverlay.getSource().removeFeature(buildHighlight);
						buildHighlight = null;
					}
					if (railsHighlight) {
						// If there are any highlighted rails features in the 
						//		featRailOverlay, remove them
						if (featRailOverlay.getSource().getFeatures().length > 0) {
							featRailOverlay.getSource().removeFeature(railsHighlight);
						}
					}
					if (feature) {
						// Add the feature to featRailOverlay
						featRailOverlay.getSource().addFeature(feature);
					}
					// Set railsHighlight to the feature to keep track of what feature
					//		if currently highlighted
					railsHighlight = feature;
				}
			} else {
				// If the layer is buildings
				if (feature !== buildHighlight) {
					// If feature and buildHighlight are not the same
					//		meaning if the feature the cursor is over has changed
					//		from the previous highlighted feature
					if (featRailOverlay.getSource().getFeatures().length > 0) {
						// If there are any highlighted building features in the 
						//		featureOverlay, remove them
						featRailOverlay.getSource().removeFeature(railsHighlight);
						railsHighlight = null;
					}
					if (buildHighlight) {
						// If there are any highlighted rails features in the 
						//		featRailOverlay, remove them
						if (featureOverlay.getSource().getFeatures().length > 0) {
							featureOverlay.getSource().removeFeature(buildHighlight);
						}
					}
					if (feature) {
						// Add the feature to featureOverlay
						featureOverlay.getSource().addFeature(feature);
					}
					// Set buildHighlight to the feature to keep track of what feature
					//		if currently highlighted
					buildHighlight = feature;
				}
			}
		} else {
			// If no layer provided, remove all previous highlights
			if (feature !== buildHighlight) {
				if (buildHighlight) {
					if (featureOverlay.getSource().getFeatures().length > 0) {
						featureOverlay.getSource().removeFeature(buildHighlight);
						buildHighlight = null;
					}
				}
			}
			if (feature !== railsHighlight) {
				if (railsHighlight) {
					if (featRailOverlay.getSource().getFeatures().length > 0) {
						featRailOverlay.getSource().removeFeature(railsHighlight);
						railsHighlight = null;
					}
				}
			}
		}
	};
	
	displayPopup(evt, pixel) {
		/* Displays the popup for a feature at pixel
		*/
		
		// Lock the web page
		POPUP_LOCK = true;
		
		var features = [];
		
		// Check for mobile device
		if (detectmob) {
			// If mobile device, using the getFeature function
			var feature = getFeature(pixel);
			features.push(feature);
		} else {
			// Otherwise, use forEachFeatureAtPixel map function
			map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				features.push(feature);
			}, null);
		}
		
		// If features were found at pixel location
		if (features.length > 0) {
			// Get the element from the popup overlay
			var element_pop = popup.getElement();
			
			// Set the feature to the first feature found
			feature = features[0];
			
			if (feature) {
				//if (layer.get('name') != 'rails') {
				
				// Get the feature's properties
				var properties = feature.getProperties();
				
				// Set the feature's style to highlighted
				/* var tmpstyle = styles[properties['styleUrl'].split("#")[1]];
				if(typeof tmpstyle !== 'undefined'){
					feature.setStyle(tmpstyle[1]);
				} else {
					feature.setStyle(styles['undefined'][0]);
				}; */
				
				// Set the popup's position to the event's coordinates
				popup.setPosition(evt.coordinate);
				
				// Set the view to the building location
				var view_tmp = map.getView();
				var featId = feature.getId();
				
				setHighlight(featId);
				
				// Open the popup for the feature
				getPopup(feature);
				
				// Return the found feature
				return feature;
			} else {
				// If the feature is undefined at pixel location
				// Destroy the element's popover
				$(element_pop).popover('destroy');
			}
		} else {
			// If there are no features at pixel location
			
			// Get the element from the popup overlay
			var element_pop = popup.getElement();
			
			// Destroy the element's popover
			$(element_pop).popover('destroy');
			
			// Get the popup HTML content
			popup_html = '';
			popup_html = getPopupContent();
			
			// Get the feature ID from the popup element's content
			var featId = $(element_pop).data('fid');
			
		};
		
		// Unlock the page
		POPUP_LOCK = false;
		
		// Return the feature style back to normal
		setHighlight(featId);
		
		// Hide the tool tip
		$('#info').tooltip('hide');
	}
	
	addClickEvent() {
		// Display popup on click
		this,map.on('singleclick', function(evt) {
			//var pixel = evt;
			if (detectmob) {
				// If using a mobile device, the location is based on the 
				//		current coordinates
				var coordinates = this.map.getEventCoordinate(evt.originalEvent);
				//var feature = vectorlayer.getClosestFeatureToCoordinate(coordinates);
				displayPopup(evt, coordinates);
			} else {
				// If not using a mobile device, the location is based on the 
				//		cursor location
				var pixel = this.map.getEventPixel(evt.originalEvent);
				displayPopup(evt, pixel);
			}
		});
	};
	
	setVisible() {
		// Set Bing Maps layer visible on load
		var osmRad = document.getElementById('osm');
		bingLayer.setVisible(false);
		//kmlLayer.setVisible(false);
		osmLayer.setVisible(true);
		osmRad.click();
	};
	
	addPointMove() {
		// Change mouse cursor when over feature
		this.map.on('pointermove', function(e) {
			var pixel = this.map.getEventPixel(e.originalEvent);
			highlightFeature(pixel);
			var hit = this.map.hasFeatureAtPixel(pixel);
			this.map.getTarget().style.cursor = hit ? 'pointer' : '';
		});
	}