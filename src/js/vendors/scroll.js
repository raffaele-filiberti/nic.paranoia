import {
    EventEmitter
} from 'events';
import VirtualScroll from 'virtual-scroll';
import raf from 'raf';

export default class Scroll extends EventEmitter {
    constructor(opts) {
        super();
        this._bind();

        this.options = Object.assign({
            wrapper: opts.wrapper,
            nav: opts.nav
        });

        this.vars = {
            scrollValue: 0,
            oldScrollValue: 0,
            scrollTarget: 0,
            spring: 0.1,
            direction: 0,
            speed: 0,
            speedTarget: 0,
            scrollHeight: 0
        };

        this.vs = new VirtualScroll();
        this.raf = raf;

        this._addEvents();
        this._setUI();
        this._onResize();
    }

    _bind() {
        this._update = this._update.bind(this);
        this._onResize = this._onResize.bind(this);
    }

    _addEvents() {
        this.vs.on(this._onScroll, this);
        this.raf(this._update);
        window.addEventListener('resize', this._onResize);
    }

    _removeEvents() {
        this.raf.cancel(this._update);
        this.raf(this._update);
        window.removeEventListener('resize', this._onResize);
    }

    _setUI() {
        Object.assign(this.options.wrapper[0].style, {
            position: 'absolute',
            top: window.innerWidth < 768 ? this.options.nav[0].clientHeight + 'px' : + 0,
            left: 0,
            'backface-visibilty': 'hidden',
            'will-change': 'transform',
        });
    }

    _onScroll(e) {
        this.vars.direction = e.deltaY > 0 ? 1 : -1;
        this.vars.scrollTarget += e.deltaY;
        this.vars.scrollTarget = Math.max((this.vars.scrollHeight) * -1, this.vars.scrollTarget);
        this.vars.scrollTarget = Math.min(0, this.vars.scrollTarget);
    }

    _update() {
        this.vars.scrollValue += (this.vars.scrollTarget - this.vars.scrollValue) * this.vars.spring;
        this.options.wrapper[0].style.transform = `translate3d(0, ${this.vars.scrollValue}px, 0)`;
        this.vars.oldScrollValue = this.vars.scrollValue;
        this.raf(this._update);
    }
    
    _onResize() {
        let height = this.options.wrapper[0].getBoundingClientRect().height - window.innerHeight;
        this.vars.scrollHeight = window.innerWidth < 768 ? height + this.options.nav[0].clientHeight : height;
    }

    destroy() {
        this._removeEvents();
    }
}