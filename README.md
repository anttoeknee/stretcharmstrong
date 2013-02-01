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

- You can initialize stretcharmstrong with default settings like so;

<pre>
  $('div#wrapping-element').stretcharmstrong();
</pre>

- Or you can set some options and callbacks like so (these are defaults);

<pre>
  $('div#wrapping-element').stretcharmstrong({
    'rotate'     : false,                             
    'interval'   : 5000,                              
    'transition' : 'fade',                            
    'duration'   : 1000,                              
    'element'    : 'img',                             
    'background' : true,                              
    transition_complete : function(event) {},                                                                   
    cycle_complete : function() {},
    rotate_changed : function(event) {}    
  });
</pre>

Options
-----------------------

  - *rotate*     : rotate images? true or false 
  - *interval*   : the rotate interval in miliseconds 
  - *transition* : the transition type for the rotate ('fade' or 'slide') 
  - *duration*   : the transition duration in miliseconds 
  - *element*    : the element type (semantically) to be worked with  
  - *background* : use as background or inline (true or false) 
 
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