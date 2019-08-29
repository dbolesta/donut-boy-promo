/// This code is responsible for the footer elements sliding up at variable speeds when
// the user scrolls to the bottom of the page
// we calculate the footer percentage, then control the 'bottom' style of
// all of the images and divs in the footer

// bless this question:
// https://stackoverflow.com/questions/33859522/how-much-of-an-element-is-visible-in-viewport

(function($) {
  "use strict";
  var results = {};
  var footer$ = $(document.querySelector("footer"));

  // debug: used for showing the % of footer on screen
  function display() {
    var resultString = "";

    $.each(results, function(key) {
      resultString +=
        "(" + key + ": " + Math.round(results[key]) + "%)";
    });

    // jank quick addition to show play button when scrolled down all the way
    if (calculateVisibilityForFooter() > 85) {
      $(".footer-button-container").fadeIn();
    } else {
      $(".footer-button-container").fadeOut();
    }

    $("#result").text(resultString);
  }

  // where we actually figure out and calculate percentage of footer on screen
  function calculateVisibilityForFooter() {
    var windowHeight = $(window).height(),
      docScroll = $(document).scrollTop(),
      footerHeight = footer$.height(),
      footerPosition = footer$.offset().top,
      // Hidden before = Ammount of div hidden by the TOP of the window
      // Hidden after = Ammount of div hidden by the BOTTOM of the window
      //hiddenBefore = docScroll - footerPosition,
      hiddenAfter =
        footerPosition + footerHeight - (docScroll + windowHeight);

    if (
      docScroll > footerPosition + footerHeight ||
      footerPosition > docScroll + windowHeight
    ) {
      return 0;
    } else {
      var result = 100;

      // BY HIDING THIS BLOCK, THIS CODE WILL RETURN THE PERCENTAGE UNTIL THE BOTTOM OF
      // FOOTER HAS HIT THE BOTTOM OF THE WINDOW, ONCE THE FOOTER IS WITHIN THE WINDOW
      /*if (hiddenBefore > 0) {
                result -= (hiddenBefore * 100) / footerHeight;
            }*/

      if (hiddenAfter > 0) {
        result -= (hiddenAfter * 100) / footerHeight;
      }

      return result;
    }
  }

  // debug: used to show percentage on top of screen
  function calculateAndDisplayFooter() {
    results[footer$.attr("id")] = calculateVisibilityForFooter();
    display();
  }

  // we create an array of all of our 'actors' in the footer
  // all actors will have a `data-anim-start` and `data-anim-end` attribute,
  // so we can assume all elems with a '[data-anim-start]' will be an actor
  var animActors = [];

  $("[data-anim-start]").each(function() {
    // we collect the necessary info: the elem itself, and start and end positions
    animActors.push({
      elem: this,
      start: this.dataset.animStart,
      end: this.dataset.animEnd
    });
  });

  // brain of the animation
  function updateFooterAnim() {
    // we need the percentage calculation to base our math off
    var footerVisibility = calculateVisibilityForFooter();
    var actor;
    var newPosition;

    for (var i = 0; i < animActors.length; i++) {
      actor = animActors[i];

      // we take the final position that we want all actors to end up at (using 'bottom' style)
      // and calculate the percentage difference of that final position relative to its start position
      // ( ( %ofVisibleFooter / 100 ) * endPosition ) + startPosition
      newPosition =
        Number((footerVisibility / 100) * actor.end) +
        Number(actor.start);
      $(actor.elem).css("bottom", newPosition + "px");
    }
  }

  $(document).scroll(function() {
    // debug purposes, update % on scroll
    calculateAndDisplayFooter();

    // this if statement checks to see if the footer is within the view of the window (with a 10px buffer). If it is, we update the position of all actors accordingly
    if (
      $(window).scrollTop() +
        window.innerHeight -
        document.querySelector("footer").offsetTop >=
      -10
    ) {
      updateFooterAnim();
    }

    // this if statement is a SAFTEY CHECK. Without it, if you were to scroll up very quickly from the bottom of the page, the above if statement would not run, keeping the footer actors on screen
    // what we do here is, if we are not in footer territory, check once to see if the first actor is in its starting position. If not, we update the positions of all actors, which will get all the elements back in their correct starting positions (off screen)
    if (
      $(window).scrollTop() +
        window.innerHeight -
        document.querySelector("footer").offsetTop <
        -10 &&
      parseInt(animActors[0].start) <
        parseInt(animActors[0].elem.style.bottom)
    ) {
      updateFooterAnim();
    }
  });

  // debug
  /* $(document).ready(function () {
        calculateAndDisplayFooter();
    });*/
})(jQuery);

var audio = $('.player').find('audio')[0];

$(document).ready(function() {
  var player = $('.player');
  var _button = $(player).find('.btn-music');

  // find the audio tag
  //var audio = $(player).find("audio")[2];
  var seekbarInner = $(player).find('.seek-bar .inner');
  var seekbarOuter = $(player).find('.seek-bar .outer');
  var volumeControl = $(player).find('.volume-control .volume-bar');
  var volumeIcon = $(player).find('.volume-control .volume-icon');

  var length;
  var interval; // used to run setInterval Function
  var seekbarPercentage;
  var muteVolume; // used to remember where volume was before muting
  var mutePosition; // same but for volume handle and inner bar

  var volumePosition = 100; // position of volume handle & inner bar
  var audioVolume = 1; // volume of audio // default values in case mute without changing first

  var seekDrag = false; // for dragging seek position
  var volumeDrag = false;

  ///----------  play song on click -----------///

  // seekbar control

  $(document).on(
    'mousedown',
    '.seek-bar .outer, .seek-handle',
    function(e) {
      seekDrag = true;
      updateSeekbar(e);
    }
  );
  $(document).on('mouseup', function(e) {
    if (seekDrag) {
      seekDrag = false;
      updateSeekbar(e);
    }
  });
  $(document).on('mousemove', function(e) {
    if (seekDrag) {
      updateSeekbar(e);
    }
  });

  // volume control
  $(document).on(
    'mousedown',
    '.volume-control .outer, .volume-handle',
    function(e) {
      volumeDrag = true;
      updateVolume(e);
    }
  );
  $(document).on('mouseup', function(e) {
    if (volumeDrag) {
      volumeDrag = false;
      updateVolume(e);
    }
  });
  $(document).on('mousemove', function(e) {
    if (volumeDrag) {
      updateVolume(e);
    }
  });
  $(volumeIcon).on('click', function(e) {
    toggleVolume(e);
  });

  var updateVolume = function(e, position, volume) {
    // assign position of volume thing & audio either my calculating, or if a param is passed
    volumePosition =
      position != undefined
        ? position
        : e.pageX - volumeControl.offset().left;
    audioVolume =
      volume != undefined
        ? volume
        : volumePosition / volumeControl.width();

    if (audioVolume >= 0 && audioVolume <= 1) {
      audio.volume = audioVolume;
      volumeControl
        .find('.inner')
        .css('width', audioVolume * 100 + '%');
      $('.volume-bar .volume-handle').css(
        'left',
        audioVolume * 100 + '%'
      );
    }
  };

  var toggleVolume = function(e) {
    if (audio.volume != 0) {
      // remember what the values were before muting
      mutePosition = volumePosition;
      muteVolume = audioVolume;
      // mute
      updateVolume(null, 0, 0);
    } else {
      // unmute
      updateVolume(null, mutePosition, muteVolume);
    }
  };

  $('.btn-forward').on('click', function() {
    var numOfSongs = $('.player audio').legnth;

    $('.player audio').each(function(index, value) {
      console.log(index, value);

      if (audio == value) {
        var newIndex = index;

        if (index == 4) {
          newIndex = -1;
        }

        console.log(index, newIndex);
        changeSong(newIndex + 1);
        return false;
      }
    });
  });

  $('.btn-back').on('click', function() {
    var numOfSongs = $('.player audio').legnth;

    $('.player audio').each(function(index, value) {
      console.log(index, value);

      if (audio == value) {
        var newIndex = index;

        if (index == 0) {
          newIndex = 5;
        }

        console.log(index, newIndex);
        changeSong(newIndex - 1);
        return false;
      }
    });
  });

  /// all functions

  var playButton = function() {
    // check for play class
    if (_button.hasClass('play')) {
      _button.removeClass('play').addClass('pause');

      // find length of audio
      length = audio.duration;
      // set end time
      $(player)
        .find('.timing .end')
        .text(sToTime(length));

      // play the audio
      console.log('Audio is playing!!!');
      audio.play();

      // interval stuff
      intervalCheck();
    } // end if loop
    else if (_button.hasClass('pause')) {
      _button.removeClass('pause').addClass('play');
      clearInterval(interval);
      audio.pause();
    } // end else

    updateMusicAnim();
    // toggle animated album art
    //$(".track-list li.selected i").toggleClass("animate");
  }; // end playButton()

  _button.on('click', function() {
    playButton();
  });

  var intervalCheck = function() {
    interval = setInterval(function() {
      console.log('setinterval is running');
      // update seek bar
      if (!audio.paused) {
        // while audio is playing
        updateSeekbarInterval();
      }

      //Audio has ended
      if (audio.ended) {
        clearInterval(interval);
        _button.removeClass('pause').addClass('play');
        seekbarInner.width(100 + '%');
        updateMusicAnim();
      }
    }, 250);
  };

  var updateMusicAnim = function() {
    $('.track-list li i').removeClass('animate');
    if (!audio.paused) {
      $('.track-list li.selected i').addClass('animate');
    }
  };
  var updateSeekbarInterval = function() {
    seekbarPercentage = getPercentage(
      audio.currentTime.toFixed(2),
      length.toFixed(2)
    );

    // update seekbar percentage
    $(seekbarInner).css('width', seekbarPercentage + '%');
    $('.seek-bar .seek-handle').css('left', seekbarPercentage + '%');

    // update current/start time
    $(player)
      .find('.timing .start')
      .text(sToTime(audio.currentTime));
  }; // end updateSeekbar1()

  //update seekbar
  var updateSeekbar = function(e) {
    if (/*!audio.ended && */ length !== undefined) {
      console.log('this is e: ', e);
      var seekPosition = e.pageX - $(seekbarOuter).offset().left;

      if (
        seekPosition >= 0 &&
        seekPosition <= $(seekbarOuter).width()
      ) {
        audio.currentTime =
          (seekPosition * audio.duration) / $(seekbarOuter).width();

        seekbarPercentage = getPercentage(
          audio.currentTime.toFixed(2),
          length.toFixed(2)
        );

        // update seekbar percentage
        $(seekbarInner).css('width', seekbarPercentage + '%');
        $('.seek-bar .seek-handle').css(
          'left',
          seekbarPercentage + '%'
        );

        // update current/start time
        $(player)
          .find('.timing .start')
          .text(sToTime(audio.currentTime));
      }
    }
  }; // end updateSeekbar1()

  // find percentage
  var getPercentage = function(presentTime, totalLength) {
    var calcPercentage = (presentTime / totalLength) * 100;
    return parseFloat(calcPercentage.toString());
  };

  $('.track-list li').on('click', function() {
    var index = $(this).index();

    if (audio != $(player).find('audio')[index]) {
      changeSong(index);
    }
  });

  // change the song!

  var changeSong = function(index) {
    // pause current song, if not already paused
    if (!audio.paused) {
      audio.pause();
    }

    // update audio var to correct song, also capture length of new song
    audio = $('.player').find('audio')[index];
    length = audio.duration;

    // update length of song on track
    $(player)
      .find('.timing .end')
      .text(sToTime(length));

    // remove icon next to song, add to correct song via index using eq()
    $('.track-list li').removeClass('selected');
    $('.track-list li')
      .eq(index)
      .addClass('selected');
    // note for future damon:
    // eq(): Reduce the set of matched elements to the one at the specified index.
    // https://api.jquery.com/eq/

    if (_button.hasClass('play')) {
      _button.removeClass('play').addClass('pause');
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
    var name = $('.track-list li')[index].textContent.match(
      /\D+[^\s\d+]/
    )[0];
    $('.audio-name')[0].textContent = name;
  }; // end changeSong()
}); // end document ready!

function sToTime(t) {
  return parseInt((t / 60) % 60) + ':' + padZero(parseInt(t % 60));
}
function padZero(v) {
  return v < 10 ? '0' + v : v;
}

// !
// particles.js initiation located at end of vendor/particles.js

// vars used in program
let DOM = {}, // cache DOM elements
  travelImg, // image used to show for travel section
  prevScroll = 0; // last position of window scroll

function cacheDOM() {
  // damon in footer
  DOM.donutBoyFooter = document.getElementsByClassName(
    "donutboy-footer"
  )[0];
  // damon image specifically
  DOM.donutBoyImg = DOM.donutBoyFooter.firstElementChild;
  // kelly in footer
  DOM.kellyFooter = document.getElementsByClassName(
    "kelly-footer"
  )[0];
  // asterisk and x for info-box toggling
  // (used with toArray to convert from array-like to real array)
  DOM.infoBoxToggles = toArray(
    document.getElementsByClassName("js-toggle-info-box")
  );

  // travel section (for bg image);
  DOM.travel = document.getElementsByClassName("travel")[0];

  // travel buttons
  DOM.travelButtons = toArray(
    document.querySelectorAll(".travel-menu li")
  );

  // asset display scroll buttons
  DOM.scrollButtons = toArray(
    document.getElementsByClassName("btn-scroll")
  );

  DOM.assets = document.querySelectorAll(".sidescroll>div");
}

// bind the events
/////////
function bindEvents() {
  DOM.infoBoxToggles.forEach(el => {
    el.addEventListener("click", function() {
      toggleTheClass(
        document.querySelector(".info-box"),
        "is-showing"
      );
    });
  });
  DOM.travelButtons.forEach(el => {
    el.addEventListener("click", function(e) {
      if (!e.currentTarget.classList.contains("selected")) {
        removeTravelImage(e);
      }
    });

    // unfortunately need to do this just to prevent from conflicting
    // with listener below :(
    el.addEventListener("transitionend", function(e) {
      e.stopPropagation();
    });
  });

  // when image is removed, replace it with newly selected travelImg
  DOM.travel.addEventListener("transitionend", function(e) {
    if (!e.currentTarget.classList.contains("selected-image")) {
      replaceTravelImage(travelImg);
    }
  });

  // window scroll / resize for damonFindKelly
  window.addEventListener("scroll", damonFindsKelly);
  window.addEventListener("resize", damonFindsKelly);
  window.addEventListener("resize", damonKellyResizeUpdate);

  // asset scroll buttons
  DOM.scrollButtons.forEach(el => {
    el.addEventListener("click", function() {
      console.log("Scroll button clicked");
      //console.log(el.parentNode);
      assetScroll(el);
    });
  });

  // clicking on asset will swap image and info
  DOM.assets.forEach(el => {
    el.addEventListener("click", function() {
      // prevent call if already selected
      if (!el.querySelector("img").classList.contains("selected")) {
        assetClick(el);
      }
    });
  });
}

cacheDOM();
bindEvents();

// preload background images for travel section
[
  "Bakery.png",
  "Fish2.png",
  "Basement.png",
  "StatenIsland.png"
].forEach(function(img) {
  new Image().src = "./imgs/level" + img;
});

// set up initial positions for damon and kelly real quick
DOM.donutBoyFooter.style.left =
  document.body.clientWidth * 0.05 + "px";
DOM.kellyFooter.style.right =
  document.body.clientWidth - document.body.clientWidth * 0.95 + "px";

// remove the travel image when a new one is clicked on
function removeTravelImage(e) {
  DOM.travelButtons.forEach(function(el) {
    el.classList.remove("selected");
  });

  // e.currentTarget == `this`, could use either one here
  e.currentTarget.classList.add("selected");

  DOM.travel.classList.remove("selected-image");
  // could also use `this.getAttribute("data-bgimg")`
  travelImg = e.currentTarget.dataset.bgimg;
}

// called when `transitionend` event fires on DOM.travel to update to new image
function replaceTravelImage(img) {
  DOM.travel.style.backgroundImage = "url(./imgs/" + img + ")";
  DOM.travel.classList.add("selected-image");
  console.log(`url(./imgs/${travelImg})`);
}

// update position of damon to get closer to kelly in relation with screen scroll percentage
function damonFindsKelly() {
  // use custom getScrollInfo function to obtain both ther percentage
  // of screen scrolled so far, as well as scrollTop info (total px scrolled so far)
  let scrollPercent = getScrollInfo().percent;
  let s = getScrollInfo().top;

  // 50 here is DOM.donutBoyFooter width. Hardcode because of "layout reflow / thrashing"
  // detailed / linked in the first comment to the question (not the answer but the comment)
  // https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
  let position =
    scrollPercent * (DOM.kellyFooter.offsetLeft - 50) +
    document.body.clientWidth * 0.01;

  // Only when we havnt reached kelly do we...
  if (position < DOM.kellyFooter.offsetLeft - 50) {
    // ...change position of donut boy
    DOM.donutBoyFooter.style.left = position + "px";

    // ...flip donut boy based on last scroll direction
    if (s > prevScroll) {
      if (DOM.donutBoyImg.classList.contains("db-backwards")) {
        DOM.donutBoyImg.classList.remove("db-backwards");
      }
    } else {
      if (!DOM.donutBoyImg.classList.contains("db-backwards")) {
        DOM.donutBoyImg.classList.add("db-backwards");
      }
    }
    //   // ... make sure db is facing right if were at the top of the page
    if (s == 0) {
      if (DOM.donutBoyImg.classList.contains("db-backwards")) {
        DOM.donutBoyImg.classList.remove("db-backwards");
      }
    }

    // ... remove animation classes, if not already removed
    if (DOM.donutBoyFooter.classList.contains("bounce")) {
      DOM.donutBoyFooter.classList.remove("bounce");
      DOM.donutBoyFooter.classList.remove("animated-db");
    }
    if (DOM.kellyFooter.classList.contains("bounce")) {
      DOM.kellyFooter.classList.remove("bounce");
      DOM.kellyFooter.classList.remove("animated-kelly");
    }
  } else {
    // If we HAVE reached Kelly...

    // ... add the necessary animation classes to both DB and Kelly
    if (!DOM.donutBoyFooter.classList.contains("bounce")) {
      DOM.donutBoyFooter.classList.add("bounce");
      DOM.donutBoyFooter.classList.add("animated-kelly");
    }
    if (!DOM.kellyFooter.classList.contains("bounce")) {
      DOM.kellyFooter.classList.add("bounce");
      DOM.kellyFooter.classList.add("animated-db");
    }
  }
  prevScroll = s; // update previous scroll position so we can compare the numbers, and detect if we've scrolled up or down
}

/* move donut boy in footer animation
    ------------------------------------ */

// on resize, move damon & kelly so theyre always on screen
function damonKellyResizeUpdate() {
  DOM.kellyFooter.style.right =
    document.body.clientWidth -
    document.body.clientWidth * 0.95 +
    "px";

  DOM.donutBoyFooter.style.right =
    getScrollInfo().percent * (DOM.kellyFooter.offsetLeft - 50) +
    document.body.clientWidth * 0.01;
}

/* scroll the enemy/item scrollbars when left/right buttons are clicked
    ----------------------------------- */
function assetScroll(el) {
  // determine if button clicked was a righty or a lefty
  let scrollDir = el.classList.contains("btn-scroll--right")
    ? "right"
    : "left";

  // the actual, scrollable container of clicked button
  let elem = el.parentNode.querySelector(".sidescroll");

  // ammount of scroll for the active .sidescroll
  let numToScroll = elem.scrollLeft;
  let maxScrollLeft = elem.scrollWidth - elem.clientWidth;
  let widthOfDiv = elem.getElementsByTagName("div")[0].offsetWidth;

  // adjust numbers based on if it should be left or right
  if (scrollDir === "right") {
    numToScroll += widthOfDiv * 2; // scroll by 2 item sizes
    // if past max scroll distance, scroll to end instead
    if (numToScroll > maxScrollLeft) {
      numToScroll = maxScrollLeft;
    }
  } else {
    numToScroll -= widthOfDiv * 2;
    // same as above, but dont allow to scroll past beginning
    if (numToScroll < 0) {
      numToScroll = 0;
    }
  }

  // scrollTo is custom function to animate scroll distance
  // scrollBtnEnable will disable or reenable buttons if it is appropriate
  scrollTo(elem, numToScroll, 120);
  scrollBtnEnable(maxScrollLeft, elem, numToScroll);
}

// disable or reenable buttons if distance dictates it
function scrollBtnEnable(maxScroll, elem, numToScroll) {
  // left and right buttons
  let leftButt = elem.previousElementSibling;
  let rightButt = elem.nextElementSibling;

  if (numToScroll >= 0 && numToScroll <= maxScroll) {
    if (leftButt.classList.contains("btn-game--disabled")) {
      leftButt.classList.remove("btn-game--disabled");
    }
    if (rightButt.classList.contains("btn-game--disabled")) {
      rightButt.classList.remove("btn-game--disabled");
    }
  }

  if (
    numToScroll <= 0 &&
    !leftButt.classList.contains("btn-game--disabled")
  ) {
    leftButt.classList.add("btn-game--disabled");
  }

  if (
    numToScroll >= maxScroll &&
    !rightButt.classList.contains("btn-game--disabled")
  ) {
    rightButt.classList.add("btn-game--disabled");
  }
} // scrollBtnEnable2

// update asset information, name, and selection based on new click
function assetClick(el) {
  // cache the relevent elements we're about to edit
  const assetContainer = el.closest(".asset-display");
  const assetSidescroll = el.closest(".sidescroll");
  const assetInfo = assetContainer.querySelector(".asset-info");
  const assetImage = assetInfo.querySelector(".asset-image img");
  const assetText = assetInfo.querySelector(".asset-text");
  const selectedImg = el.querySelector("img");

  // remove `selected` class from all images in currently active container
  assetSidescroll.querySelectorAll("div img").forEach(e => {
    e.classList.remove("selected");
  });
  // then add the class to the specifically clicked element
  selectedImg.classList.add("selected");

  // capture necessary info from selected image
  const name = el.querySelector(".e-name").textContent;
  const fact1 = el.querySelector(".e-fact1").textContent;
  const fact2 = el.querySelector(".e-fact2").textContent;

  // capture image name, then use regex to capture without directory or file extention (since we want to use .gif)
  const image = selectedImg.src;
  let imageName;
  if (assetContainer.classList.contains("enemy-display")) {
    imageName = image.match(/imgs\/(.*)\.png/)[1];
    imageName = `./imgs/${imageName}.gif`;
  } else {
    imageName = image;
  }

  // update main area with newly selected image and info
  assetImage.src = imageName;
  assetText.querySelector(".asset-text h2").textContent = name;
  assetText
    .querySelector(".asset-text ul")
    .getElementsByTagName("li")[0].textContent = fact1;
  assetText
    .querySelector(".asset-text ul")
    .getElementsByTagName("li")[1].textContent = fact2;
}

//  _          _
// | |        | |
// | |__   ___| |_ __   ___ _ __ ___
// | '_ \ / _ \ | '_ \ / _ \ '__/ __|
// | | | |  __/ | |_) |  __/ |  \__ \
// |_| |_|\___|_| .__/ \___|_|  |___/
//              | |
//              |_|

// will return an object containing both the scroll percentage and how many
// px have been scroll from the top
//////////////////////
function getScrollInfo() {
  let s =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop, // (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
    d = document.documentElement.scrollHeight,
    c = window.innerHeight;

  // percent:
  // take the current scroll position
  // and divide it by the remaining page height
  // (which is total height - viewable height)
  // (all units in px)

  // s:
  // the scrollTop
  return {
    percent: s / (d - c),
    top: s
  };
}

// ScrollLeft animation for assets
// thx m8:
// https://gist.github.com/andjosh/6764939
function scrollTo(element, to, duration) {
  console.log("Scrollin to, here da things");
  console.log(element);
  console.log(to);
  console.log(duration);
  var start = element.scrollLeft,
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function() {
    currentTime += increment;
    var val = Math.easeInOutQuad(
      currentTime,
      start,
      change,
      duration
    );
    element.scrollLeft = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

// toggles class
function toggleTheClass(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(" ");
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0) classes.splice(existingIndex, 1);
    else classes.push(className);

    el.className = classes.join(" ");
  }
}

// takes an array-like (htmlCollection, nodelist, etc) and returns it as an array
function toArray(arrLike) {
  // or asArray(), or array(), or *whatever*
  return [].slice.call(arrLike);
}

//   .:::.   .:::.
//  :::::::.:::::::
//  :::::::::::::::
//  ':::::::::::::'
//    ':::::::::'
//      ':::::'
//        ':'
