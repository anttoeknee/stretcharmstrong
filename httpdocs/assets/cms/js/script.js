
/* 
	Project: 'open tag' cms
	Author: Anthony Armstrong
*/



// InputText Constructor
var InputText = function(id) {
    this.element          = document.getElementById(id);
    this.placeholder_text = this.element.getAttribute('placeholder'); 
    this.is_password      = this.element.getAttribute('type') == 'password' ? true : false;
    return this;
};

InputText.prototype = {

	// IE Workaround for placeholder
    fixPlaceHolder: function() {

    	if (this.is_password) {



    	} else {

    		// Set defaults
    		var input_element = this.element,
    			input_cleared = false;

    		// Set the value to the placeholder value
    		input_element.setAttribute('value', this.placeholder_text);

    		// Bind click event handler to mimic placeholder behaviour
    		input_element.attachEvent('onclick', function(event) {

    			if (input_cleared == false) {

	    			// Create range (for cursor)
	    			var range = input_element.createTextRange();
	    			range.move('character', 0);
	            	range.select();
	            }
    		});

    		/* Bind keyup event handler 
    		input_element.attachEvent('onkeyup', function(event) {

    			// Add in backspace behaviour
    			if (event.keyCode == 8) {
    				var end     = (input_element.value.length - 1),
    					trimmed = input_element.value.substring(0,end);
    				input_element.value = trimmed;

					console.log(end);    				
    			}
    		});*/

    		// Bind keydown event handler to mimic placeholder behaviour
    		input_element.attachEvent('onkeyup', function(event) {

    			// Prevent character from automatically being added in
    			event.returnValue = false;

    			var unicode = event.keyCode || event.charCode;

    			/*Add in backspace behaviour
    			if (unicode == 8) {
    				var end     = (input_element.value.length - 1),
    					trimmed = input_element.value.substring(0,end);
    				input_element.value = trimmed;  				
    			}

    			console.log(unicode);

				// Allowed sets
				var numbers = Array(46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65),
					text    = Array(65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91),
					numpad  = Array(93,94,95,96,97,98,99,100,101,102,103,104,105,106),
					math    = Array(106,107,108,109,110,111),
					other   = Array(186,187,188,189,190,191,192,219,220,221,222,32);

    			// Allowed key json
    			var allowed = {
    				0 : numbers,
    				1 : text,
    				2 : numpad,
    				3 : math,
    				4 : other
    			};*/
    				
    			// Check allowed sets against keyCode
    			//for (keyset in allowed) {
    			//	for (var i = 0; i < allowed[keyset].length; i++) {
    			//		if (unicode == allowed[keyset][i]) {
    						if (input_cleared != true) {
    							input_element.value = String.fromCharCode(unicode);
    							input_cleared = true;
    							event.returnValue = true;
    						} /*else {
    							input_element.value += String.fromCharCode(unicode);
    						}*/
    			//			break;
    			//		} 
    			//	}
    			//}

    			
    		});

    		

    	}
       	
       	

    }

};



$(document).ready(function() {

	// Invoke pie if required
	if (window.PIE) {
        $('.pie').each(function() {
            PIE.attach(this);
        });
    }

    // Fix placeholders for IE
    if ($('html').hasClass('lt-ie10')) {
	    $('form input.text').each(function() {
	    	var input_text = new InputText($(this).attr('id'));
	    	input_text.fixPlaceHolder();
	    });
	}

});