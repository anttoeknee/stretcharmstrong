stretcharmstrong (v1.3.0)
=========================

jQuery Plugin for HTML Background Resizing and Slide Show

What this plugin does
---------------------

- Resizes images whilst maintaining aspect ratio
- Provides slide show functionality for images/content with 'fx' options e.g. 'slide' or 'fade'

Features
--------

- Easy implementation
- Can be used as backgrounds or in the document flow
- Works in 'responsive' sites (as long as parent wrapper is 'fluid')
- Built-in methods for slide show controls
- Can be used with rendered elements, image paths or AJAX requests
- Cross browser compatible (tested on Chrome, Firefox, IE7-10)
- Can be used on a page as many times as needed

Usage (Pre-rendered HTML)
-------------------------

- You can initialize stretcharmstrong with default settings like so;

<pre>
  $('div#wrapping-element').stretcharmstrong();
</pre>

- Or you can set some options and callbacks like so (these are defaults);

<pre>
  $('div#wrapping-element').stretcharmstrong({
    'rotate'      : false,                             
    'rotate_interval'    : 5000,                              
    'transition' : {
      'type'        : 'slide',
      'duration'    : 1500,
      'orientation' : 'vertical'
    },
    'weighted'    : false,
    'element'     : 'img',                             
    'background'  : true,
    'ignore_first' : false,
    transition_complete : function(event) {},                                                                   
    cycle_complete : function() {},
    rotate_changed : function(event) {}    
  });
</pre>

Usage (Attached to document)
-------------------------------------------------------------------------------------
*use this if using images from an array or ajax request*

<pre>
  $(document).stretcharmstrong({
    'rotate'     : true,                                                      
    'transition' : {
      'type'        : 'slide',
      'duration'    : 1500,
      'orientation' : 'vertical'
    },                                      
    'element'    : 'img',                             
    'background' : true,
    'ignore_first : true,
    'ajax'       : 'path/to/server/script',
    transition_complete : function(event) {},                                                                   
    cycle_complete : function() {},
    rotate_changed : function(event) {}    
  });
</pre>

  - I have included a Fuel REST controller (background.php) which you can use as your AJAX handler if you like (put it in Fuel/App/Classes/Controller), you will have to change the paths to suit your directory structure, I am not a PHP developer, so if the world explodes as a result of using this, you were warned!!!

  - **NOTE:** You **can't** use both the 'images' and 'ajax' arguments at the same time, doing so will result in the plugin using the 'images' argument.

Options
-----------------------

  - **rotate**       : *bool*   | rotate elements? 
  - **rotate_interval** : *int*    | the rotate interval in miliseconds 
  - **transition**
  - - - **type**        : *string* | the transition type for the rotate (currently 'fade' or 'slide') (v1.1.4)
  - - - **duration**    : *int*    | the transition duration in miliseconds (v1.1.4)
  - - - **orientation** : *string* | the transition orientation, 'horizontal' or 'vertical' (v1.1.4)
  - **weighted**     : *bool*   | add a weighted relative div to help maintain document flow
  - **element**      : *string* | the name of the HTML element type to be worked with  
  - **background**   : *bool*   | use as background or inline 
  - **ignore_first** : *bool*   | ignore 'transition_complete' callback after first element? (v1.1.3)
  - **ajax**         : *string* | a path to a server side AJAX handler (v1.1.3)
  - **images**       : *array*  | an array of image paths to use (v1.1.3)
  - **resize**       : *bool*   | resize elements? (v1.1.6)
  - **custom_onloads**  (v1.1.6)
  - - - **count**         : *int* | how many on loads are you waiting for? e.g. YouTube and Vimeo = 2
  - - - **timeout**       : *int* | max amount of seconds to wait for onload events
  - **loading_element**  : *string* | the selector of the element you want to show whilst the elements are loading (v1.1.6)
 
Callbacks
-----------------------
 
**transition_complete** : fires when an element has been transitioned passing event data as follows;- 
  - *transition* : the transition type 
  - *direction*  : which direction the slide came from (if transition is slide) 
  - *index*      : the index of the image being transitioned in 
  - *count*      : the total count of all transitions (v1.1.6)
   
  - the *this* keyword is a reference to the image being transitioned in 
    
**cycle_complete** : fires when all elements have been transitioned  
 
**rotate_changed** : fires when the rotation interval has been stopped or started passing event data as follows;- 
  - *rotate* : 'resumed' or 'paused' 
  - *count*  : the total count of all transitions (v1.1.6)

**on_resize** : fires when elements are resized passing data in as follows;-
  - *dimensions*  : contains the width and height of the resized elements
  - *element_end* : the 'y' position of the bottom of the resized element(s)

  - the *this* keyword is a reference to the currently displayed element 

Methods
-----------------------

There are some basic methods available to control the slides when rotating, the syntax for calling a method is as follows;-

<pre>
  $('div#wrapping-element').stretcharmstrong('method_name', argument);
</pre>

The methods available are;-
  - **next**   : show the next element in the stack
  - **prev**   : show the previous element in the stack
  - **jumpto** : show the element whose index is that given as an argument
  - **pause**  : pause the rotation
  - **resume** : resume the rotation
  - **continue** : use if 'custom_onloads' setting is greater than 0 to indicate when the onload you are waiting for has loaded (e.g. inside the 'youTubeApiReady' handler). You must call this function for each onload you are waiting for. (v1.1.6) 
  - **destroy** : resets the DOM to the it's original state before plugin initialisation and disposes of stretcharmstrong, pass true as argument if you wish to fade in the loading overlay (v1.2.4)

Please see home.php for the markup and script.js in this repo for a basic example of implementation.

All files contained within this repository are subject to the GNU GPL v3, please follow this link for a description:-
http://opensource.org/licenses/gpl-3.0
