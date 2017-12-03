import anime from 'animejs';

export default class VerticalSlideshow {

    constructor(wrapper) {
        this.wrapper = wrapper;
        this.settings = {
            animation: {
                slides: {
                    duration: 600,
                    easing: 'easeOutQuint'
                },
                shape: {
                    duration: 300,
                    easing: {in: 'easeOutQuint', out: 'easeOutQuad'}
                }
            },
            frameFill: '#f1f1f1'
        };

        this._init();
    }

    _debounce(func, wait, immediate) {
        let timeout;
        return function () {
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    _init() {
        this.slides = Array.from(this.wrapper.querySelectorAll('.slides--images > .slide'));
        this.titles = this.wrapper.querySelector('.slides--titles');
        this.titlesPosY = (window.innerHeight / 2);
        this.titles.style["transform"] = "translateY(" + this.titlesPosY + "px)";
        this.titlesSlides = Array.from(this.titles.querySelectorAll('.slide'));
        this.slidesTotal = this.slides.length;
        this.nav = this.wrapper.querySelector('.slidenav');
        this.ctrl = {};
        this.ctrl.next = this.nav.querySelector('.slidenav__item--next');
        this.ctrl.prev = this.nav.querySelector('.slidenav__item--prev');
        this.current = 0;
        this._initEvents();
    }

    _initEvents() {
        this.ctrl.next.addEventListener('click', () => this._navigate('next'));
        this.ctrl.prev.addEventListener('click', () => this._navigate('prev'));

        document.addEventListener('keydown', (ev) => {
            const keyCode = ev.keyCode || ev.which;
            if (keyCode === 38) {
                this._navigate('prev');
            }
            else if (keyCode === 40) {
                this._navigate('next');
            }
        });
    }

    _navigate(dir = 'next') {
        const animateSlides = () => {
            return new Promise((resolve, reject) => {
                    const currentSlide = this.slides[this.current];
                    anime({
                        targets: currentSlide,
                        duration: this.settings.animation.slides.duration,
                        easing: this.settings.animation.slides.easing,
                        translateY: dir === 'next' ? -1 * window.innerHeight : window.innerHeight,
                        complete: () => {
                            currentSlide.classList.remove('slide--current');
                            resolve();
                        }
                    });

                    const currentTitleSlide = this.titlesSlides[this.current];
                    this.titlesPosY = dir === 'next' ?
                        this.current < this.slidesTotal - 1 ? this.titlesPosY - 100 : (window.innerHeight / 2) :
                        this.current > 0 ? this.titlesPosY + 100 : this.titlesPosY - ((this.slidesTotal - 1) * 100);

                    anime({
                        targets: this.titles,
                        duration: this.settings.animation.slides.duration,
                        easing: this.settings.animation.slides.easing,
                        delay: (t, i, total) => dir === 'next' ? i * 100 : (total - i - 1) * 100,
                        translateY: this.titlesPosY,
                        complete: () => {
                            currentTitleSlide.classList.remove('slide--current');
                            resolve();
                        }
                    });

                    anime({
                        targets: currentTitleSlide.children,
                        duration: this.settings.animation.slides.duration,
                        easing: this.settings.animation.slides.easing,
                        opacity: [1, .5],
                        fontSize: ["7rem", "5rem"]
                    });

                    this.current = dir === 'next' ?
                        this.current < this.slidesTotal - 1 ? this.current + 1 : 0 :
                        this.current > 0 ? this.current - 1 : this.slidesTotal - 1;

                    const newSlide = this.slides[this.current];
                    newSlide.classList.add('slide--current');
                    anime({
                        targets: newSlide,
                        duration: this.settings.animation.slides.duration,
                        easing: this.settings.animation.slides.easing,
                        translateY: [dir === 'next' ? window.innerHeight : -1 * window.innerHeight, 0]
                    });

                    const newSlideImg = newSlide.querySelector('.slide__img');
                    anime.remove(newSlideImg);
                    anime({
                        targets: newSlideImg,
                        duration: this.settings.animation.slides.duration * 4,
                        easing: this.settings.animation.slides.easing,
                        translateY: [dir === 'next' ? 200 : -200, 0]
                    });

                    const newTitleSlide = this.titlesSlides[this.current];
                    newTitleSlide.classList.add('slide--current');
                    anime({
                        targets: newTitleSlide.children,
                        duration: this.settings.animation.slides.duration * 2,
                        easing: this.settings.animation.slides.easing,
                        delay: (t, i, total) => dir === 'next' ? i * 100 + 100 : (total - i - 1) * 100 + 100,
                        fontSize: ["5rem", "7rem"],
                        opacity: [.5, 1]
                    });
                }
            );
        };

        animateSlides()
    }
}