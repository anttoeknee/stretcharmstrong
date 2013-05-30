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
        'rotate_interval'   : 5000,
        'transition' : {
            'type'        : 'fade',
            'duration'    : 1500,
            'orientation' : 'horizontal'
        },
        'element'    : 'img',
        'resize'     : true,
        'background' : true,
        'weighted'   : false,
        'loading_element' : '.loading-overlay',
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
        },
        on_resize : function(event) {
            console.log($(this));
            console.log(event.dimensions.width + ', ' + event.dimensions.height);
        }      
    });

    var inline = $('div.inline-content');
    inline.stretcharmstrong({
        'rotate'     : true,
        'rotate_interval'   : 3000,
        'transition' : {
            'type'        : 'slide',
            'duration'    : 1500,
            'orientation' : 'vertical'
        },
        'weighted'   : false,
        'element'    : 'img',
        'resize'     : true,
        'background' : false,
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
        },
        on_resize : function(event) {
            console.log($(this));
            console.log(event.dimensions.width + ', ' + event.dimensions.height);
        }             
    });

    /* 
        see home.php for markup, these controls will show the next and
        previous images/contents
    */
    $('#next').bind('click', function(e) {

        e.preventDefault();

        // call 'next' function
        slides.stretcharmstrong('next');

    });

    $('#prev').bind('click', function(e) {

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


    /* middle controls */

    $('section.middle a.next').bind('click', function(e) {

        e.preventDefault();

        // call 'next' function
        inline.stretcharmstrong('next');

    });

    $('section.middle a.prev').bind('click', function(e) {

        e.preventDefault();

        // call 'prev' function
        inline.stretcharmstrong('prev');
        
    });

    /* instance controls */
    $('.destroy').live('click', function(e) {
        e.preventDefault();

        // destroy instance
        slides.stretcharmstrong('destroy', false);

        $('.instance-ctl').text('init');
        $('.instance-ctl').removeClass('destroy');
        $('.instance-ctl').addClass('init');
           



    });

    $('.init').live('click', function(e) {
        e.preventDefault();

        // inject images into wrapper
        slides.append($('<img src="/assets/img/01.jpg" alt="An Image"  />'));
        slides.append($('<img src="/assets/img/02.jpg" alt="An Image"  />'));
        slides.append($('<img src="/assets/img/03.jpg" alt="An Image"  />'));
        slides.append($('<img src="/assets/img/04.jpg" alt="An Image"  />'));
        slides.append($('<img src="/assets/img/05.jpg" alt="An Image"  />'));

        // re-init instance
        slides.stretcharmstrong({
            'rotate'     : true,
            'rotate_interval'   : 5000,
            'transition' : {
                'type'        : 'fade',
                'duration'    : 1500,
                'orientation' : 'horizontal'
            },
            'element'    : 'img',
            'resize'     : true,
            'background' : true,
            'loading_element' : '.loading-overlay',
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
            },
            on_resize : function(event) {
                console.log($(this));
                console.log(event.dimensions.width + ', ' + event.dimensions.height);
            }      
        });

        $('.instance-ctl').text('destroy');
        $('.instance-ctl').removeClass('init');
        $('.instance-ctl').addClass('destroy');

    });



});























