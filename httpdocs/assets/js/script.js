/* Author: 
	Anthony Armstrong
*/

$(document).ready(function() {

	// slider init
  	var slides = $('div.backgrounds');
  	slides.stretcharmstrong({
    	'rotate'     : true,
    	'interval'   : 5000,
    	'duration'   : 1000,
    	'transition' : 'slide',
    	'element'    : 'img',
    	'background' : true          
  	});

	// bind next and prev buttons
	$('a').bind('click', function(e) {

		e.preventDefault();

		if ($(this).hasClass('next')) {

			// call forward function
			slides.stretcharmstrong('next');

		} else {

			slides.stretcharmstrong('prev');
		}

	});

	// ignore this for now...
	/*$(this).bgstretch({
		images : [
			'/assets/img/image1.jpg',
			'/assets/img/image2.jpg'
		]
	});*/


});























