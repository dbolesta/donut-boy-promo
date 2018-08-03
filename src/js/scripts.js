// !
// particles.js initiation located at end of vendor/particles.js


// set before document.ready so donut boy is placed in the right spot initially
$('.donutboy-footer').css({
    'left': $(document).width() * .05
});

$('.kelly-footer').css({
    'right': $(document).width() - ($(document).width() * .95)
});
var $kelly = $('.kelly-footer');


$(document).ready(function(){
    
    /* hamburger menu toggle
    ------------------------- */
    $('.hero-text h3 span').click(function(){
        $('.info-box').toggleClass('is-showing');
    });
    $('.info-x').click(function(){
        $('.info-box').toggleClass('is-showing');
    });
    
    
    
    /* travel location button selection
    ------------------------------------ */
    $('.travel-menu li').click(function(){
       $('.travel-menu li').removeClass("selected");
       $(this).addClass("selected");
       
       // change bg image of travel section, taken from data attribute "bgimg"
       var newImg = this.dataset.bgimg;
        
        $('.travel').fadeTo('fast', 0.3, function(){
            $(this).css('background-image', 'url(/imgs/' + newImg + ')');
        }).fadeTo('fast', 1);
    });
    
    
    
    /* move donut boy in footer animation
    ------------------------------------ */
    var $horizontal = $('.donutboy-footer');
    var $horizontalImg = $('.donutboy-footer img');
    var prevScroll = 0;
    
    // listen for both window scroll and resize
    $(window).on('scroll resize', function() {
        var s = $(this).scrollTop(),
            d = $(document).height(),
            c = $(this).height();
        
        
        
        scrollPercent = (s / (d - c)); 

        //var position = ( (scrollPercent * ($(document).width() * .85 - $horizontal.width())) + $(document).width() * .05  ) ;
        
        var position = ( (scrollPercent * ($kelly.position().left - $horizontal.width())) + ($(document).width() * .05)  ) ;
        
        //var position = ( (scrollPercent * ($(document).width() - ($(document).width() * .95) ) ) + ($(document).width() * .05)  ) ;
        
        
        // Only when we havny reached kelly do we...
        if (position < $kelly.position().left - $horizontal.width()) {
            
           // ...change position of donut boy    
           $horizontal.css({
              'left': position
           }); 
            
           // ...flip donut boy based on last scroll direction  
           if (s > prevScroll) {
                if ($horizontalImg.hasClass('db-backwards')){
                    $horizontalImg.removeClass('db-backwards');
                }
            } else {
                if (!$horizontalImg.hasClass('db-backwards')){
                    $horizontalImg.addClass('db-backwards');
                }
            }    
            
            
            // ...
            if ($horizontal.hasClass('bounce')){
                $horizontal.removeClass('bounce');
                $horizontal.removeClass('animated-db');
            }
            if ($kelly.hasClass('bounce')){
                $kelly.removeClass('bounce');
                $kelly.removeClass('animated-kelly');
            }
            
            
        } else { // If we're up to Kelly...
            
            // 
            if (!$horizontal.hasClass('bounce')){
                $horizontal.addClass('bounce');
                $horizontal.addClass('animated-kelly');
            }
            if (!$kelly.hasClass('bounce')){
                $kelly.addClass('bounce');
                $kelly.addClass('animated-db');
            }
            
        }
        
        prevScroll = s; // update previous scroll position so we can detect if we've scrolled up or down
        
        console.log(position);
        
    });
    
    
    $(window).on('resize', function() {
        $('.kelly-footer').css({
            'right': $(document).width() - ($(document).width() * .95)
        });
    });
    
    
    
});
