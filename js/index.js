$(document).ready(function () {

    var $window = $(window);
    var controller = new ScrollMagic.Controller();
    var parallaxTest = $('[data-parallax]');

    if ($window.width() >= 768) {
        $.each(parallaxTest, function () {


            var tween = new TimelineMax()
                .add([
                    TweenMax.fromTo($(this).find('.parallax--background'), 1, {
                        scale: 1.2,
                        y: -200
                    }, {
                        y: 0,
                        ease: Linear.easeNone
                    }),
                    TweenMax.fromTo($(this).find('.parallax--text'), 1, {y: 150}, {
                        y: 0,
                        ease: Linear.easeNone
                    }),
                    TweenMax.fromTo($(this).find('.parallax--img'), 1, {y: -100}, {
                        y: 200,
                        ease: Linear.easeNone
                    })
                ]);

            console.log($(this));

            var scene = new ScrollMagic.Scene({triggerElement: this, triggerHook: 1, duration: "200%"})
                .setTween(tween)
                .addTo(controller);

        });

    }

    //  Smooth scroll
    var scrollTime = 2;
    var scrollDistance = 300;

    $window.on("mousewheel DOMMouseScroll", function (event) {

        event.preventDefault();

        var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
        var scrollTop = $window.scrollTop();
        var finalScroll = scrollTop - parseInt(delta * scrollDistance);

        TweenMax.to($window, scrollTime, {
            scrollTo: {y: finalScroll, autoKill: true},
            ease: Power1.easeOut,
            overwrite: 5
        });

    });

    controller.scrollTo(function (newpos) {
        TweenMax.to(window, 0.75, {scrollTo: {y: newpos}});
    });


    //  bind scroll to anchor links
    var navLinks = $('a.nav--link[href^="#"]');
    $.each(navLinks, function (e) {
        console.log($(this).attr("href").toString());
        new ScrollMagic.Scene({triggerElement: $(this).attr("href"), duration: $('section').height()})
            .setClassToggle("a.nav--link[href='" + $(this).attr("href") + "']", 'active')
            .addTo(controller);
    });

    $(document).on("click", "a.nav--link[href^='#']", function (e) {
        var id = $(this).attr("href");
        $(this).parent().parent().find('.active').removeClass('active');
        $(this).addClass('active');
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

    //counter
    new ScrollMagic.Scene({triggerElement: document.querySelector('[data-animation="counter"]'), triggerHook: 1})
        .on('enter', function () {
            $('.count').each(function () {
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: $(this).data('duration'),
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
        })
        .addTo(controller);

    // init Masonry
    var $grid = $('.grid').masonry({
        // set itemSelector so .grid-sizer is not used in layout
        itemSelector: '.grid-item',
        // use element for option
        columnWidth: '.grid-sizer',
        percentPosition: true
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });


    // navigation
    $('.nav--burger').on('click', function () {
        $(this).toggleClass('active');
        $(this).parent().find('.nav--collapse').slideToggle(250);
    });
});
