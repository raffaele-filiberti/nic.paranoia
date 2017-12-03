import './vendors/vendors.js';
import VerticalSlideshow from './vendors/slider';

let vs = new VerticalSlideshow(document.querySelector('.slideshow'));

var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
    // do something with the scroll position
}

window.addEventListener('scroll', function(e) {

    last_known_scroll_position = window.scrollY;

    if (!ticking) {

        window.requestAnimationFrame(function() {
           console.log(last_known_scroll_position);
            ticking = false;
        });

        ticking = true;

    }

});