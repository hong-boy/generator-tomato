'use strict';

let util = {
    /**
     * 函数节流
     * （保证函数在delay时间段重复发送时，只被执行一次）
     * （第一次调用时不会立即执行）
     * @param fn
     * @param delay
     * @returns {Function}
     */
    debounce(fn, delay = 50) {
        var timer = null;
        return function (...args) {
            var context = this;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    },
    /**
     * 函数节流
     * （保证函数在threshold的间隔内只执行一次）
     * （第一次调用时会立即执行）
     * @param fn
     * @param threshold
     * @param scope 作用域
     */
    throttle(fn, threshold = 50, scope){
        let last, timer;
        return function (...args) {
            let now = Date.now();
            let ctx = scope || this;
            if (last && now < (last + threshold)) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    fn.apply(ctx, args);
                }, threshold);
            } else {
                last = now;
                fn.apply(ctx, args);
            }
        };
    },
    /**
     * 添加类名
     * https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
     * @param el
     * @param className
     */
    addClass(el, className){
        if (el.classList) {
            el.classList.add(className);
        } else if (!util.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    },
    /**
     * 判断是否包含指定类名
     * @param el
     * @param className
     */
    hasClass(el, className){
        return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
    },
    /**
     * 移除指定类名
     * @param el
     * @param className
     */
    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        }
    },
    css(el, styles) {
        for (var property in styles)
            el.style[property] = styles[property];
    },
    /**
     * 对象合并
     * 同jQuery.extend
     * @return {*|{}}
     */
    extend() {
        let options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {}, // 目标对象
            i = 1,
            length = arguments.length,
            deep = false;
        // 处理深度拷贝情况（第一个参数是boolean类型且为true）
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // 跳过第一个参数（是否深度拷贝）和第二个参数（目标对象）
            i = 2;
        }
        // 如果目标不是对象或函数，则初始化为空对象
        if (typeof target !== 'object' && typeof target !== 'function') {
            target = {};
        }
        // 如果只指定了一个参数，则使用jQuery自身作为目标对象
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // 如果对象中包含了数组或者其他对象，则使用递归进行拷贝
                    if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        // 处理数组
                        if (copyIsArray) {
                            copyIsArray = false;
                            // 如果目标对象不存在该数组，则创建一个空数组；
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }
                        // 从不改变原始对象，只做拷贝
                        target[name] = this.extend(deep, clone, copy);
                        // 不拷贝undefined值
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // 返回已经被修改的对象
        return target;
    },
    isPlainObject(value) {
        if (!(value != null && typeof value === 'object') ||
            (Object.prototype.toString.call(value) !== '[object Object]')) {
            return false;
        }
        let proto = Object.getPrototypeOf(Object(value));
        if (proto == null) {
            return true;
        }
        var Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return typeof Ctor === 'function' && Ctor instanceof Ctor &&
            Function.prototype.toString.call(Ctor) == Function.prototype.toString.call(Object);
    },
};

let DEFAULTS = {
    visible: false, // 控制对话框显示或者隐藏
    timeout: 180000, // loading等待超时时长，单位ms
    background: 'inherit', // loading-mask背景颜色
};


function _initMask(options){
    let mask = document.createElement('div');
    util.addClass(mask, 'loading-mask');
    let pluse = document.createElement('div');
    util.addClass(pluse, 'loading');
    util.addClass(pluse, 'pluse');

    let child1 = document.createElement('div');
    let child2 = document.createElement('div');
    let child3 = document.createElement('div');

    pluse.appendChild(child1);
    pluse.appendChild(child2);
    pluse.appendChild(child3);

    mask.appendChild(pluse);

    // 自定义mask背景
    (options.background !== 'inherit') && util.css(mask, {background: options.background});
    return mask;
}

export default class Loading {
    constructor(el, options){
        this.options = util.extend(true, {}, DEFAULTS, options);
        this.mask = _initMask(this.options);
        this.el = typeof el === 'string' ? document.querySelector(el)||document.querySelector('body') : el;
        this._timer = null;
        this.init();
    }
    static service(el, options){
        el = typeof el === 'string' ? document.querySelector(el)||document.querySelector('body') : el;
        let inst = el.__instofLoading;
        if(!inst){
            inst = el.__instofLoading = new Loading(el, options);
        }
        return inst;
    }
    static destroy(inst){
        if(inst){
            inst.destroy();
            inst.el.__instofLoading = null;
        }
    }
    init(){
        let el = this.el;
        let position = el.style.position;
        if(!position || position === 'static' || typeof position === 'undefiend'){
            el.style.position = 'relative';
        }
        if(this.options.visible){
            el.appendChild(this.mask);
            clearTimeout(this._timer);
            this._timer = this.options.timeout && setTimeout(()=>{
                this.destroy();
            }, this.options.timeout);
        }
    }
    update(options){
        this.destroy();
        this.options = util.extend(true, {}, this.options, options);
        if(this.options.visible){
            this.init();
        }
    }
    destroy(){
        clearTimeout(this._timer);
        this.mask && this.mask.parentNode && this.el.removeChild(this.mask);
    }
}
