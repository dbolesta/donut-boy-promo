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