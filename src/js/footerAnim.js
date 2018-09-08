/// This code is responsible for the footer elements sliding up at variable speeds when 
// the user scrolls to the bottom of the page
// we calculate the footer percentage, then control the 'bottom' style of 
// all of the images and divs in the footer


// bless this question:
// https://stackoverflow.com/questions/33859522/how-much-of-an-element-is-visible-in-viewport

(function ($) {
    'use strict';
    var results = {};
    var footer$ = $(document.querySelector('footer'));

    
    // debug: used for showing the % of footer on screen
    function display() {
        var resultString = '';

        $.each(results, function (key) {
            resultString += '(' + key + ': ' + Math.round(results[key]) + '%)';
        });

        $('#result').text(resultString);
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
            hiddenAfter = (footerPosition + footerHeight) - (docScroll + windowHeight);
        
        
        if ((docScroll > footerPosition + footerHeight) || (footerPosition > docScroll + windowHeight)) {
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
        results[footer$.attr('id')] = calculateVisibilityForFooter();
        display();
    }
    
    
    
    // we create an array of all of our 'actors' in the footer
    // all actors will have a `data-anim-start` and `data-anim-end` attribute,
    // so we can assume all elems with a '[data-anim-start]' will be an actor
    var animActors = [];
    
    $('[data-anim-start]').each(function(){
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
            newPosition = ( Number((footerVisibility / 100) * actor.end)) + Number(actor.start);
            $(actor.elem).css('bottom', newPosition+"px");
            
        }
        
    }
    
    

    $(document).scroll(function () {
        
        // debug purposes, update % on scroll
        calculateAndDisplayFooter();
        
        // this if statement checks to see if the footer is within the view of the window (with a 10px buffer). If it is, we update the position of all actors accordingly
        if (($(window).scrollTop() + window.innerHeight) - document.querySelector('footer').offsetTop >= -10) {
            updateFooterAnim();
        }
        
        // this if statement is a SAFTEY CHECK. Without it, if you were to scroll up very quickly from the bottom of the page, the above if statement would not run, keeping the footer actors on screen
        // what we do here is, if we are not in footer territory, check once to see if the first actor is in its starting position. If not, we update the positions of all actors, which will get all the elements back in their correct starting positions (off screen)
        if (($(window).scrollTop() + window.innerHeight) - document.querySelector('footer').offsetTop < -10 &&
           parseInt(animActors[0].start) < parseInt(animActors[0].elem.style.bottom)
           ) {
            updateFooterAnim();
        }
        
        
        
        
        
    });

    // debug
   /* $(document).ready(function () {
        calculateAndDisplayFooter();
    });*/
    
    
    
    
    
    
    
}(jQuery));