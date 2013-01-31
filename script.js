/* Author: 
	Anthony Armstrong
*/

// make sure you use document.ready and not window.load
$(document).ready(function() {

	/* 
		see home.php for 'div.backgrounds', the selector for the plugin
		should always be the parent wrapper of the images/content
	 */
  	var slides = $('div.backgrounds');
  	slides.stretcharmstrong({
    	'rotate'     : true,
    	'interval'   : 5000,
    	'duration'   : 1000,
    	'transition' : 'fade',
    	'element'    : 'img',
    	'background' : true,
    	transition_complete : function(event) {
    		console.log(this); // the image that has been transitioned in...
    		console.log(event); // some properties for the transition...
    		console.log('transition complete');
    	},
    	cycle_complete : function(event) {
    		console.log(event); // some properties for the transition...
    		console.log('cycle complete');
    	},
    	rotate_changed : function(event) {
    		console.log(event); // info on the state of rotation
    	}       
  	});

	/* 
		see home.php for markup, these controls will show the next and
		previous images/contents
	*/
	$('a').bind('click', function(e) {

		e.preventDefault();

		if ($(this).hasClass('next')) {

			// call 'next' function
			slides.stretcharmstrong('next');

		} 

		if ($(this).hasClass('prev')) {

			// call 'prev' function
			slides.stretcharmstrong('prev');
		}

		if ($(this).hasClass('pause')) {

			// call 'pause' function
			slides.stretcharmstrong('pause');
		}

	});

});























