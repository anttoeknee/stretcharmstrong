/*
	stretcharmstrong: developed by Anthony Armstrong
		version: 1.0.0
		last modified: 2012-12-02
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
			$.error('Method ' + method + ' does not exist on jQuery.stretcharmstrong');
		}

	};

	var members = {
		settings      : null,
		image_attr    : {},
		wrapper       : null,
		current_image : 0,
		image_count   : 0,
		interval      : false
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
			elements = elements.toArray().reverse();
			$(elements).each(function(i) {
				$(this).css({
					'position' : 'absolute',
					'display'  : 'none',
					'top'      : '0px',
					'left'     : '0px',
					'z-index'  : i
				});
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
				public_methods.show_image(0);

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
			}
		},

		slide_left : function() {

			// get current width of images
			var images = members.wrapper.children(members.settings.element);
			var image_width = images.width();

			// get next image and place it right of the current
			var current_image = $(images[members.current_image]);
			var next_image = $(images[members.current_image + 1]);

			if (!current_image.is(':animated') && !next_image.is(':animated')) {

				console.log(members.current_image);

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

				});

			}


		},

		slide_right : function() {

			// get current width of images
			var images = members.wrapper.children(members.settings.element);
			var image_width = images.width();

			// get next image and place it right of the current
			var current_image = $(images[members.current_image]);
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

				});

			}

		}

	};

	var public_methods = {

		init : function(options) {
			
			// create some defaults, extending them with any options that were provided
		    members.settings = $.extend({
		    	'rotate'     : false,
		    	'interval'   : 1000,
		    	'transition' : 'fade',
		    	'duration'   : 1000,
		    	'offset'     : {
		    		'x' : 0,
		    		'y' : 0
		      	},
		      	'element'     : 'img',
		      	'background' : true
		    }, options);

		    // determine sender
		    if (typeof this[0] === 'object') {

		    	// set wrapper member
		    	members.wrapper = this;

		    	// is it the document?
		    	if (members.wrapper[0].nodeName == '#document') {

		    		console.log('called on document, check for passed arguments');

		    	} else {

		    		private_methods.prepare_elements(function() {
		    			private_methods.resize_images();
		    		});

		    	}

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
				public_methods.show_image(new_index);
			} 

			if (members.settings.transition == 'slide') {

				// call slide method
				private_methods.slide_left();
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
				public_methods.show_image(new_index);
			} 

			if (members.settings.transition == 'slide') {

				// call slide method
				private_methods.slide_right();
			} 

			// start interval again if applicable
			private_methods.rotate_images();
			
		},

		show_image : function(image_index) {

			// get handle on images
			var images = members.wrapper.children(members.settings.element);

			// fade in selected image
			$(images[image_index]).stop(false, true).fadeIn(members.settings.duration - 200);

			// fade out all other images
			images.each(function(i) {

				// if were on the selected image then skip this iteration
				if (i == image_index) {
					return true;
				}

				// fade out this image
				$(images[i]).stop(false, true).fadeOut(members.settings.duration);

			});

			// update current_image
			members.current_image = image_index;

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