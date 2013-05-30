/*
	stretcharmstrong: developed by Anthony Armstrong
		version: 1.3.0
		last modified: 2013-05-30
*/

(function($) {

	// static controller, I guess...
	$.fn.stretcharmstrong = function(method) {

		// has a method been passed in?
		if (public_methods[method]) {

			// call the given method with any arguments that may have been passed in
			return public_methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		// if an object has been passed in or no method...
		} else if (typeof method === 'object' || !method) {

			// call the init method
			return private_methods.init.apply(this, arguments);

		} else {

			// throw an exception
			$.error('stretcharmstrong - method ' + method + ' does not exist.');
		}

	};

	var private_methods = {

		init : function(options) {

			// private defaults
			var members = {
				'element_attr'       : {},
				'wrapper'         : null,
				'current_element'  : 0,
				'element_count'    : 0,
				'master_count'     : 0,
				'interval'         : false,
				'images_array'     : null,
				'initialized'      : false,
				'transition_state' : 'paused',
				'onloads_triggered' : 0,
				'weighted_element'  : null,
			};
			
			// create some defaults, extending them with any options that were provided
		    var settings = $.extend(true, {}, { // use empty json as second object to preserve data ofr each instantiation...
		    	'rotate'       : false,
		    	'rotate_interval' : 1000,
		    	'transition'   : {
		    		'type'        : 'fade',
		    		'duration'    : 1000,
		    		'orientation' : 'horizontal'
		    	},
		    	'weighted'     : false,
		      	'element'      : 'img',
		      	'background'   : true,
		      	'ajax'         : null,
		      	'images'       : null,
		      	'resize'       : true,
		      	'ignore_first' : false,
		      	'custom_onloads': {
		      		'count' : 0,
		      		'timeout' : 10
		      	},
		      	'loading_element' : null,
		      	transition_complete : function(event) {},
		      	cycle_complete : function(event) {},
		      	rotate_changed : function(event) {},
		      	on_resize : function(event) {}
		    }, options, members); // combine members into settings so we can use them for each instance

		    // store settings in data object so we can have mulitple instances...
		    $(this).data('settings', settings);

		    // re-set settings
		    settings = $(this).data('settings');

		    // determine sender
		    if (typeof this[0] === 'object') {

		    	// set wrapper member
		    	element_handle = this;

		    	// no elements in wrapper, try ajax or array init...
		    	if (element_handle.children().size() <= 0) {

		    		// is the ajax path set?
		    		if (settings.ajax != null) {

		    			// make the request...
		    			private_methods.ajax_request(element_handle);

		    		}

		    		// if images have been passed in 
		    		if (settings.images != null) {

		    			// are they an array?
		    			if (!$.isArray(settings.images)) {
		    				$.error('stretcharmstrong - the data passed as images is not an array.');
		    			}

		    			// set images_array
		    			settings.images_array = settings.images;

		    		}

		    		if (settings.images == null && settings.ajax == null) {
		    			$.error('stretcharmstrong - you must pass in an array of images or an ajax path if not using elements \'inline\'');
		    		} 

		    		// call inject method
		    		private_methods.inject_to_dom(element_handle);


		    	} 

		    	// prepare elements...
	    		private_methods.prepare_elements(this);

		    }
  
		},

		prepare_elements : function(element_handle) {

			var settings = element_handle.data('settings');
			var self = this;

			// set wrapper shizzle
			this.set_wrapper_styles(element_handle);

			// give some basic styling to elements
			var elements = element_handle.children(settings.element);
			var reversed_elements = elements.toArray().reverse();
			$(reversed_elements).each(function(i) {
				var z_index = settings.transition.type == 'fade' ? i : 1;
				$(this).css({
					'position' : 'absolute',
					'display'  : 'none',
					'top'      : '0px',
					'left'     : '0px',
					'z-index'  : z_index
				});
			});

			// give an id to each element
			$(elements).each(function(i) {
				$(this).attr('data-index', i);

				// give the 1st slide (current by default) a data of current
				if (i == 0) {
					$(this).attr('data-slide', 'current');
				}

			});

			if (settings.weighted) {

				// create weighted element
				settings.weighted_element = $('<div />');
				settings.weighted_element.attr('data-slide', 'weighted');
				settings.weighted_element.css({
					'position' : 'relative',
					'display'  : 'block',
					'margin'   : '0 auto'
				});
				settings.weighted_element.insertAfter(element_handle);
			}

			

			var loading_overlay = $(settings.loading_element);

			// optionally wait for custom onload
			if (settings.custom_onloads.count > 0) {

				var count = 0;

				// set a timeout here as we don't want to wait forever...
				var onload_timeout = setInterval(function() {

					count++;

					// check onloads
					if (settings.onloads_triggered >= settings.custom_onloads.count) {

					  	// some onloads fire more than once... TODO: integrate propper api on loads...

						// has a loading element been supplied?
						if (loading_overlay.size() > 0) {

							// hide it...
							loading_overlay.fadeOut(300);
						}

						clearInterval(onload_timeout);

						// carry on...
						this.prepare_continue(element_handle);

					}

					// time up has the the custom onload been triggerd?
					if (count == settings.custom_onloads.timeout && settings.onloads_triggered < settings.custom_onloads.count) {

						// has a loading element been supplied?
						if (loading_overlay.size() > 0) {

							// hide it...
							loading_overlay.html('<h2>Sorry, the slides could not be loaded</h2>');
						}

						// throw an exception
						$.error('stretcharmstrong - the onready/onload event(s) you are waiting for took too long.');

					}

				}, 1000);

			} else {

				// waiting for 'complete' ready state
				var ready_interval = setInterval(function(){

					// if the ready state is complete
					if (document.readyState == 'complete') {

						// can we find an iframe?
						if (element_handle.find('iframe').size() > 0) {

							// how many?
							var iframe_count = element_handle.find('iframe').size();
							var iframe_load_count = 0;

							$('iframe').bind('load.stretcharmstrong', function() {

								iframe_load_count++;

								if (iframe_load_count == iframe_count) {

									// has a loading element been supplied?
									if (loading_overlay.size() > 0) {

										// hide it...
										loading_overlay.fadeOut(300);
									}

									self.prepare_continue(element_handle);

								}

							});

						} else {

							// has a loading element been supplied?
							if (loading_overlay.size() > 0) {

								// hide it...
								loading_overlay.fadeOut(300);
							}

							self.prepare_continue(element_handle);

						}

						// clear interval
						clearInterval(ready_interval);

					}

				},500);

			}

		},

		set_wrapper_styles : function(element_handle) {

			var settings = element_handle.data('settings');

			// remove element parent and add to body (so always top left)
		 	if (settings.background == true) {

		 		// make sure body has 100% width and height
		 		$('html, body').css({
		 			'width' : '100%',
		 			'height': '100%'
		 		});

				element_handle.prependTo($('body'));

				// set/override parent styles
				element_handle.css({
					'position' : 'fixed',
					'display'  : 'block',
					'top'      : '0px',
					'left'     : '0px',
					'width'    : '100%',
					'height'   : '100%',
					'z-index'  : '-1',
					'overflow' : 'hidden'
				});

			}			

		},

		prepare_continue : function(element_handle) {

			var settings = element_handle.data('settings');
			var self = this;

			// for each element...
			element_handle.children(settings.element).each(function(i) {

				// store original width and height
				settings.element_attr[i] = {
					'width'  : $(this).outerWidth(true),
					'height' : $(this).outerHeight(true)
				};

				// update element count
				settings.element_count++;

			});

			// fade in first element
			self.show_element(0, element_handle, 'forward');

			// set 'initialized'
			settings.initialized = true;
			
			if (settings.resize == true) {

				self.resize_elements(element_handle);

				// bind resize event to window
		    	$(window).bind('resize.stretcharmstrong', function() {
		    		self.resize_elements(element_handle);
		    	});

			}

			// start interval if applicable
			self.rotate_elements(element_handle);

		},
			
		resize_elements : function(element_handle) {	

			var settings = element_handle.data('settings');

			this.set_wrapper_styles(element_handle);

			// for each element
			element_handle.children(settings.element).each(function(i) {

				/*
					calculate the new width and height for the element whilst maintaing aspect ratio
				*/

				var new_height = 0;
				var new_width  = 0;

				var calc_width = parseInt(settings.element_attr[i].width / settings.element_attr[i].height * element_handle.height());
				var scaled_width = calc_width > new_width ? calc_width : new_width;

				var mod = element_handle.width() % scaled_width;

				// because the formula only has the parent as a max, we need to add on the difference between the parent and the scaled width (if there is one)
				new_width = (mod != element_handle.width()) ? (scaled_width % element_handle.width()) + (element_handle.width() - scaled_width) : scaled_width;

				var calc_height  = parseInt(settings.element_attr[i].height / settings.element_attr[i].width * new_width);
				var scaled_height = calc_height > new_height ? calc_height : new_height;

				new_height = scaled_height;

				$(this).css({
					'width' : new_width + 'px',
					'height': new_height + 'px'
				});

				if (settings.element == 'img' || 'video') {
					$(this).attr({
						'width' : new_width,
						'height': new_height
					});
				}

				if (i == element_handle.children(settings.element).size() - 1) {

					// call on resize callback
					if (settings.on_resize != null) {
						settings.on_resize.call(element_handle.find('[data-slide="current"]'), {
							'dimensions' : {
								'width' : new_width,
								'height': new_height
							},
							'element_end' : new_height + element_handle.offset().top
						});
					}
				}

				if (settings.weighted) {
					settings.weighted_element.css({
						'width' : new_width,
						'height' : new_height
					});
				}		

			});
	
		},

		rotate_elements : function(element_handle) {

			var settings = element_handle.data('settings');

			if (settings.rotate === true && settings.element_count > 1) {
				settings.interval = new GlobalTimer(settings.rotate_interval, [
					function() {
						element_handle.stretcharmstrong('next');
					}
				]);

				// only call callbacks if we need to
				if (settings.transition_state == 'paused') {

					// set transition state
					settings.transition_state = 'resumed';

					// call rotate changed callback
					if (settings.rotate_changed != null) {
						settings.rotate_changed.call(undefined, {
							'rotate' : 'resumed',
							'count'  : settings.master_count
						});
					}
				}

				
			}

			
		},

		get_default_position : function(element_handle) {

			var settings = element_handle.data('settings');

			var el_css = {};

			if (settings.transition.orientation == 'horizontal') {
				el_css.left = -99999;
				el_css.top  = 0; 
			}

			if (settings.transition.orientation == 'vertical') {
				el_css.left = 0;
				el_css.top  = -99999; 
			}

			return el_css;

		},

		element_slide_complete : function(current_image, new_image, new_index, transition_direction, element_handle) {

			var settings = element_handle.data('settings');

			var pos = this.get_default_position(element_handle);
			var css_pos = settings.transition.orientation == 'horizontal' ? 'left' : 'top';

			// update data-slide
			new_image.attr('data-slide', 'current');

			// reset left and top
			element_handle.children(settings.element).not(new_image).css({
				'left'    : pos.left,
				'top'     : pos.top
			});

			// update data-slide
			current_image.removeAttr('data-slide');

			new_index = parseInt(new_index);

			// call transition complete callback
			if (settings.transition_complete != null) {

				// optionally ignore transition callback for first transition...
				if (settings.ignore_first) {
					settings.ignore_first = false; // reset

					if (settings.master_count > 1) {
						settings.transition_complete.call(new_image, {
	  						'transition' : 'slide',
	  						'direction'  : transition_direction,
	  						'index'      : new_index,
	  						'count'      : settings.master_count
	  					});
					}

				} else {

					settings.transition_complete.call(new_image, {
  						'transition' : 'slide',
  						'direction'  : transition_direction,
  						'index'      : new_index,
  						'count'      : settings.master_count
  					});

				}

				// check what image we're on for cycle complete callback
				private_methods.image_indexer(new_index, true, element_handle);
	
			}

			
		},

		slide_forward : function(new_index, element_handle) {

			var settings = element_handle.data('settings');

			var self = this;

			// get current width and height of images
			var images = element_handle.children(settings.element);
			var image_width = images.width();
			var image_height = images.height();

			var current_image = element_handle.find('[data-slide="current"]');
			var next_image = element_handle.find('[data-index="' + new_index + '"]');

			if (!current_image.is(':animated') && !next_image.is(':animated')) {

				if (settings.transition.orientation == 'horizontal') {

					// get next image and place it right of the current
					next_image.css({
						'left' : image_width + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'left' : '-=' + image_width + 'px'
					}, settings.transition.duration);

					next_image.stop(false, true).animate({
						'left' : '-=' + image_width + 'px'
					}, settings.transition.duration, function() { 
						self.element_slide_complete(
							current_image, 
							next_image, 
							new_index, 
							'forward',
							element_handle
						);
					});

				}

				if (settings.transition.orientation == 'vertical') {
					
					// get next image and place it at the bottom of the current
					next_image.css({
						'top' : image_height + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'top' : '-=' + image_height + 'px'
					}, settings.transition.duration);

					next_image.stop(false, true).animate({
						'top' : '-=' + image_height + 'px'
					}, settings.transition.duration, function() { 
						self.element_slide_complete(
							current_image, 
							next_image, 
							new_index, 
							'forward',
							element_handle
						);
					});

				}

			}

		},

		slide_backward : function(new_index, element_handle) {

			var settings = element_handle.data('settings');

			var self = this;

			// get current width of images
			var images = element_handle.children(settings.element);
			var image_width = images.width();
			var image_height = images.height();

			
			var current_image = element_handle.find('[data-slide="current"]');
			var prev_image = element_handle.find('[data-index="' + new_index + '"]');

			if (!current_image.is(':animated') && !prev_image.is(':animated')) {

				if (settings.transition.orientation == 'horizontal') {

					// get next image and place it left of the current
					prev_image.css({
						'left' : -image_width + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'left' : '+=' + image_width + 'px'
					}, settings.transition.duration);

					prev_image.stop(false, true).animate({
						'left' : '+=' + image_width + 'px'
					}, settings.transition.duration, function() {
						self.element_slide_complete(
							current_image, 
							prev_image, 
							new_index, 
							'backward',
							element_handle
						);
					});

				}

				if (settings.transition.orientation == 'vertical') {
					
					prev_image.css({
						'top' : -image_height + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'top' : '+=' + image_height + 'px'
					}, settings.transition.duration);

					prev_image.stop(false, true).animate({
						'top' : '+=' + image_height + 'px'
					}, settings.transition.duration, function() {
						self.element_slide_complete(
							current_image, 
							prev_image, 
							new_index, 
							'backward',
							element_handle
						);
					});

				}

			}

		},

		show_element : function(image_index, element_handle, direction) {

			var settings = element_handle.data('settings');

			// get handle on images
			var images = element_handle.children(settings.element);

			if (!$(images).is(':animated')) {

				// fade in selected image
				$(images[image_index]).fadeIn(settings.transition.duration - 200, function() {

					// call transition complete callback
					if (settings.transition_complete != null) {

						// optionally ignore transition callback for first transition...
						if (settings.ignore_first) {
							settings.ignore_first = false; // reset

							if (settings.master_count > 1) {
								settings.transition_complete.call($(images[image_index]), {
			  						'transition' : 'fade',
			  						'index'      : image_index,
			  						'direction'  : direction,
			  						'count'      : settings.master_count
			  					});
							}

						} else {

							settings.transition_complete.call($(images[image_index]), {
		  						'transition' : 'fade',
		  						'index'      : image_index,
		  						'direction'  : direction,
		  						'count'      : settings.master_count
		  					}); 

						}
			
	  				}

				});

				// fade out all other images
				images.each(function(i) {

					// if were on the selected image then skip this iteration
					if (i == image_index) {
						return true;
					}

					// fade out this image
					$(images[i]).fadeOut(settings.transition.duration);

					// update data-slide
					$(images[i]).removeAttr('data-slide');

				});

				// update data-slide
				$(images[image_index]).attr('data-slide', 'current');

				// check what image we're on for cycle complete callback
				private_methods.image_indexer(image_index, true, element_handle);

			}

		},

		fast_forward : function(image_index, element_handle) {

			var settings = element_handle.data('settings');

			// get current element 
			var current_image = $(element_handle).find(settings.element + '[data-slide="current"]');

			// dont do anything if we're already on the slide we have clicked
			if (parseInt(current_image.data('index')) != image_index) {

				// everything in place, call slide left...
				private_methods.slide_forward(image_index, element_handle);

			}
	
		},

		image_indexer : function(index, fire, element_handle) {

			var settings = element_handle.data('settings');

			if (fire) {
				if (settings.current_element == settings.element_count - 1) {
					if (settings.cycle_complete != null) {
						settings.cycle_complete.call(undefined);
					}
				}
			}

			settings.master_count++;
			settings.current_element = index;

		},

		ajax_request : function(element_handle) {

			var settings = element_handle.data('settings');

			$.ajax({
				url: settings.ajax,
				async : false,
		  		success: function(data) {
			  		// settings.image_json must result in an array of image paths...
			    	settings.images_array = data.images;
			    	if (!$.isArray(settings.images_array)) {
			    		$.error('stretcharmstrong - the data returned from the server was not an array.');
			    	}
			  	},
			  	error: function(data) {
			  		$.error('stretcharmstrong - there was a problem obtaining data from the server.');
			  	}
			});
		},

		inject_to_dom : function(element_handle) {

			var settings = element_handle.data('settings');

			// clear wrapper of all elements
			element_handle.empty();

			// append new images
			for (var i = 0; i < settings.images_array.length; i++) {

				// build image...
				var image = $('<img src="' + settings.images_array[i] + '" alt="Image ' + i + '" />');

				element_handle.append(image);

			}


		}

	};

	var public_methods = {

		next : function() {

			var settings = $(this).data('settings');

			var element_count = $(this).children().size();
			var current_element = $(this).find(settings.element + '[data-slide="current"]');
			var current_index = parseInt(current_element.attr('data-index'));

			if (element_count > 1) {

				// stop the interval if there is one
				if (settings.interval !== false) {
					settings.interval.cancel();
				}

				var new_index = current_index + 1;

				// is the next image outside the range?
				if (new_index > element_count - 1) {

					// reset new_index to 0
					new_index = 0;

				}

				switch(settings.transition.type) {

					case 'fade' :
						// call show method
						private_methods.show_element(new_index, $(this), 'forward');
					break;

					case 'slide' :
						// call slide method
						private_methods.slide_forward(new_index, $(this));
					break;

					default : $.error('stretcharmstrong - unsupported transition type: ' + settings.transition.type);
				}


				// start interval again if applicable
				private_methods.rotate_elements($(this));

			}

		},

		prev : function() {

			var settings = $(this).data('settings');

			var element_count = $(this).children().size();
			var current_element = $(this).find(settings.element + '[data-slide="current"]');
			var current_index = parseInt(current_element.attr('data-index'));

			if (element_count > 1) {

				// stop the interval if there is one
				if (settings.interval !== false) {
					settings.interval.cancel();
				}

				var new_index = current_index - 1;

				// is the next image outside the range?
				if (new_index < 0) {

					// reset new_index to 
					new_index = element_count - 1;

				}

				switch(settings.transition.type) {

					case 'fade' :
						// call show method
						private_methods.show_element(new_index, $(this), 'backward');
					break;

					case 'slide' :
						// call slide method
						private_methods.slide_backward(new_index, $(this));
					break;

					default : $.error('stretcharmstrong - unsupported transition type: ' + settings.transition.type);
				}

				// start interval again if applicable
				private_methods.rotate_elements($(this));

			}

			
			
		},

		jumpto : function(image_index) {

			var settings = $(this).data('settings');

			if (settings.element_count > 1) {

				// stop the interval if there is one
				if (settings.interval !== false) {
					settings.interval.cancel();
				}

				switch(settings.transition.type) {

					case 'fade' :
						private_methods.show_element(image_index, $(this), undefined);
					break;

					case 'slide' :
						private_methods.fast_forward(image_index, $(this));
					break;

					default : $.error('stretcharmstrong - unsupported transition type: ' + settings.transition.type);
				}

				// start interval again if applicable
				private_methods.rotate_elements($(this));

			}

		},

		pause : function() {

			var settings = $(this).data('settings');

			if (settings.element_count > 1) {

				// stop the interval if there is one
				if (settings.interval !== false) {
					settings.interval.cancel();
				}

				// only call callbacks if we need to
				if (settings.transition_state == 'resumed') {

					// set transition state
					settings.transition_state = 'paused';

					// call rotate state change callback
					if (settings.rotate_changed != null) {
						settings.rotate_changed.call(undefined, {
							'rotate' : 'paused',
							'count'  : settings.master_count
						});
					}
				}

			}
		},

		resume : function() {

			// start interval again if applicable
			private_methods.rotate_elements($(this));

		},

		continue_load : function() {
			var settings = $(this).data('settings');
			if (settings.custom_onloads.count > 0) {
				settings.onloads_triggered++;
			}
		},

		destroy : function(loading_overlay) {
			var settings = $(this).data('settings');

			// unbind events
			$(window).unbind('load.stretcharmstrong');
			$(window).unbind('resize.stretcharmstrong');
			$('iframe').unbind('load.stretcharmstrong');

			// show loading_overlay?
			if (loading_overlay && $(settings.loading_element).size() > 0) {
				$(settings.loading_element).fadeIn(300);
			}

			// remove styles
			$(this).removeAttr('style');

			// remove data
			$.removeData($(this), 'settings');

			// remove children
			$(this).find(settings.element).remove();

			// set null
			$(this).stretcharmstrong = null;

		}


	};

	// global timer constructor
	var GlobalTimer = function(freq, callbacks) {
		this.freq = freq || 1000;
		this.callbacks = callbacks;
		this._id = null;
		this.init();

		return this;
	};

	GlobalTimer.prototype = {

		init : function() {

			var timer = this;

		  	this._id = setInterval(function() {
			    for (var idx in timer.callbacks) {
			        timer.callbacks[idx].call();
			    }
			}, timer.freq);

		},

		registerCallback : function(cb) {
			this.callbacks.push(cb);
		},

		cancel : function() {
	        clearInterval(this._id);
		}

	};

})(jQuery);
