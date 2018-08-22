$(document).ready(function(){
   $('.player').toArray().forEach(function(player){
    
       // find the audio tag 
       var audio = $(player).find("audio")[0];
       var seekbarInner = $(player).find(".seek-bar .inner");
       var seekbarOuter = $(player).find(".seek-bar .outer");
       var volumeControl = $(player).find(".volume-control .wrapper");
       
       var length; // length of audio file
       var interval; // used to run setInterval Function
       var seekbarPercentage;
       var volumePercentage;
       
       
       ///----------  play song on click -----------///
       $(player)
           .find('.btn-music')
           .on('click', function(){
              var _button = $(this);
           
           
              // check for play class
              if(_button.hasClass("play")){
                  _button.removeClass("play").addClass("pause");
                  
                  // find length of audio
                  length = audio.duration;
                  // set end time
                  $(player)
                      .find(".timing .end")
                      .text(sToTime(length));
                  
                  // play the audio
                  audio.play();
                  
                  //audio.volume = 0.01;
                  
                  // set seek bar percentage
                  interval = setInterval(function(){
                      // update seek bar
                      if(!audio.paused){
                          // while audio is playing
                          updateSeekbar();
                      }
                      
                      //Audio has ended
                      if(audio.ended){
                          clearInterval(interval);
                          $(player).find(".albumArt").removeClass("animate");
                          _button.removeClass("pause").addClass("play");
                          seekbarInner.width(100+"%");
                      }
                      
                  }, 250);
              } // end if loop
              else if(_button.hasClass("pause")){
                  _button.removeClass("pause").addClass("play");
                  audio.pause();
              } // end else 
           
           
              // toggle animated album art
              $(player).find(".album-art").toggleClass("animate");
           
           
           }); // end on btn click
       
       
       
           // scrolling on seekbar?
             /// nahh
       
           // clicking on seekbar
           seekbarOuter.on("click", function(e){
              if(!audio.ended && length !== undefined){
                  var seekPosition = e.pageX - $(seekbarOuter).offset().left;
                  console.log("Clicky clack!");
                  console.log("e.pageX: " + e.pageX);
                  console.log("offset.left: " + $(seekbarOuter).offset().left);
                  console.log("seekPosition: "+ seekPosition);
                  
                  console.log("what? " + (seekPosition * audio.duration)/$(seekbarOuter).width());
                  
                  
                  
                  //if(seekPosition >= 0 && seekPosition <= $(seekbarOuter).offset().left) {
                  if(seekPosition >= 0 && seekPosition <= $(seekbarOuter).width()) {
                      audio.currentTime = (seekPosition * audio.duration)/$(seekbarOuter).width();
                      updateSeekbar();
                  }
              } 
           });
       
       
       
            // click for volume control
            volumeControl.find(".outer").on('click', function(e){
                
                var volumePosition = e.pageX - $(this).offset().left;
                var audioVolume = volumePosition / $(this).width();
                
                if(audioVolume >= 0 && audioVolume <= 1){
                    audio.volume = audioVolume;
                    $(this).find(".inner").css("width", audioVolume * 100 + "%");
                    
                }
            })
           

/// all functions


//update seekbar
var updateSeekbar = function(){
    seekbarPercentage = getPercentage(
        audio.currentTime.toFixed(2), 
        length.toFixed(2)
    );
    
    
    // update seekbar percentage
    $(seekbarInner).css("width", seekbarPercentage + "%");
    
    
    // update current/start time
    $(player).find(".timing .start").text(sToTime(audio.currentTime));
    
}; // end seekbar function
           
           
           
           
           
           
           
           
           
       
       
   }); // end forEach
    
    
    
    // find percentage (WHY HERE???)
    var getPercentage = function(presentTime, totalLength){
        var calcPercentage = (presentTime/totalLength) * 100;
        return parseFloat(calcPercentage.toString());
    }
    
    
    
    $(".track-list li").on("dblclick", function(){
        console.log(this);
    });
    
    
                  
}); // end document ready







function sToTime(t) {
  return parseInt((t / (60)) % 60) + ":" + 
         padZero(parseInt((t) % 60));
}
function padZero(v) {
  return (v < 10) ? "0" + v : v;
}
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
        
        
        
        // take the current scroll position
        // and divide it by the remaining page height
        // (which is total height - viewable height)
        // (all units in px)
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
    
    // on resize, move kelly so she's always on screen
    $(window).on('resize', function() {
        $('.kelly-footer').css({
            'right': $(document).width() - ($(document).width() * .95)
        });
    });
    
    
    
    
    
    /* scroll the enemy/item scrollbars
    ----------------------------------- */
    
    $('.btn-scroll').on('click', function() {
        
        // we grab the overflow-sidescroll container that is the parent of `this`
        // we check the classlist, and select the second class, since the first is
        // always .overflow-sidescroll. The second will be the unique identifier
        var preElem = "." + this.closest('div').classList[1];
        
        
        // Use the preElem to capture that sidescroll div
        var elem = document.querySelector(preElem + ' .sidescroll');
        
        // capture current scrollleft of the sidescroll, to know how much to add or subtract
        var numToScroll = elem.scrollLeft;
        
        
        // get max possible scroll distance
        var maxScrollLeft = elem.scrollWidth - elem.clientWidth;
        
        // get true width (including padding) of first indiviual item
        var widthOfDiv = elem.getElementsByTagName('div')[0].offsetWidth;
        
        
        // detect if left or right was selected
        if ($(this).hasClass("btn-scroll--right")){
            numToScroll+= widthOfDiv * 2; // scroll by 2 item sizes
            // if past max scroll distance, scroll to end instead
            if (numToScroll > maxScrollLeft){
                numToScroll = maxScrollLeft;
            } 
        }
        if ($(this).hasClass("btn-scroll--left")) {
            numToScroll-= widthOfDiv * 2;
            // same as above, but dont allow to scroll past beginning
            if (numToScroll < 0) {
                numToScroll = 0;
            }
        }
        
        // scroll by number determined above
        $(elem).animate({scrollLeft: numToScroll}, 150);
        
        // function call to enable / disable buttons if min/max distance reached
        scrollBtnEnable(maxScrollLeft, preElem, numToScroll);
        
    }); // end .btn-scroll click event
    
    
    function scrollBtnEnable(maxScroll, preElem, numToScroll){
        
        var leftButt = $(preElem + " .btn-scroll--left");
        var rightButt = $(preElem + " .btn-scroll--right");
        
        
        if (numToScroll >= 0 && numToScroll <= maxScroll) {
            if (leftButt.hasClass("btn-game--disabled")){
                leftButt.removeClass("btn-game--disabled");
            }
            if (rightButt.hasClass("btn-game--disabled")){
                rightButt.removeClass("btn-game--disabled");
            }
        }
        
        if (numToScroll <= 0 && !leftButt.hasClass("btn-game--disabled")){
            leftButt.addClass("btn-game--disabled");
        } 
        
        if (numToScroll >= maxScroll && !rightButt.hasClass("btn-game--disabled")){
            rightButt.addClass("btn-game--disabled");
        }
        
        
    } // end scrollBtnEnable()
    
    
    
    /* Select New Enemy
    ----------------------------------- */
    $('.sidescroll div').on('click', function() {
        
        var preElem = "." + this.closest('.asset-display').classList[1];
        var elem = document.querySelector(preElem).querySelector('.asset-info');
        console.log(preElem);
        
        // remove .selected class from all images, then add it to the selected one
        $(preElem + ' .sidescroll div img').removeClass("selected");
        $(this).find("img").addClass("selected");
        
        // capture necessary info from selected image
        const name = this.querySelector('.e-name').textContent;
        const fact1 =  this.querySelector('.e-fact1').textContent;
        const fact2 =  this.querySelector('.e-fact2').textContent;
        
        
        // capture image name, then use regex to capture without directory or file extention (since we want to use .gif)
        const image = this.querySelector('img').src;
        var imageName;
        if (preElem.indexOf("enemy") !== -1) {
            imageName = image.match(/imgs\/(.*)\.png/)[1];
            imageName = "/imgs/" + imageName + ".gif";
        } else {
            imageName = image;
        }
        
        
        // update main area with newly selected image and info
        elem.querySelector(".asset-image img").src = imageName;
        elem.querySelector(".asset-text h2").textContent = name;
        elem.querySelector(".asset-text ul").getElementsByTagName('li')[0].textContent = fact1;
        elem.querySelector(".asset-text ul").getElementsByTagName('li')[1].textContent = fact2;
    });
    
    
});
