//console.log("Hello World");

// particles.js initiation located at end of vendor/particles.js

$(document).ready(function(){
    
    // hamburger menu toggle
    $('.hero-text h3 span').click(function(){
        $('.info-box').toggleClass('is-showing');
    });
    $('.info-x').click(function(){
        $('.info-box').toggleClass('is-showing');
    });
});