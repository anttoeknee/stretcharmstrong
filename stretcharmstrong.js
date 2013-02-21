/*
	stretcharmstrong: developed by Anthony Armstrong
		version: 1.1.6
		last modified: 2013-02-20
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
			return public_methods.init.apply(this, arguments);

		} else {

			// throw an exception
			$.error('stretcharmstrong - method ' + method + ' does not exist.');
		}

	};

	var members = {
		settings         : null,
		image_attr       : {},
		wrapper          : null,
		current_element  : 0,
		element_count    : 0,
		master_count     : 0,
		interval         : false,
		images_array     : null,
		initialized      : false,
		transition_state : 'paused',
		onloads_triggered : 0
	};

	var private_methods = {

		prepare_elements : function() {

			// remove element parent and add to body (so always top left)
		 	if (members.settings.background == true) {
				members.wrapper.prependTo($('body'));
			}

			// set/override parent styles
			members.wrapper.css({
				'position' : 'absolute',
				'display'  : 'block',
				'top'      : '0px',
				'left'     : '0px',
				'width'    : '100%',
				'height'   : '100%',
				'z-index'  : '0',
				'overflow' : 'hidden'
			});

			// give some basic styling to elements
			var elements = members.wrapper.children(members.settings.element);
			var reversed_elements = elements.toArray().reverse();
			$(reversed_elements).each(function(i) {
				var z_index = members.settings.transition.type == 'fade' ? i : 1;
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

			var loading_overlay = $(members.settings.loading_element);

			// optionally wait for custom onload
			if (members.settings.custom_onloads.count > 0) {

				var count = 0;

				// set a timeout here as we don't want to wait forever...
				var onload_timeout = setInterval(function() {

					count++;

					// check onloads
					if (members.onloads_triggered >= members.settings.custom_onloads.count) {

					  	// some onloads fire more than once... TODO: integrate propper api on loads...

						// has a loading element been supplied?
						if (loading_overlay.size() > 0) {

							// hide it...
							loading_overlay.fadeOut(300);
						}

						clearInterval(onload_timeout);

						// carry on...
						private_methods.prepare_continue();

					}

					// time up has the the custom onload been triggerd?
					if (count == members.settings.custom_onloads.timeout && members.onloads_triggered < members.settings.custom_onloads.count) {

						// has a loading element been supplied?
						if (loading_overlay.size() > 0) {

							// hide it...
							loading_overlay.html('<h2>Sorry, the slides could not be loaded</h2>');
						}

						// throw an exception
						$.error('stretcharmstrong - the onready/onload event you are waiting for took too long.');

					}

				}, 1000);

			} else {

				// has a loading element been supplied?
				if (loading_overlay.size() > 0) {

					// hide it...
					loading_overlay.fadeOut(300);
				}

				private_methods.prepare_continue();

			}

		},

		prepare_continue : function() {

			// for each element...
			members.wrapper.children(members.settings.element).each(function(i) {

				// store original width and height
				members.image_attr[i] = {
					'width'  : $(this).width(),
					'height' : $(this).height()
				};

				// update element count
				members.element_count++;

			});

			// fade in first element
			private_methods.show_element(0);

			// set 'initialized'
			members.initialized = true;
			
			if (members.settings.resize == true) {

				private_methods.resize_elements();

				// bind resize event to window
		    	$(window).bind('resize.stretcharmstrong', function() {
		    		private_methods.resize_elements();
		    	});

			}

			// start interval if applicable
			private_methods.rotate_elements();

		},
			
		resize_elements : function() {	

			// for each element
			members.wrapper.children(members.settings.element).each(function(i) {

				/*
					calculate the new width and height for the element whilst maintaing aspect ratio
				*/

				var new_height = 0;
				var new_width  = 0;

				var calc_width = parseInt(members.image_attr[i].width / members.image_attr[i].height * members.wrapper.height());
				var scaled_width = calc_width > new_width ? calc_width : new_width;

				var mod = members.wrapper.width() % scaled_width;

				// because the formula only has the parent as a max, we need to add on the difference between the parent and the scaled width (if there is one)
				new_width = (mod != members.wrapper.width()) ? (scaled_width % members.wrapper.width()) + (members.wrapper.width() - scaled_width) : scaled_width

				var calc_height  = parseInt(members.image_attr[i].height / members.image_attr[i].width * new_width);
				var scaled_height = calc_height > new_height ? calc_height : new_height;

				new_height = scaled_height;

				$(this).css({
					'width' : new_width + 'px',
					'height': new_height + 'px'
				});

			});

		},

		rotate_elements : function() {

			if (members.settings.rotate === true) {
				members.interval = new GlobalTimer(members.settings.interval, [
					function() {
						public_methods.next();
					}
				]);

				// only call callbacks if we need to
				if (members.transition_state == 'paused') {

					// set transition state
					members.transition_state = 'resumed';

					// call rotate changed callback
					if (members.settings.rotate_changed != null) {
						members.settings.rotate_changed.call(undefined, {
							'rotate' : 'resumed',
							'count'  : members.master_count
						});
					}
				}

				
			}

			
		},

		get_default_position : function() {

			var el_css = {};

			if (members.settings.transition.orientation == 'horizontal') {
				el_css.left = -99999;
				el_css.top  = 0; 
			}

			if (members.settings.transition.orientation == 'vertical') {
				el_css.left = 0;
				el_css.top  = -99999; 
			}

			return el_css;

		},

		element_slide_complete : function(current_image, new_image, new_index, transition_direction) {

			var pos = this.get_default_position();
			var css_pos = members.settings.transition.orientation == 'horizontal' ? 'left' : 'top';

			// update data-slide
			new_image.attr('data-slide', 'current');

			// reset left and top
			members.wrapper.children(members.settings.element).not(new_image).css({
				'left'    : pos.left,
				'top'     : pos.top
			});

			// update data-slide
			current_image.removeAttr('data-slide');

			new_index = parseInt(new_index);

			// call transition complete callback
			if (members.settings.transition_complete != null) {

				// optionally ignore transition callback for first transition...
				if (members.settings.ignore_first) {
					members.settings.ignore_first = false; // reset

					if (members.master_count > 1) {
						members.settings.transition_complete.call(new_image, {
	  						'transition' : 'slide',
	  						'direction'  : transition_direction,
	  						'index'      : new_index,
	  						'count'      : members.master_count
	  					});
					}

				} else {

					members.settings.transition_complete.call(new_image, {
  						'transition' : 'slide',
  						'direction'  : transition_direction,
  						'index'      : new_index,
  						'count'      : members.master_count
  					});

				}

				// check what image we're on for cycle complete callback
				private_methods.image_indexer(new_index, true);
	
			}

			
		},

		slide_forward : function(new_index) {

			var self = this;

			// get current width and height of images
			var images = members.wrapper.children(members.settings.element);
			var image_width = images.width();
			var image_height = images.height();

			var current_image = members.wrapper.find('[data-slide="current"]');
			var next_image = members.wrapper.find('[data-index="' + new_index + '"]');

			if (!current_image.is(':animated') && !next_image.is(':animated')) {

				if (members.settings.transition.orientation == 'horizontal') {

					// get next image and place it right of the current
					next_image.css({
						'left' : image_width + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'left' : '-=' + image_width + 'px'
					}, members.settings.transition.duration);

					next_image.stop(false, true).animate({
						'left' : '-=' + image_width + 'px'
					}, members.settings.transition.duration, function() { 
						self.element_slide_complete(
							current_image, 
							next_image, 
							new_index, 
							'forward'
						);
					});

				}

				if (members.settings.transition.orientation == 'vertical') {
					
					// get next image and place it at the bottom of the current
					next_image.css({
						'top' : image_height + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'top' : '-=' + image_height + 'px'
					}, members.settings.transition.duration);

					next_image.stop(false, true).animate({
						'top' : '-=' + image_height + 'px'
					}, members.settings.transition.duration, function() { 
						self.element_slide_complete(
							current_image, 
							next_image, 
							new_index, 
							'forward'
						);
					});

				}

			}

		},

		slide_backward : function(new_index) {

			var self = this;

			// get current width of images
			var images = members.wrapper.children(members.settings.element);
			var image_width = images.width();
			var image_height = images.height();

			
			var current_image = members.wrapper.find('[data-slide="current"]');
			var prev_image = parseInt(current_image.data('index')) == 0 ? members.wrapper.find('[data-index="' + (members.element_count - 1) + '"]') : current_image.prev();

			if (!current_image.is(':animated') && !prev_image.is(':animated')) {

				if (members.settings.transition.orientation == 'horizontal') {

					// get next image and place it left of the current
					prev_image.css({
						'left' : -image_width + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'left' : '+=' + image_width + 'px'
					}, members.settings.transition.duration);

					prev_image.stop(false, true).animate({
						'left' : '+=' + image_width + 'px'
					}, members.settings.transition.duration, function() {
						self.element_slide_complete(
							current_image, 
							prev_image, 
							new_index, 
							'backward'
						);
					});

				}

				if (members.settings.transition.orientation == 'vertical') {
					
					prev_image.css({
						'top' : -image_height + 'px',
						'display' : 'block'
					});

					// animate
					current_image.stop(false, true).animate({
						'top' : '+=' + image_height + 'px'
					}, members.settings.transition.duration);

					prev_image.stop(false, true).animate({
						'top' : '+=' + image_height + 'px'
					}, members.settings.transition.duration, function() {
						self.element_slide_complete(
							current_image, 
							prev_image, 
							new_index, 
							'backward'
						);
					});

				}

			}

		},

		show_element : function(image_index) {

			// get handle on images
			var images = members.wrapper.children(members.settings.element);

			if (!$(images).is(':animated')) {

				// is the next image outside the range?
				if (image_index > members.element_count - 1) {

					// reset new_index to 0
					image_index = 0;

				}

				image_index = parseInt(image_index);

				// fade in selected image
				$(images[image_index]).fadeIn(members.settings.transition.duration - 200, function() {

					// call transition complete callback
					if (members.settings.transition_complete != null) {

						// optionally ignore transition callback for first transition...
						if (members.settings.ignore_first) {
							members.settings.ignore_first = false; // reset

							if (members.master_count > 1) {
								members.settings.transition_complete.call($(images[image_index]), {
			  						'transition' : 'fade',
			  						'index'      : image_index,
			  						'count'      : members.master_count
			  					});
							}

						} else {

							members.settings.transition_complete.call($(images[image_index]), {
		  						'transition' : 'fade',
		  						'index'      : image_index,
		  						'count'      : members.master_count
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
					$(images[i]).fadeOut(members.settings.transition.duration);

				});

				// check what image we're on for cycle complete callback
				private_methods.image_indexer(image_index, true);

			}

		},

		fast_forward : function(image_index) {

			// get current element 
			var current_image = $(members.wrapper).find(members.settings.element + '[data-slide="current"]');

			// dont do anything if we're already on the slide we have clicked
			if (parseInt(current_image.data('index')) != image_index) {

				// everything in place, call slide left...
				private_methods.slide_forward(image_index);

			}
	
		},

		image_indexer : function(index, fire) {

			if (fire) {
				if (members.current_element == members.element_count - 1) {
					if (members.settings.cycle_complete != null) {
						members.settings.cycle_complete.call(undefined);
					}
				}
			}

			members.master_count++;
			members.current_element = index;

		},

		ajax_request : function() {

			$.ajax({
				url: members.settings.ajax,
				async : false,
		  		success: function(data) {
			  		// members.image_json must result in an array of image paths...
			    	members.images_array = data.images;
			    	if (!$.isArray(members.images_array)) {
			    		$.error('stretcharmstrong - the data returned from the server was not an array.');
			    	}
			  	},
			  	error: function(data) {
			  		$.error('stretcharmstrong - there was a problem obtaining data from the server.');
			  	}
			});
		},

		inject_to_dom : function() {

			// if there is no wrapper
			if (!members.initialized) {

				// build wrapping element
				members.wrapper = $('<div id="stretcharmstrong"></div>');

			}

			// clear wrapper of all elements
			members.wrapper.empty();

			// append new images
			for (var i = 0; i < members.images_array.length; i++) {

				// build image...
				var image = $('<img src="' + members.images_array[i] + '" alt="Image ' + i + '" />');

				members.wrapper.append(image);

			}


		}

	};

	var public_methods = {

		init : function(options) {
			
			// create some defaults, extending them with any options that were provided
		    members.settings = $.extend({
		    	'rotate'       : false,
		    	'interval'     : 1000,
		    	'transition'   : {
		    		'type'        : 'fade',
		    		'duration'    : 1000,
		    		'orientation' : 'horizontal'
		    	},
		    	'offset'       : { // TODO: implement functionality for offsets
		    		'x' : 0,
		    		'y' : 0
		      	},
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
		      	rotate_changed : function(event) {}
		    }, options);

		    // determine sender
		    if (typeof this[0] === 'object') {

		    	// set wrapper member
		    	members.wrapper = this;

		    	// is it the document?
		    	if (members.wrapper[0].nodeName == '#document') {

		    		// is the ajax path set?
		    		if (members.settings.ajax != null) {

		    			// make the request...
		    			private_methods.ajax_request();

		    		}

		    		// if images have been passed in 
		    		if (members.settings.images != null) {

		    			// are they an array?
		    			if (!$.isArray(members.settings.images)) {
		    				$.error('stretcharmstrong - the data passed as images is not an array.');
		    			}

		    			// set images_array
		    			members.images_array = members.settings.images;

		    		}

		    		if (members.settings.images == null && members.settings.ajax == null) {
		    			$.error('stretcharmstrong - you must pass in an array of images or an ajax path when attaching to the document');
		    		} 

		    		// call inject method
		    		private_methods.inject_to_dom();


		    	} 

		    	// prepare elements...
	    		private_methods.prepare_elements();

		    }
		    
		},

		next : function() {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			var new_index = members.current_element + 1;

			// is the next image outside the range?
			if (new_index > members.element_count - 1) {

				// reset new_index to 0
				new_index = 0;

			}

			switch(members.settings.transition.type) {

				case 'fade' :
					// call show method
					private_methods.show_element(new_index);
				break;

				case 'slide' :
					// call slide method
					private_methods.slide_forward(new_index);
				break;

				default : $.error('stretcharmstrong - unsupported transition type: ' + members.settings.transition.type);
			}


			// start interval again if applicable
			private_methods.rotate_elements();

		},

		prev : function() {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			var new_index = members.current_element - 1;

			// is the next image outside the range?
			if (new_index < 0) {

				// reset new_index to 
				new_index = members.element_count - 1;

			}

			switch(members.settings.transition.type) {

				case 'fade' :
					// call show method
					private_methods.show_element(members.current_element);
				break;

				case 'slide' :
					// call slide method
					private_methods.slide_backward(new_index);
				break;

				default : $.error('stretcharmstrong - unsupported transition type: ' + members.settings.transition.type);
			}

			// start interval again if applicable
			private_methods.rotate_elements();

			
			
		},

		jumpto : function(image_index) {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			switch(members.settings.transition.type) {

				case 'fade' :
					private_methods.show_element(image_index);
				break;

				case 'slide' :
					private_methods.fast_forward(image_index);
				break;

				default : $.error('stretcharmstrong - unsupported transition type: ' + members.settings.transition.type);
			}

			// start interval again if applicable
			private_methods.rotate_elements();

		},

		pause : function() {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			// only call callbacks if we need to
			if (members.transition_state == 'resumed') {

				// set transition state
				members.transition_state = 'paused';

				// call rotate state change callback
				if (members.settings.rotate_changed != null) {
					members.settings.rotate_changed.call(undefined, {
						'rotate' : 'paused',
						'count'  : members.master_count
					});
				}
			}
		},

		resume : function() {

			// start interval again if applicable
			private_methods.rotate_elements();

		},

		continue_load : function() {
			if (members.settings.custom_onloads.count > 0) {
				members.onloads_triggered++;
			}
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