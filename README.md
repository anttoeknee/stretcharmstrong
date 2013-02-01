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
- Cross browser compatible (tested on Chrome, Firefox, IE7-10)

Usage
-----

- You can initialise stretcharmstrong with default settings like so;

<pre>
  $('div#wrapping-element').stretcharmstrong();
</pre>

- Or you can set some options and callbacks like so (these are defaults);

<pre>
  $('div#wrapping-element').stretcharmstrong({
    // options
    'rotate'     : false,                             
    'interval'   : 5000,                              
    'transition' : 'fade',                            
    'duration'   : 1000,                              
    'element'    : 'img',                             
    'background' : true,                              
    // callbacks
    transition_complete : function(event) {
      console.log(this);                                  
    },                                                                   
    cycle_complete : function() {},
    rotate_changed : function(event) {}    
  });
</pre>

Explantion of options
---------------------

**rotate**     : rotate images? true or false 
**interval**   : the rotate interval in miliseconds 
**transition** : the transition type for the rotate ('fade' or 'slide') 
**duration**   : the transition duration in miliseconds 
**element**    : the element type (semantically) to be worked with  
**background** : use as background or inline (true or false) 
 
Explantion of callbacks
-----------------------
 
**transition_complete** : fires when an element has been transitioned passing event data as follows;- 
  - *transition* : the transition type 
  - *direction*  : which direction the slide came from (if transition is slide) 
  - *index*      : the index of the image being transitioned in 
   
  - the *this* keyword is a reference to the image being transitioned in 
    
**cycle_complete** : fires when all elements have been transitioned  
 
**rotate_changed** : fires when the rotation interval has been stopped or started passing event data as follows;- 
  - *rotate* : 'resumed' or 'paused' 

Please see home.php for the markup and script.js in this repo for a basic example of implementation.

All files contained within this repository are subject to the GNU GPL v3, please follow this link for a description:-
http://opensource.org/licenses/gpl-3.0


  

