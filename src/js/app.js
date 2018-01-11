import Slider from './vendors/slider.js';
import Scroll from './vendors/scroll.js';
import imagesLoaded from 'imagesloaded';
import {TweenLite, TimelineMax} from 'gsap';
import Barba from 'barba.js';

class App {
    constructor() {

        this.slider = Object.assign({});

        this.archive = Object.assign({
            wrapper: document.getElementsByClassName('archive__scroll'),
            nav: document.getElementsByClassName('nav')
        });

        this.DOM = {};
        this.home = null;
        this.profile = null;

        App._noiseCanvas(.1);
        this._init();
    }

    _init() {
        this.DOM = Barba.Pjax.Dom;
        this.DOM.containerClass = 'scene__container';
        this.DOM.wrapperId = 'scene__wrapper';

        this.home = Barba.BaseView.extend({
            namespace: "home",
            onEnter: function () {
                this._constructor()
            },
            onEnterCompleted: function () {
                this.start()
            },
            onLeave: function () {
                this.slideshow.destroy()
            },
            slider: {
                blocks: 0,
                container: 0,
                progress: 0,
            },
            slideshow: 0,
            loadedCount: 0,
            imagesToLoad: 0,
            loadingProgress: 0,
            imgLoad: 0,
            progressTl: 0,
            preloader: {
                container: 0,
                progress: 0,
                txt: 0,
                perc: 0,
                index: 0,
                bar: 0,
            },
            _constructor() {
                this._bind();
                this.slider.blocks = document.getElementsByClassName('block');
                this.slider.container = document.getElementsByClassName('block__container');
                this.slider.progress = document.getElementsByClassName('bar');
                this.preloader.container = document.getElementById('preloader');
                this.preloader.progress = document.getElementsByClassName('progress-bar');
                this.preloader.txt = document.getElementsByClassName('txt');
                this.preloader.perc = document.getElementsByClassName('txt-perc');
                this.preloader.index = document.getElementsByClassName('txt-index');
                this.preloader.bar = document.getElementsByClassName('progress-bar')[0].childNodes[0];
                this.imagesToLoad = document.getElementsByTagName('img').length;
            },
            start() {
                this.initSlider();
                this.initLoader();
            },
            _bind() {
                this._progressUpdate = this._progressUpdate.bind(this);
                this._loadComplete = this._loadComplete.bind(this);
            },
            initSlider() {
                if (this.slider.blocks[0] && this.slider.container[0] && this.slider.progress[0]) {
                    this.slideshow = new Slider({
                        blocks: this.slider.blocks,
                        container: this.slider.container,
                        progress: this.slider.progress,
                        isAnimated: true
                    });
                }
            },
            initLoader() {

                this.progressTl = new TimelineMax({
                    paused: true,
                    onUpdate: this._progressUpdate,
                    onComplete: this._loadComplete
                });

                this.progressTl
                    .to(this.preloader.bar, 1, {width: '100%', ease: Linear.easeNone});

                if (this.imagesToLoad) {
                    this.imgLoad = new imagesLoaded(document.getElementsByTagName('img'), {
                        background: true
                    });

                    this.imgLoad.on('progress', (instance, image) => {
                        this._loadProgress();
                    });

                    this.preloader.index[0].innerText = this.imagesToLoad;

                } else {

                    this.progressTl.play();

                }
            },
            _loadProgress(imgLoad, image) {

                //one more image has been loaded
                this.loadedCount++;
                this.loadingProgress = (this.loadedCount / this.imagesToLoad);

                // GSAP tween of our progress bar timeline
                TweenLite.to(this.progressTl, 0.7, {progress: this.loadingProgress, ease: Linear.easeNone});
            },
            _progressUpdate() {
                this.loadingProgress = Math.round(this.progressTl.progress() * 100);
                if (this.imagesToLoad) {
                    this.preloader.perc[0].innerText = this.loadedCount + ' — ';
                }
            },
            _loadComplete() {
                let completeTl = new TimelineMax();
                completeTl
                    .set([document.querySelector('.page'), document.querySelectorAll('.nav'), document.querySelector('.progress')], {autoAlpha: 1})
                    .to(this.preloader.txt, .25, {y: -50, autoAlpha: 0})
                    .to(this.preloader.container, .5, {y: '-100%'})
                    .from(document.querySelectorAll('.el-from-top:not(span)'), .25, {y: '-100%', autoAlpha: 0})
                    .from(document.querySelectorAll('.el-from-bottom:not(span)'), .25, {y: '100%', autoAlpha: 0})
                    .from(document.querySelector('.breadcrumb'), .5, {y: '50%', autoAlpha: 0})
                    .from(document.querySelectorAll('.block'), .5, {y: '100%', autoAlpha: 0}, '-=.25')
                    .from(document.querySelectorAll('.img__txt .el-from-right'), .35, {x: '50%', autoAlpha: 0})
                    .from(document.querySelectorAll('.img__txt .el-from-top'), .35, {y: '-50%', autoAlpha: 0}, '-=.35');
                return completeTl;
            }
        });
        this.profile = Barba.BaseView.extend({
            namespace: "profile",
            onEnter: function () {
                this._constructor()
            },
            onEnterCompleted: function () {
                this.start()
            },
            onLeave: function () {
                this.cs.destroy()
            },
            scroll: {
                wrapper: 0,
                nav: 0,
            },
            startTl: new TimelineMax(),
            cs: 0,
            _constructor() {
                this.scroll = Object.assign({
                    wrapper: document.getElementsByClassName('page__scroll'),
                    nav: document.getElementsByClassName('nav')
                });
                this.startTl
                    .set([document.querySelector('.page'), document.querySelector('.nav')], {autoAlpha: 1})

            },
            start() {
                if (this.scroll.wrapper[0]) {
                    this.cs = new Scroll({
                        wrapper: this.scroll.wrapper,
                        nav: this.scroll.nav
                    });
                }
                this.startTl
                    .from(document.querySelector('.breadcrumb'), .5, {y: '50%', autoAlpha: 0})
                    .from(document.querySelectorAll('.el-from-bottom'), .5, {y: '100%', autoAlpha: 0}, '-=.25')
                    .from(document.querySelectorAll('.social'), .35, {x: '50%', autoAlpha: 0})
                    .from(document.querySelectorAll('.develop'), .35, {y: '-50%', autoAlpha: 0}, '-=.35');
            },
        });

        this.home.init();
        this.profile.init();

        let FadeTransition = Barba.BaseTransition.extend({
            start() {
                Promise
                    .all([this.newContainerLoading, this.fadeOut()])
                    .then(this.fadeIn.bind(this));
            },

            fadeOut: function () {
                let deferred = Barba.Utils.deferred();
                let exitTl = new TimelineMax({
                    onComplete: () => {
                        deferred.resolve()
                    }
                });

                exitTl
                    .to(document.querySelector('.breadcrumb'), .5, {y: '50%', autoAlpha: 0})
                    .to(document.querySelectorAll('.block'), .5, {y: '100%', autoAlpha: 0}, '-=.25')
                    .to(document.querySelectorAll('.img__txt .el-from-right'), .35, {x: '50%', autoAlpha: 0})
                    .to(document.querySelectorAll('.img__txt .el-from-top'), .35, {y: '-50%', autoAlpha: 0}, '-=.35');
                return exitTl, deferred.promise;
            },

            fadeIn() {
                let enterTl = new TimelineMax({
                    onComplete: () => {
                        this.done()
                    }
                });

                enterTl
                    .to(document.body, .5, {backgroundColor: '#fff'})
                    .set(document.body, {className: '+=negative'})
                    .set(this.oldContainer, {autoAlpha: 0})
                    .set(this.newContainer, {autoAlpha: 1})
                    .set([this.newContainer.querySelector('.page'), this.newContainer.querySelector('.nav')], {autoAlpha: 1})

            }

        });

        Barba.Pjax.getTransition = function () {
            return FadeTransition;
        };

        Barba.Pjax.start();
    }

    static _noiseCanvas(op) {

        let canvas = document.getElementById('noise'),
            ctx = canvas.getContext('2d'),
            x, y,
            r, g, b,
            opacity = op || .2;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext("2d");

        for (x = 0; x < canvas.width; x++) {
            for (y = 0; y < canvas.height; y++) {

                r = Math.floor(Math.random() * 80);
                g = Math.floor(Math.random() * 80);
                b = Math.floor(Math.random() * 80);

                ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

let app = new App();