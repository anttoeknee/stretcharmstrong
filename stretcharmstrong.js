/*
	stretcharmstrong: developed by Anthony Armstrong
		version: 1.1.3
		last modified: 2013-02-04
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
		settings      : null,
		image_attr    : {},
		wrapper       : null,
		current_image : 0,
		image_count   : 0,
		master_count  : 0,
		interval      : false,
		images_array  : null,
		initialized   : false
	};

	var private_methods = {

		prepare_elements : function(callback) {

			// remove img_parent and add to body (so always top left)
		 	if (members.settings.background == true) {
				members.wrapper.prependTo($('body'));

				// set parent styles
				members.wrapper.css({
					'position' : 'absolute',
					'display'  : 'block',
					'top'      : '0px',
					'left'     : '0px',
					'width'    : '100%',
					'height'   : '100%',
					'z-index'  : '-1',
					'overflow' : 'hidden'
				});

			}

			// give some basic styling to images (so they dont show as soon as they load)
			var elements = members.wrapper.children(members.settings.element);
			var reversed_elements = elements.toArray().reverse();
			$(reversed_elements).each(function(i) {
				$(this).css({
					'position' : 'absolute',
					'display'  : 'none',
					'top'      : '0px',
					'left'     : '0px',
					'z-index'  : i
				});
			});

			// give an id to each element
			$(elements).each(function(i) {
				$(this).attr('data-image', 'stretcharmstrong-' + i);
			});

			// wait for window load event
			$(window).bind('load.stretcharmstrong', function() {

				// for each img...
				members.wrapper.children(members.settings.element).each(function(i) {

					// store original width and height
					members.image_attr[i] = {
						'width'  : $(this).width(),
						'height' : $(this).height()
					};

					// update image count
					members.image_count++;

				});

				// fade in first image
				private_methods.show_image(0);

				// set 'initialized'
				members.initialized = true;
				
				if (callback != null) {
					callback.call();
				}

			});
		},

		resize_images : function() {	

			// for each image
			members.wrapper.children(members.settings.element).each(function(i) {

				/*
					calculate the new width and height for the image whilst maintaing aspect ratio
				*/

				var new_height = 0;
				var new_width  = 0;

				var calc_width = parseInt(members.image_attr[i].width / members.image_attr[i].height * members.wrapper.height());
				var scaled_width = calc_width > new_width ? calc_width : new_width;

				var mod = members.wrapper.width() % scaled_width;

				// because the formula only has the parent as a max, we need to add on the difference between the parent and the scaled width (if there is one)
				new_width = (mod != members.wrapper.width()) ? (scaled_width % members.wrapper.width()) +  (members.wrapper.width() - scaled_width) : scaled_width

				var calc_height  = parseInt(members.image_attr[i].height / members.image_attr[i].width * new_width);
				var scaled_height = calc_height > new_height ? calc_height : new_height;

				new_height = scaled_height;

				$(this).css({
					'width' : new_width + 'px',
					'height': new_height + 'px'
				});

			});

		},

		rotate_images : function() {

			if (members.settings.rotate === true) {
				members.interval = new GlobalTimer(members.settings.interval, [
					function() {
						public_methods.next();
					}
				]);

				// call transition complete callback
				if (members.settings.rotate_changed != null) {
					members.settings.rotate_changed.call(undefined, {
						'rotate' : 'resumed'
					});
				}
			}

			
		},

		slide_left : function(new_index) {

			// get current width of images
			var images = members.wrapper.children(members.settings.element);
			var image_width = images.width();

			// get next image and place it right of the current
			var current_image = $(images[0]);
			var next_image = $(images[1]);

			if (!current_image.is(':animated') && !next_image.is(':animated')) {

				next_image.css({
					'left' : image_width + 'px',
					'display' : 'block'
				});

				// animate
				current_image.stop(false, true).animate({
					'left' : '-=' + image_width + 'px'
				}, members.settings.duration);

				next_image.stop(false, true).animate({
					'left' : '-=' + image_width + 'px'
				}, members.settings.duration, function() {

					// append current image to the end
					current_image.appendTo(members.wrapper);

					// increment z-index of next image
					next_image.css({
						'z-index' : '+=1'
					});

					// set z-index to length of array for current image and reset left
					var new_z_index = images.length - 1;
					current_image.css({
						'z-index' : new_z_index,
						'left' : -99999
					});

	  				// call transition complete callback
					if (members.settings.transition_complete != null) {

						// optionally ignore transition callback for first transition...
						if (members.settings.ignore_first) {
							members.settings.ignore_first = false; // reset

							if (members.master_count > 1) {
								members.settings.transition_complete.call(next_image, {
			  						'transition' : 'slide',
			  						'direction'  : 'left',
			  						'index'      : parseInt(next_image.data('image').split('-')[1])
			  					});
							}

						} else {

							members.settings.transition_complete.call(next_image, {
		  						'transition' : 'slide',
		  						'direction'  : 'left',
		  						'index'      : parseInt(next_image.data('image').split('-')[1])
		  					});

						}
			
	  				}

	  				// check what image we're on for cycle complete callback
					private_methods.image_indexer(new_index, true);

					// remove evil-clone 
					$(members.wrapper).find('.evil-clone').remove();

				});

			}


		},

		slide_right : function(new_index) {

			// get current width of images
			var images = members.wrapper.children(members.settings.element);
			var image_width = images.width();

			// get next image and place it right of the current
			var current_image = $(images[0]);
			var prev_image = $(images[images.length - 1]);

			if (!current_image.is(':animated') && !prev_image.is(':animated')) {

				// prepend current image to the beginning
			    prev_image.prependTo(members.wrapper);
				
				prev_image.css({
					'left' : -image_width + 'px',
					'display' : 'block'
				});

				// animate
				current_image.stop(false, true).animate({
					'left' : '+=' + image_width + 'px'
				}, members.settings.duration);

				prev_image.stop(false, true).animate({
					'left' : '+=' + image_width + 'px'
				}, members.settings.duration, function() {

					// increment z-index of next image
					prev_image.css({
						'z-index' : '+=1'
					});

					// set z-index to length of array for current image and reset left
					var new_z_index = 1;
					current_image.css({
						'z-index' : new_z_index,
						'left' : -99999
					});

	  				// call transition complete callback
					if (members.settings.transition_complete != null) {

						// optionally ignore transition callback for first transition...
						if (members.settings.ignore_first) {
							members.settings.ignore_first = false; // reset

							if (members.master_count > 1) {
								members.settings.transition_complete.call(prev_image, {
			  						'transition' : 'slide',
			  						'direction'  : 'right',
			  						'index'      : parseInt(prev_image.data('image').split('-')[1])
			  					});
							}

						} else {

							members.settings.transition_complete.call(prev_image, {
		  						'transition' : 'slide',
		  						'direction'  : 'right',
		  						'index'      : parseInt(prev_image.data('image').split('-')[1])
		  					});

						}
			
	  				}

	  				// check what image we're on for cycle complete callback
					private_methods.image_indexer(new_index);

				});

			}

		},

		show_image : function(image_index) {

			// get handle on images
			var images = members.wrapper.children(members.settings.element);

			// is the next image outside the range?
			if (image_index > members.image_count - 1) {

				// reset new_index to 0
				image_index = 0;

			}

			// fade in selected image
			$(images[image_index]).stop(false, true).fadeIn(members.settings.duration - 200, function() {

				// call transition complete callback
				if (members.settings.transition_complete != null) {

					// optionally ignore transition callback for first transition...
					if (members.settings.ignore_first) {
						members.settings.ignore_first = false; // reset

						if (members.master_count > 1) {
							members.settings.transition_complete.call($(images[image_index]), {
		  						'transition' : 'fade',
		  						'index'      : image_index
		  					});
						}

					} else {

						members.settings.transition_complete.call($(images[image_index]), {
	  						'transition' : 'fade',
	  						'index'      : image_index
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
				$(images[i]).stop(false, true).fadeOut(members.settings.duration);

			});

			// check what image we're on for cycle complete callback
			private_methods.image_indexer(image_index + 1, true);

		},

		fast_forward : function(image_index) {

			// get desired image
			var element = $(members.wrapper).find(members.settings.element + '[data-image="stretcharmstrong-' + image_index + '"]');

			// get current image and clone it
			var current_image = members.wrapper.children(members.settings.element)[0];
			var current_image_clone = $(current_image).clone(false);

			if (!$(current_image).is(':animated')) {

				// determine the z-index of the cloned image and set it and put image in place...
				var z_index = parseInt($(current_image).css('z-index')) + 1;
				current_image_clone.addClass('evil-clone');
				current_image_clone.css({
					'z-index' : z_index,
					'left'    : 0
				});

				// manipulate stack...
				var previous_elements = element.prevAll(':not(.evil-clone)');

				// reverse previous images
				var reversed_previous_elements = $(previous_elements.toArray().reverse());
				reversed_previous_elements.appendTo(members.wrapper);

				// insert cloned image at the beginning of the stack
				current_image_clone.prependTo(members.wrapper);

				// set 'left' and 'z-index' of previous elements to '-99999' and +1
				reversed_previous_elements.each(function() {
					var current_z = parseInt($(this).css('z-index'));
					var new_z = current_z + 1; 
					$(this).css({
						'z-index' : new_z,
						'left' : -99999
					});
				});
			}

			// everything in place, call slide left...
			private_methods.slide_left();
			
		},

		image_indexer : function(index, fire) {

			if (fire) {
				if (members.current_image == members.image_count - 1) {
					if (members.settings.cycle_complete != null) {
						members.settings.cycle_complete.call(undefined);
					}
				}
			}

			members.master_count++;
			members.current_image = index;

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
		    	'transition'   : 'fade',
		    	'duration'     : 1000,
		    	'offset'       : { // TODO: implement functionality for offsets
		    		'x' : 0,
		    		'y' : 0
		      	},
		      	'element'      : 'img',
		      	'background'   : true,
		      	'ajax'         : null,
		      	'images'       : null,
		      	'ignore_first' : false,
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
	    		private_methods.prepare_elements(function() {
	    			private_methods.resize_images();
	    		});

		    	// bind resize event to window
		    	$(window).bind('resize.stretcharmstrong', function() {
		    		private_methods.resize_images();
		    	});

		    	// start interval if applicable
				private_methods.rotate_images();
		    	
		    }
		    
		},

		next : function() {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			var new_index = members.current_image + 1;

			// is the next image outside the range?
			if (new_index > members.image_count - 1) {

				// reset new_index to 0
				new_index = 0;

			}

			// slide or fade?
			if (members.settings.transition == 'fade') {

				// call show method
				private_methods.show_image(members.current_image);
			} 

			if (members.settings.transition == 'slide') {

				// call slide method
				private_methods.slide_left(new_index);
			} 

			// start interval again if applicable
			private_methods.rotate_images();

			

		},

		prev : function() {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			var new_index = members.current_image - 1;

			// is the next image outside the range?
			if (new_index < 0) {

				// reset new_index to 
				new_index = members.image_count - 1;

			}

			// slide or fade?
			if (members.settings.transition == 'fade') {

				// call show method
				private_methods.show_image(members.current_image);
			} 

			if (members.settings.transition == 'slide') {

				// call slide method
				private_methods.slide_right(new_index);
			} 

			// start interval again if applicable
			private_methods.rotate_images();

			
			
		},

		jumpto : function(image_index) {

			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			if (members.settings.transition == 'fade') {
				private_methods.show_image(image_index);
			}

			if (members.settings.transition == 'slide') {
				private_methods.fast_forward(image_index);
			}

			// start interval again if applicable
			private_methods.rotate_images();

		},

		pause : function() {
			// stop the interval if there is one
			if (members.interval !== false) {
				members.interval.cancel();
			}

			// call transition complete callback
			if (members.settings.rotate_changed != null) {
				members.settings.rotate_changed.call(undefined, {
					'rotate' : 'paused'
				});
			}
		},

		resume : function() {

			// start interval again if applicable
			private_methods.rotate_images();

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