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
    	'rotate'     : false,
    	'interval'   : 5000,
    	'transition' : {
    		'type'        : 'slide',
    		'duration'    : 1500,
    		'orientation' : 'vertical'
    	},
    	'element'    : 'img',
    	'background' : true,
    	transition_complete : function(event) { // some properties for the transition...
    		console.log(this); // the image that has been transitioned in...
    		console.log(event); 
    		console.log('transition complete');
    	},
    	cycle_complete : function() {  
    		console.log('cycle complete');
    	},
    	rotate_changed : function(event) { // info on the state of rotation
    		console.log(event);
    		if (event.rotate == 'resumed') {
    			$('.timer-ctl').text('pause');
				$('.timer-ctl').removeClass('resume');
				$('.timer-ctl').addClass('pause');
    		}

    		if (event.rotate == 'paused') {
    			$('.timer-ctl').text('resume');
				$('.timer-ctl').removeClass('pause');
				$('.timer-ctl').addClass('resume');
    		}
    	}       
  	});

	/* 
		see home.php for markup, these controls will show the next and
		previous images/contents
	*/
	$('.next').bind('click', function(e) {

		e.preventDefault();

		// call 'next' function
		slides.stretcharmstrong('next');

	});

	$('.prev').bind('click', function(e) {

		e.preventDefault();

		// call 'prev' function
		slides.stretcharmstrong('prev');
		
	});

	$('.pause').live('click', function(e) {

		e.preventDefault();

		// call 'pause' function
		slides.stretcharmstrong('pause');

	});

	$('.resume').live('click', function(e) {

		e.preventDefault();
		
		// call 'resume' function
		slides.stretcharmstrong('resume');

	});

	slides.find('img').each(function(i) {
		$('div.slide-chooser').append('<a href="#" title="Show slide '+i+'" id="'+i+'">'+i+'</a>');
	});

	$('div.slide-chooser a').bind('click', function(e) {
		e.preventDefault();
		slides.stretcharmstrong('jumpto', parseInt($(this).attr('id')));
	});



});























