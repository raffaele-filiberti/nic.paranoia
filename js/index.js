$(document).ready(function () {

    /**
     *
     * @type {Controller}
     */
    var controller = new ScrollMagic.Controller();
    var parallaxTest = $('div[id*="parallax-test"]');
    var parallaxTrigger = $('div[id*="parallax-trigger"]');

    $.each(parallaxTest, function (index, el) {

        var tween = new TimelineMax()
            .add([
                TweenMax.fromTo('#parallax-test' + index + ' .layer--z-1', 1, {scale: 1.05, y: 200}, {
                    y: 225,
                    scale: 1,
                    ease: Linear.easeNone
                }),
                TweenMax.fromTo('#parallax-test' + index + ' .layer--z-2', 1, {y: 150}, {
                    y: 175,
                    ease: Linear.easeNone
                })
            ]);

        // build scene
        var scene = new ScrollMagic.Scene({triggerElement: '#parallax-test' + index, duration: $(window).height()})
            .setTween(tween)
            .addIndicators()
            .addTo(controller);
    });

    /**
     * Modify controller behavior
     */
    controller.scrollTo(function (newpos) {
        TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
    });

    //  bind scroll to anchor links
    $(document).on("click", ".nav a[href^='#']", function (e) {
        var id = $(this).attr("href");
        if ($(id).length > 0) {
            e.preventDefault();

            // trigger scroll
            controller.scrollTo(id);

            // if supported by the browser we can even update the URL.
            if (window.history && window.history.pushState) {
                history.pushState("", document.title, id);
            }
        }
    });
});
