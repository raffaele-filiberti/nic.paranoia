import {
    EventEmitter
} from 'events';
import VirtualScroll from 'virtual-scroll';
import raf from 'raf';
import transform from 'prefix';
import {TweenLite, TimelineMax} from 'gsap';


export default class Slider extends EventEmitter {
    constructor(opts) {
        super();
        this._bind();

        this.options = Object.assign({
            container: opts.container,
            blocks: opts.blocks,
            progress: opts.progress,
            isAnimated: true,
            spring: opts.spring || 0.1,
            skewReducer: opts.skewReducer || 20,
            skewLimit: opts.skewLimit || 30
        }, opts);

        this.vars = {
            scrollValue: 0,
            oldScrollValue: 0,
            scrollTarget: 0,
            scrollLeft: 0,
            scrollRight: 0,
            spring: this.options.spring,
            direction: 0,
            speed: 0,
            speedTarget: 0,
        };

        this.openModalTl = new TimelineMax({
            paused: true,
            onStart:() => {
                this.options.isAnimated = false;
            },
            onComplete: () => {
                this.options.isAnimated = true;
            }
        });

        this.openModalTl
            .to(document.querySelectorAll('.img__txt .el-from-right'), .25, {x: '50%', autoAlpha: 0})
            .to(document.querySelectorAll('.img__txt .el-from-top'), .25, {y: '-50%', autoAlpha: 0})
            .fromTo(document.querySelectorAll('img'), .5, {scale: 1, force3D:true}, {scale: 1.5, force3D:true});

        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'slidee');

        this.vs = new VirtualScroll();
        this.raf = raf;

        this.transform = transform('transform');

        this._setUI();
        this._addEvents();
        this._onResize();
    }

    //private methods
    _bind() {
        this._update = this._update.bind(this);
        this._toggleModal = this._toggleModal.bind(this);
        this._onResize = this._onResize.bind(this);
    }

    _addEvents() {
        this.vs.on(this._onScroll, this);
        this.raf(this._update);
        Array.prototype.forEach.call(this.options.blocks, block => {
            block.addEventListener('click', this._toggleModal);
        });
        window.addEventListener('resize', this._onResize);
    }

    _removeEvents() {
        this.raf.cancel(this._update);
        this.raf(this._update);
        window.removeEventListener('resize', this._onResize);
    }

    _toggleModal(e) {
        e.preventDefault();

        if (e.target.tagName.toLowerCase() === 'img' && window.innerWidth > 767) {
            document.body.classList.contains('detail') ? this.openModalTl.reverse() : this.openModalTl.play();
            document.body.classList.toggle('detail');
        }
    }

    _setUI() {
        Object.assign(this.wrapper.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            'backface-visibilty': 'hidden',
            'will-change': 'transform',
        });

        Object.assign(this.options.container[0].style, {
            'white-space': 'nowrap',
            position: 'relative',
        });

        Array.prototype.forEach.call(this.options.blocks, block => {
            block.style.display = 'inline-block';
            block.style.width = window.innerWidth + 'px';
            block.style.height = window.innerHeight + 'px';
            this.options.container[0].replaceChild(this.wrapper, block);
            this.wrapper.appendChild(block);
        });

        this.options.container[0].appendChild(this.wrapper);
        this.options.progress[0].style[this.transform] = `translate3d( -100%,0, 0)`;

    }

    _onScroll(e) {
        this.vars.direction = e.deltaY > 0 ? 1 : -1;
        this.vars.scrollTarget += e.deltaY * -1;
        this.vars.scrollTarget = Math.round(Math.max(this.vars.scrollLeft, Math.min(this.vars.scrollTarget, this.vars.scrollRight)));
    }

    _update() {
        if (this.options.isAnimated) {
            this.vars.scrollValue += (this.vars.scrollTarget - this.vars.scrollValue) * this.vars.spring;
            let delta = this.vars.scrollTarget - this.vars.scrollValue;

            let skew = delta / this.options.skewReducer;
            this.vars.speed = Slider._clamp(-skew, -this.options.skewLimit, this.options.skewLimit);

            this.wrapper.style[this.transform] = `translate3d(-${this.vars.scrollValue}px, 0 ,0) skewX(${this.vars.speed}deg)`;
            this.options.progress[0].style[this.transform] = `translate3d(-${100 - (this.vars.scrollValue * 100) / (this.wrapper.getBoundingClientRect().width - window.innerWidth)}%,0 ,0) skewX(${this.vars.speed}deg)`;
        }
        this.vars.oldScrollValue = this.vars.scrollValue;
        this.raf(this._update);
    }

    static _clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    _onResize() {
        this.vars.scrollLeft = 0;
        this.vars.scrollRight = this.wrapper.getBoundingClientRect().width - window.innerWidth;
    }

    destroy() {
        this._removeEvents();
    }
}
