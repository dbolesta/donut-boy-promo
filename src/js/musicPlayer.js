$(document).ready(function(){
   $('.player-container').toArray().forEach(function(player){
    
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
    
    
    
                  
}); // end document ready







function sToTime(t) {
  return parseInt((t / (60)) % 60) + ":" + 
         padZero(parseInt((t) % 60));
}
function padZero(v) {
  return (v < 10) ? "0" + v : v;
}