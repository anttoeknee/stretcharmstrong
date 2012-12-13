stretcharmstrong
================

jQuery Plugin for HTML Background Resizing and Slide Show

What this plugin does;-

- Resizes images whilst maintaining aspect ratio
- Provides slide show functionality for images/content with 'fx' options e.g. 'slide' or 'fade'

Features;-

- Easy implementation
- Can be used as backgrounds or in the document flow
- Works in 'responsive' sites (as long as parent wrapper is 'fluid')
- Built-in methods for slide show controls
- Cross browser compatible (tested on Chrome, Firefox, IE7-10)

Usage;-

Please see the example in this repo for basic usage:-

  home.php - markup
  stretcharmstrong-1.0.0,js - the plugin
  script.js - basic example of implementation

The plugin can be initialized with the following optional paramters:-
  
  option     :     default     :     description
  ===================================================================
  rotate     :     false       :     if you want the images/content to rotate automatically
  interval   :     1000        :     the time before the next slide will show in milliseconds
  transition :     'fade'      :     the jquery 'fx' to use for the transition ('fade' or 'slide')
  durartion  :     1000        :     the length of time the transition will take in milliseconds
  element    :     'img'       :     the element type of the content
  background :     true        :     if you want a full screen background or not


  

