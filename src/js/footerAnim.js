// bless this question:
// https://stackoverflow.com/questions/33859522/how-much-of-an-element-is-visible-in-viewport

(function ($) {
    'use strict';
    var results = {};
    var footer$ = $(document.querySelector('footer'));

    function display() {
        var resultString = '';

        $.each(results, function (key) {
            resultString += '(' + key + ': ' + Math.round(results[key]) + '%)';
        });

        $('#result').text(resultString);
    }

    function calculateVisibilityForFooter() {
        var windowHeight = $(window).height(),
            docScroll = $(document).scrollTop(),
            footerHeight = footer$.height(),
            footerPosition = footer$.offset().top,
            // Hidden before = Ammount of div hidden by the TOP of the window
            // Hidden after = Ammount of div hidden by the BOTTOM of the window
            hiddenBefore = docScroll - footerPosition,
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

    function calculateAndDisplayFooter() {
            //var footer$ = $('footer').eq(0);
           
        
        //console.log("DIV?? ", footer$);
            results[footer$.attr('id')] = calculateVisibilityForFooter();

        display();
    }
    
    
    var animActors = [];
    
    /*$.each(footer$, function(index, elem){
        animActors.push(elem);
        //$(".beach-tree").is('[data-anim-start]')
    })*/
    
    $('[data-anim-start]').each(function(){
       //animActors.push(this.dataset); 
        animActors.push({
            elem: this,
            start: this.dataset.animStart,
            end: this.dataset.animEnd,
            value: this.dataset.animValue ? 'bottom' : 'top'
        });
    });
    
    /*console.log("Heres anim actors");
    console.log(animActors);
    */
    
    function updateFooterAnim() {
        //console.log("updating footer anim func");
        
        var footerVisibility = calculateVisibilityForFooter();
        var actor;
        var newPosition;
        
        for (var i = 0; i < animActors.length; i++) {
            actor = animActors[i];
            //console.log(actor);
            
            newPosition = ( Number((footerVisibility / 100) * actor.end)) + Number(actor.start);
            if (actor.value == "bottom"){
                //console.log(Number((( footerVisibility / 100) * actor.end)) + Number(actor.start));
                //console.log(actor.value);
            }
            
            $(actor.elem).css(actor.value, newPosition+"px");
            
        }
        
    }
    
    

    $(document).scroll(function () {
        //calculateAndDisplayFooter();
        //console.log(calculateVisibilityForFooter());
        calculateAndDisplayFooter();
        
        
        // CHANGE THIS to CHECK OFFSEt toP OF FOOTER BASED ON VIEWPORT??
        //WILL BE BETTER FOR  PERFORMANCE
        if (calculateVisibilityForFooter() > 0){
            updateFooterAnim();
        }
        
    });

    $(document).ready(function () {
        //calculateAndDisplayFooter();
        calculateAndDisplayFooter();
    });
    
    
    
    
    
    
    
}(jQuery));