var $window = $(window);
var controller = new ScrollMagic.Controller();
var containerHeight = $('.bottle--container').height();
var trigger = $('.bottle--trigger');
var el = $('.bottle');
el.css('height', ($window.height() - 200) + "px");
var topGutter = ( $window.height() - el.height()) / 4 * 3;

if ($window.width() > 575) {

    TweenMax.fromTo(el, 1,
        {css: {scaleX: 2, scaleY: 2, transformOrigin: "center top", top: "100%"}},
        {css: {top: el.height() / 3 * 2}, ease: Linear.easeNone});

    var tween = TweenMax.fromTo(el, 1,
        {css: {scaleX: 2, scaleY: 2, transformOrigin: "center top", top: el.height() / 3 * 2}},
        {css: {scaleX: 1, scaleY: 1, top: topGutter}, ease: Linear.easeNone});

    var scene = new ScrollMagic.Scene({triggerElement: trigger, triggerHook: 1, duration: containerHeight / 3 * 2})
        .setTween(tween)
        .addIndicators()
        .addTo(controller);
}