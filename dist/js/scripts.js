var audio = $('.player').find("audio")[0];

$(document).ready(function(){
      
       var player = $('.player');
       var _button = $(player).find('.btn-music');
    
       // find the audio tag 
       //var audio = $(player).find("audio")[2];
       var seekbarInner = $(player).find(".seek-bar .inner");
       var seekbarOuter = $(player).find(".seek-bar .outer");
       var volumeControl = $(player).find(".volume-control .volume-bar");
    
       var length;
       var interval; // used to run setInterval Function
       var seekbarPercentage;
       var volumePercentage;
    
       var seekDrag = false; // for dragging seek position
       var volumeDrag = false;
       
       ///----------  play song on click -----------///
           
   
        // seekbar control
        
        $(document).on('mousedown', '.seek-bar .outer, .seek-handle', function (e) {
              seekDrag = true;
              updateSeekbar(e);
        });
        $(document).on('mouseup', function (e) {
            if (seekDrag) {
                seekDrag = false;
                updateSeekbar(e);
            }
        });
        $(document).on('mousemove', function (e) {
            if (seekDrag) {
                updateSeekbar(e);
            }
        });
    
    
    
        // volume control
        $(document).on('mousedown', '.volume-control .outer, .volume-handle', function (e) {
              volumeDrag = true;
              updateVolume(e);
        });
        $(document).on('mouseup', function (e) {
            if (volumeDrag) {
                volumeDrag = false;
                updateVolume(e);
            }
        });
        $(document).on('mousemove', function (e) {
            if (volumeDrag) {
                updateVolume(e);
            }
        });
    
    
         var updateVolume = function(e){
            var volumePosition = e.pageX - volumeControl.offset().left;
            var audioVolume = volumePosition / volumeControl.width();

            if(audioVolume >= 0 && audioVolume <= 1){
                audio.volume = audioVolume;
                volumeControl.find(".inner").css("width", audioVolume * 100 + "%");
                $('.volume-bar .volume-handle').css("left", audioVolume * 100 + "%");
            }

        };

        // click for volume control
        /*volumeControl.find(".outer").on('click', function(e){

            var volumePosition = e.pageX - $(this).offset().left;
            var audioVolume = volumePosition / $(this).width();

            if(audioVolume >= 0 && audioVolume <= 1){
                audio.volume = audioVolume;
                $(this).find(".inner").css("width", audioVolume * 100 + "%");

            }
        });*/
    
    
    $('.btn-forward').on('click', function(){
        
        var numOfSongs = $('.player audio').legnth;
        
        $('.player audio').each(function(index, value){
           console.log(index, value); 
            
            if (audio == value){
                var newIndex = index;
                
                if (index == 4){
                    newIndex = -1;
                }
                
                console.log(index, newIndex);
                changeSong(newIndex + 1);
                return false;
            }
        });
        
    });
    
    $('.btn-back').on('click', function(){
        
        var numOfSongs = $('.player audio').legnth;
        
        $('.player audio').each(function(index, value){
           console.log(index, value); 
            
            if (audio == value){
                var newIndex = index;
                
                if (index == 0){
                    newIndex = 5;
                }
                
                console.log(index, newIndex);
                changeSong(newIndex - 1);
                return false;
            }
        });
        
    });
   
           

/// all functions
    
var playButton = function(){
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
          console.log("Audio is playing!!!"); 
          audio.play();

          
          // interval stuff
          intervalCheck();

          
      } // end if loop
      else if(_button.hasClass("pause")){
          _button.removeClass("pause").addClass("play");
          clearInterval(interval);
          audio.pause();
      } // end else 


      updateMusicAnim();
      // toggle animated album art
      //$(".track-list li.selected i").toggleClass("animate");
    
    
};  // end playButton()
    
    
    
_button.on('click', function(){
    playButton();
});
    
    
    
var intervalCheck = function(){
    interval = setInterval(function(){
          console.log("setinterval is running");
          // update seek bar
          if(!audio.paused){
              // while audio is playing
              updateSeekbarInterval();
          }

          //Audio has ended
          if(audio.ended){
              clearInterval(interval);
              $(player).find(".albumArt").removeClass("animate");
              _button.removeClass("pause").addClass("play");
              seekbarInner.width(100+"%");
              updateMusicAnim();
          }

      }, 250);
};    
    
var updateMusicAnim = function(){
    $(".track-list li i").removeClass("animate");
    if (!audio.paused){
        $(".track-list li.selected i").addClass("animate");
    }
    
};  
var updateSeekbarInterval = function(){
    seekbarPercentage = getPercentage(
        audio.currentTime.toFixed(2), 
        length.toFixed(2)
    );


    // update seekbar percentage
    $(seekbarInner).css("width", seekbarPercentage + "%");
    $('.seek-bar .seek-handle').css("left", seekbarPercentage + "%");


    // update current/start time
    $(player).find(".timing .start").text(sToTime(audio.currentTime));
    
}; // end updateSeekbar1()

//update seekbar   
var updateSeekbar = function(e){
    if(/*!audio.ended && */length !== undefined){
        console.log("this is e: ", e);
      var seekPosition = e.pageX - $(seekbarOuter).offset().left;

      if(seekPosition >= 0 && seekPosition <= $(seekbarOuter).width()) {
            audio.currentTime = (seekPosition * audio.duration)/$(seekbarOuter).width();


            seekbarPercentage = getPercentage(
                audio.currentTime.toFixed(2), 
                length.toFixed(2)
            );


            // update seekbar percentage
            $(seekbarInner).css("width", seekbarPercentage + "%");
            $('.seek-bar .seek-handle').css("left", seekbarPercentage + "%");


            // update current/start time
            $(player).find(".timing .start").text(sToTime(audio.currentTime));
       }
    } 
    
}; // end updateSeekbar1()
    
    
    
           
           
           
    
    
    // find percentage 
    var getPercentage = function(presentTime, totalLength){
        var calcPercentage = (presentTime/totalLength) * 100;
        return parseFloat(calcPercentage.toString());
    }
    
    
    
    $(".track-list li").on("click", function(){
        
        var index = $(this).index();
        
        if (audio != $(player).find('audio')[index]){
            changeSong(index);
        }
        
        
    });
    
    
    
    // change the song!
    
    var changeSong = function(index){
        
        // pause current song, if not already paused
        if(!audio.paused){
            audio.pause();
        }
        
        // update audio var to correct song, also capture length of new song
        audio = $('.player').find("audio")[index];
        length = audio.duration;
        
        // update length of song on track
        $(player)
              .find(".timing .end")
              .text(sToTime(length));
        
        // remove icon next to song, add to correct song via index using eq()
        $(".track-list li").removeClass("selected");
        $(".track-list li").eq(index).addClass("selected");
        // note for future damon: 
        // eq(): Reduce the set of matched elements to the one at the specified index.
        // https://api.jquery.com/eq/
        
        
        if(_button.hasClass("play")){
            _button.removeClass("play").addClass("pause");
            intervalCheck();
        }
        
        
        
        // reset time to beginning
        audio.currentTime = 0;
        // set volume to whatever volume bar is set at
        audio.volume = $('.volume-bar .inner').width() / 100;
        audio.play();
        
        updateMusicAnim();
        
        
        // capture track name from track list using regex, and put it in main player
        // \D+         <-- capture all nondigit characters...
        // [^\s\d+]    <-- ... until we find a single space followed by 1 or more digits (track time)
        var name = $(".track-list li")[index].textContent.match(/\D+[^\s\d+]/)[0];
        $('.audio-name')[0].textContent = name;
        
        
    }  // end changeSong()
    
    
     
             
}); // end document ready!







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
