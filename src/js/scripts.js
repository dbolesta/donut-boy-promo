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
  DOM.travel.style.backgroundImage = `url(./imgs/${travelImg})`;
  DOM.travel.classList.add("selected-image");
  console.log(`url(../imgs/${travelImg})`);
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
    imageName = `/imgs/${imageName}.gif`;
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
