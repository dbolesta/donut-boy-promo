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

    $(document).scroll(function () {
        //calculateAndDisplayFooter();
        //console.log(calculateVisibilityForFooter());
        calculateAndDisplayFooter();
        
        
        
        
        var newTrans = (calculateVisibilityForFooter() / 100) * -67;
        $('.footer-animation').css("transform", "translateY("+newTrans+"px)");
        
        var newTrans2 = (calculateVisibilityForFooter() / 100) * -175;
        $('.beach-waves').css("transform", "translateY("+newTrans2+"px)");
        
        
    });

    $(document).ready(function () {
        //calculateAndDisplayFooter();
        calculateAndDisplayFooter();
    });
    
    
    
    
    
    
    
}(jQuery));