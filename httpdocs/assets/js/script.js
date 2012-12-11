/* Author: 
	Anthony Armstrong
*/

$(document).ready(function() {

	// init bgstretch
	var images = $('div.backgrounds');
	images.stretcharmstrong({
		'rotate'     : true,
		'interval'   : 5000,
		'transition' : 'fade'
	});

	// bind next and prev buttons
	$('a').bind('click', function(e) {

		e.preventDefault();

		if ($(this).hasClass('next')) {

			// call forward function
			images.stretcharmstrong('next');

		} else {

			images.stretcharmstrong('prev');
		}

	});


	/*$(this).bgstretch({
		images : [
			'/assets/img/image1.jpg',
			'/assets/img/image2.jpg'
		]
	});*/


});























