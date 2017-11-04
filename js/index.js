$(document).ready(function () {

    var $window = $(window);
    var controller = new ScrollMagic.Controller();
    var parallaxTest = $('[data-parallax]');

    if ($window.width() >= 768) {
        $.each(parallaxTest, function () {


            var tween = new TimelineMax()
                .add([
                    TweenMax.fromTo($(this).find('.parallax--background'), 1, {
                        y: -225
                    }, {
                        y: 0,
                        ease: Linear.easeNone
                    }),
                    TweenMax.fromTo($(this).find('.parallax--text'), 1, {y: 50}, {
                        y: -250,
                        ease: Linear.easeNone
                    }),
                    TweenMax.fromTo($(this).find('.parallax--img'), 1, {y: -100}, {
                        y: 200,
                        ease: Linear.easeNone
                    })
                ]);

            var scene = new ScrollMagic.Scene({triggerElement: this, triggerHook: 1, duration: "200%"})
                .setTween(tween)
                .addTo(controller);

        });

    }

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
        if ($window.width() >= 768) {
            TweenMax.to(window, 0.75, {scrollTo: {y: newpos}});
        } else {
            TweenMax.to(window, 0.75, {scrollTo: {y: newpos - $('.nav').height()}});
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
    $('.nav__burger').on('click', function () {
        $(this).toggleClass('active');
        $(this).parent().find('.nav--collapse').slideToggle(250);
        $('.nav__menu--full').toggleClass('active');
    });

    //  Section swipe
    // get all slides
    var slides = document.querySelectorAll("section.panel");

    // create scene for every slide
    for (var i = 0; i < slides.length; i++) {
        new ScrollMagic.Scene({
            triggerElement: slides[i],
            triggerHook: 'onLeave'
        })
            .setPin(slides[i])
            .addIndicators() // add indicators (requires plugin)
            .addTo(controller);
    }

    var navbar = $('#nav'),
        home = $('#hero');

    home.css('marginTop', navbar.outerHeight());

    var videoBackground = $('#intro').data('vide');

    videoBackground.getVideoObject().play();

    $(window).on('resize', function () {
        videoBackground.resize();
    });
});
