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
        
        
        // Only when we havnt reached kelly do we...
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
            
            // ... make sure db is facing right if were at the top of the page
            if (s == 0) {
                if ($horizontalImg.hasClass('db-backwards')){
                    $horizontalImg.removeClass('db-backwards');
                }
            }
            
            
            // ... remove animation classes, if not already removed
            if ($horizontal.hasClass('bounce')){
                $horizontal.removeClass('bounce');
                $horizontal.removeClass('animated-db');
            }
            if ($kelly.hasClass('bounce')){
                $kelly.removeClass('bounce');
                $kelly.removeClass('animated-kelly');
            }
            
            
        } else { // If we HAVE reached Kelly...
            
            // ... add the necessary animation classes to both DB and Kelly
            if (!$horizontal.hasClass('bounce')){
                $horizontal.addClass('bounce');
                $horizontal.addClass('animated-kelly');
            }
            if (!$kelly.hasClass('bounce')){
                $kelly.addClass('bounce');
                $kelly.addClass('animated-db');
            }
            
        }
        
        prevScroll = s; // update previous scroll position so we can compare the numbers, and detect if we've scrolled up or down
        
        //console.log(position);
        
    });
    
    
    $(window).on('resize', function() {
        $('.kelly-footer').css({
            'right': $(document).width() - ($(document).width() * .95)
        });
    });
    
    
    
    
    
    /* scroll the enemy/item scrollbars
    ----------------------------------- */
    var numToScroll = 0;
    
    
    $('.btn-scroll').on('click', function() {
        var elem = document.querySelector('.sidescroll');
        
        var maxScrollLeft = elem.scrollWidth - elem.clientWidth;
        
        var widthOfDiv = elem.getElementsByTagName('div')[0].offsetWidth;
        
        
    
        if ($(this).hasClass("btn-scroll--right")){
            numToScroll+= widthOfDiv * 2;
            if (numToScroll > maxScrollLeft){
                numToScroll = maxScrollLeft;
            } 
        }
        if ($(this).hasClass("btn-scroll--left")) {
            numToScroll-= widthOfDiv * 2;
            if (numToScroll < 0) {
                numToScroll = 0;
            }
        }
        
        
        $('.sidescroll').animate({scrollLeft: numToScroll}, 150);
        
        
        scrollBtnEnable(maxScrollLeft);
        
    });
    
    
    function scrollBtnEnable(maxScroll){
        /*console.log("we fireing dudes?");
        console.log(numToScroll);
        console.log(maxScroll);
        console.log(numToScroll > 0 && numToScroll < maxScroll);
        console.log($(".btn-scroll--left").hasClass("btn-game--disabled"));*/
        
        if (numToScroll > 0 && numToScroll < maxScroll) {
            if ($(".btn-scroll--left").hasClass("btn-game--disabled")){
                $(".btn-scroll--left").removeClass("btn-game--disabled");
            }
            if ($(".btn-scroll--right").hasClass("btn-game--disabled")){
                $(".btn-scroll--right").removeClass("btn-game--disabled");
            }
        }
        
        if (numToScroll <= 0 && !$(".btn-scroll--left").hasClass("btn-game--disabled")){
            $(".btn-scroll--left").addClass("btn-game--disabled");
        } 
        
        if (numToScroll >= maxScroll && !$(".btn-scroll--right").hasClass("btn-game--disabled")){
            $(".btn-scroll--right").addClass("btn-game--disabled");
        }
        
        
        
        
    }
    
    
    
});
