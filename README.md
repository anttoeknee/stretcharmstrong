stretcharmstrong
================

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
    'interval'    : 5000,                              
    'transition'  : 'fade',                            
    'duration'    : 1000,                              
    'element'     : 'img',                             
    'background'  : true,
    'ignore_first : false,
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
    'transition' : 'slide',                            
    'duration'   : 1000,                              
    'element'    : 'img',                             
    'background' : true,
    'ignore_first : true,
    'ajax'       : 'path/to/server/script',
    transition_complete : function(event) {},                                                                   
    cycle_complete : function() {},
    rotate_changed : function(event) {}    
  });
</pre>

  - **NOTE:** You **can't** use both the 'images' and 'ajax' arguments at the same time, doing so will result in the plugin using the 'images' argument.

Options
-----------------------

  - **rotate**       : *bool*   | rotate images? 
  - **interval**     : *int*    | the rotate interval in miliseconds 
  - **transition**   : *string* | the transition type for the rotate (currently 'fade' or 'slide') 
  - **duration**     : *int*    | the transition duration in miliseconds 
  - **element**      : *string* | the name of the HTML element type to be worked with  
  - **background**   : *bool*   | use as background or inline 
  - **ignore_first** : *bool*   | ignore 'transition_complete' callback after first element? (v1.1.3)
  - **ajax**         : *string* | a path to a server side AJAX handler (v1.1.3)
  - **images**       : *array*  | an array of image paths to use (v1.1.3)
 
Callbacks
-----------------------
 
**transition_complete** : fires when an element has been transitioned passing event data as follows;- 
  - *transition* : the transition type 
  - *direction*  : which direction the slide came from (if transition is slide) 
  - *index*      : the index of the image being transitioned in 
   
  - the *this* keyword is a reference to the image being transitioned in 
    
**cycle_complete** : fires when all elements have been transitioned  
 
**rotate_changed** : fires when the rotation interval has been stopped or started passing event data as follows;- 
  - *rotate* : 'resumed' or 'paused' 

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

Please see home.php for the markup and script.js in this repo for a basic example of implementation.

All files contained within this repository are subject to the GNU GPL v3, please follow this link for a description:-
http://opensource.org/licenses/gpl-3.0
