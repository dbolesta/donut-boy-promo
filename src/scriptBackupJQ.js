// // !
// // particles.js initiation located at end of vendor/particles.js

// // set before document.ready so donut boy is placed in the right spot initially

// let donutBoyFooter = document.getElementsByClassName(
//    "donutboy-footer"
//  )[0];
//  let kellyFooter = document.getElementsByClassName("kelly-footer")[0];

//  donutBoyFooter.style.left = document.body.clientWidth * 0.05 + "px";
//  kellyFooter.style.right =
//    document.body.clientWidth - document.body.clientWidth * 0.95 + "px";

//  // $(".donutboy-footer").css({
//  //   left: $(document).width() * 0.05
//  // });

//  // $(".kelly-footer").css({
//  //   right: $(document).width() - $(document).width() * 0.95
//  // });

//  var $kelly = $(".kelly-footer");

//  function toggleTheClass(el, className) {
//    console.log(
//      "HEY MAN JUST LETTING YOU KNOW IM GONNA TOGGLE THE CLASS FOR "
//    );
//    console.log(el);
//    console.log("WITH THE CLASS");
//    console.log(className);
//    if (el.classList) {
//      el.classList.toggle(className);
//      console.log("yeah it has the class");
//    } else {
//      console.log("naw its mising the class");
//      var classes = el.className.split(" ");
//      var existingIndex = classes.indexOf(className);

//      if (existingIndex >= 0) classes.splice(existingIndex, 1);
//      else classes.push(className);

//      el.className = classes.join(" ");
//    }
//  }

//  //$(document).ready(function() {
//  /* Activate FitVids jQuery plugin (located in pluginScripts.js)
//      --------------------------------------------------------------- */
//  //$(".video-container").fitVids();

//  /* hamburger menu toggle
//      ------------------------- */

//  // document.getElementsByClassName("js-toggle-info-box").forEach(el => {
//  //   el.addEventListener("click", function() {
//  //     toggleTheClass(
//  //       document.getElementsByClassName("info-box")[0],
//  //       "is-showing"
//  //     );
//  //   });
//  // });

//  [].forEach.call(
//    document.getElementsByClassName("js-toggle-info-box"),
//    function(el) {
//      el.addEventListener("click", function() {
//        toggleTheClass(
//          document.querySelector(".info-box"),
//          "is-showing"
//        );
//      });
//    }
//  );

//  //   $(".hero-text h3 span").click(function() {
//  //     $(".info-box").toggleClass("is-showing");
//  //   });
//  // $(".info-x").click(function() {
//  //   $(".info-box").toggleClass("is-showing");
//  // });

//  /* travel location button selection
//      ------------------------------------ */
//  $(".travel-menu li").click(function() {
//    $(".travel-menu li").removeClass("selected");
//    $(this).addClass("selected");

//    // change bg image of travel section, taken from data attribute "bgimg"
//    var newImg = this.dataset.bgimg;

//    $(".travel")
//      .fadeTo("fast", 0.3, function() {
//        $(this).css("background-image", "url(/imgs/" + newImg + ")");
//      })
//      .fadeTo("fast", 1);
//  });

//  /* move donut boy in footer animation
//      ------------------------------------ */
//  var $horizontal = $(".donutboy-footer");
//  var $horizontalImg = $(".donutboy-footer img");
//  var prevScroll = 0;

//  // listen for both window scroll and resize
//  $(window).on("scroll resize", function() {
//    var s = $(this).scrollTop(),
//      d = $(document).height(),
//      c = $(this).height();

//    console.log("Position testing: jquery : js");
//    console.log($kelly.position());
//    console.log($(kellyFooter).position());

//    // take the current scroll position
//    // and divide it by the remaining page height
//    // (which is total height - viewable height)
//    // (all units in px)
//    scrollPercent = s / (d - c);

//    //var position = ( (scrollPercent * ($(document).width() * .85 - $horizontal.width())) + $(document).width() * .05  ) ;

//    var position =
//      scrollPercent * ($kelly.position().left - $horizontal.width()) +
//      $(document).width() * 0.01;

//    //var position = ( (scrollPercent * ($(document).width() - ($(document).width() * .95) ) ) + ($(document).width() * .05)  ) ;

//    // Only when we havnt reached kelly do we...
//    if (position < $kelly.position().left - $horizontal.width()) {
//      // ...change position of donut boy
//      $horizontal.css({
//        left: position
//      });

//      // ...flip donut boy based on last scroll direction
//      if (s > prevScroll) {
//        if ($horizontalImg.hasClass("db-backwards")) {
//          $horizontalImg.removeClass("db-backwards");
//        }
//      } else {
//        if (!$horizontalImg.hasClass("db-backwards")) {
//          $horizontalImg.addClass("db-backwards");
//        }
//      }

//      // ... make sure db is facing right if were at the top of the page
//      if (s == 0) {
//        if ($horizontalImg.hasClass("db-backwards")) {
//          $horizontalImg.removeClass("db-backwards");
//        }
//      }

//      // ... remove animation classes, if not already removed
//      if ($horizontal.hasClass("bounce")) {
//        $horizontal.removeClass("bounce");
//        $horizontal.removeClass("animated-db");
//      }
//      if ($kelly.hasClass("bounce")) {
//        $kelly.removeClass("bounce");
//        $kelly.removeClass("animated-kelly");
//      }
//    } else {
//      // If we HAVE reached Kelly...

//      // ... add the necessary animation classes to both DB and Kelly
//      if (!$horizontal.hasClass("bounce")) {
//        $horizontal.addClass("bounce");
//        $horizontal.addClass("animated-kelly");
//      }
//      if (!$kelly.hasClass("bounce")) {
//        $kelly.addClass("bounce");
//        $kelly.addClass("animated-db");
//      }
//    }

//    prevScroll = s; // update previous scroll position so we can compare the numbers, and detect if we've scrolled up or down

//    //console.log(position);
//  });

//  // on resize, move kelly so she's always on screen
//  $(window).on("resize", function() {
//    $kelly.css({
//      right: $(document).width() - $(document).width() * 0.95
//    });

//    // also move damon
//    $horizontal.css({
//      left:
//        scrollPercent * ($kelly.position().left - $horizontal.width()) +
//        $(document).width() * 0.01
//    });
//  });

//  /* scroll the enemy/item scrollbars
//      ----------------------------------- */

//  $(".btn-scroll").on("click", function() {
//    // we grab the overflow-sidescroll container that is the parent of `this`
//    // we check the classlist, and select the second class, since the first is
//    // always .overflow-sidescroll. The second will be the unique identifier
//    var preElem = "." + this.closest("div").classList[1];

//    // Use the preElem to capture that sidescroll div
//    var elem = document.querySelector(preElem + " .sidescroll");

//    // capture current scrollleft of the sidescroll, to know how much to add or subtract
//    var numToScroll = elem.scrollLeft;

//    // get max possible scroll distance
//    var maxScrollLeft = elem.scrollWidth - elem.clientWidth;

//    // get true width (including padding) of first indiviual item
//    var widthOfDiv = elem.getElementsByTagName("div")[0].offsetWidth;

//    // detect if left or right was selected
//    if ($(this).hasClass("btn-scroll--right")) {
//      numToScroll += widthOfDiv * 2; // scroll by 2 item sizes
//      // if past max scroll distance, scroll to end instead
//      if (numToScroll > maxScrollLeft) {
//        numToScroll = maxScrollLeft;
//      }
//    }
//    if ($(this).hasClass("btn-scroll--left")) {
//      numToScroll -= widthOfDiv * 2;
//      // same as above, but dont allow to scroll past beginning
//      if (numToScroll < 0) {
//        numToScroll = 0;
//      }
//    }

//    // scroll by number determined above
//    $(elem).animate({ scrollLeft: numToScroll }, 150);

//    // function call to enable / disable buttons if min/max distance reached
//    scrollBtnEnable(maxScrollLeft, preElem, numToScroll);
//  }); // end .btn-scroll click event

//  function scrollBtnEnable(maxScroll, preElem, numToScroll) {
//    var leftButt = $(preElem + " .btn-scroll--left");
//    var rightButt = $(preElem + " .btn-scroll--right");

//    if (numToScroll >= 0 && numToScroll <= maxScroll) {
//      if (leftButt.hasClass("btn-game--disabled")) {
//        leftButt.removeClass("btn-game--disabled");
//      }
//      if (rightButt.hasClass("btn-game--disabled")) {
//        rightButt.removeClass("btn-game--disabled");
//      }
//    }

//    if (numToScroll <= 0 && !leftButt.hasClass("btn-game--disabled")) {
//      leftButt.addClass("btn-game--disabled");
//    }

//    if (
//      numToScroll >= maxScroll &&
//      !rightButt.hasClass("btn-game--disabled")
//    ) {
//      rightButt.addClass("btn-game--disabled");
//    }
//  } // end scrollBtnEnable()

//  /* Select New Enemy
//      ----------------------------------- */
//  $(".sidescroll div").on("click", function() {
//    var preElem = "." + this.closest(".asset-display").classList[1];
//    var elem = document
//      .querySelector(preElem)
//      .querySelector(".asset-info");
//    console.log(preElem);

//    // remove .selected class from all images, then add it to the selected one
//    $(preElem + " .sidescroll div img").removeClass("selected");
//    $(this)
//      .find("img")
//      .addClass("selected");

//    // capture necessary info from selected image
//    const name = this.querySelector(".e-name").textContent;
//    const fact1 = this.querySelector(".e-fact1").textContent;
//    const fact2 = this.querySelector(".e-fact2").textContent;

//    // capture image name, then use regex to capture without directory or file extention (since we want to use .gif)
//    const image = this.querySelector("img").src;
//    var imageName;
//    if (preElem.indexOf("enemy") !== -1) {
//      imageName = image.match(/imgs\/(.*)\.png/)[1];
//      imageName = "/imgs/" + imageName + ".gif";
//    } else {
//      imageName = image;
//    }

//    // update main area with newly selected image and info
//    elem.querySelector(".asset-image img").src = imageName;
//    elem.querySelector(".asset-text h2").textContent = name;
//    elem
//      .querySelector(".asset-text ul")
//      .getElementsByTagName("li")[0].textContent = fact1;
//    elem
//      .querySelector(".asset-text ul")
//      .getElementsByTagName("li")[1].textContent = fact2;
//  });
//  //});

//  //   .:::.   .:::.
//  //  :::::::.:::::::
//  //  :::::::::::::::
//  //  ':::::::::::::'
//  //    ':::::::::'
//  //      ':::::'
//  //        ':'
