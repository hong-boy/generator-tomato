'use strict';
(function (undefined) {
    let Vuebar2 = {};
    Vuebar2.install = function (Vue, options) {
        const DEFAULTS = {
            threshold4scroll: 50, // 滚动条滚动的频率
            preventParentScroll: false, // 是否阻止父元素滚动
            onScroll: null, // 滚动条滚动时的回调
        };

        const ENUM_SCROLL_CLAZZ = {
            WRAPPER: 'vb-scroll-wrapper',
            CONTENT: 'vb-content',
            DARGGER_X: 'vb-dragger-x',
            DARGGER_Y: 'vb-dragger-y',
            DARGGER_HOVER: 'vb-dragger-hover',
            DARGGER_SLIDER_X: 'dragger-slider-x',
            DARGGER_SLIDER_Y: 'dragger-slider-y',
            SCROLLING: 'vb-scrolling',
        };

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
            /**
             * 计算浏览器滚动条宽/高
             * @param target
             * @private
             */
            calcScrollbarSize(){
                let inner = document.createElement('div');
                inner.style.width = '100%';
                inner.style.height = 'calc(100%)';
                let outer = document.createElement('div');
                outer.style.position = 'absolute';
                outer.style.left = 0;
                outer.style.top = 0;
                outer.style.width = '100px';
                outer.style.height = '100px';
                outer.style.overflow = 'hidden';

                let body = document.querySelector('body');
                body.appendChild(outer);
                outer.appendChild(inner);

                let fullWidth = inner.offsetWidth;
                let fullHeight = inner.offsetHeight;
                outer.style.overflow = 'scroll';

                let result = {
                    width: fullWidth - inner.offsetWidth,
                    height: fullHeight - inner.offsetHeight
                };

                body.removeChild(outer);

                return result;
            },
            /**
             * 计算目标元素的比例（用于确定dragger的尺寸）
             * clientHeight/scrollHeight
             * @param content
             * @returns {{h: number, w: number}}
             */
            calcRatio4VisibleArea(content){
                let ratio4Height = content.clientHeight / content.scrollHeight;
                let ratio4Width = content.clientWidth / content.scrollWidth;
                return {
                    h: ratio4Height,
                    w: ratio4Width
                };
            },
            /**
             * 创建stateBean对象（用于存储监听器）
             * @param el
             */
            createStateBean(el){
                let state = {};
                state.wrapper = el.parentNode.parentNode;
                state.options = {};
                state.eventHandlers = {
                    scrollHandler: null,
                    resizeHandler: null,
                    mousedown4sliderY: null,
                    mousemove4sliderY: null,
                    mouseup4sliderY: null,
                    mousedown4sliderX: null,
                    mousemove4sliderX: null,
                    mouseup4sliderX: null,
                    mutationObserver: null,
                    wheelHandler: null,
                };
                el.__vuebar2 = state;
                return el.__vuebar2;
            },
            /**
             * 获取stateBean
             * @param el
             */
            getStateBean(el){
                return el.__vuebar2;
            },
            /**
             * 删除stateBean
             * @param el
             */
            deleteStateBean(el){
                delete el.__vuebar2;
            },
            /**
             * 创建一个DOM突变观察者
             * @param target
             * @param fn
             * @param options
             * @param threshold
             * @returns {*}
             */
            initMutationObsever(target, fn, options = {
                childList: true,
                subtree: true,
                characterData: true
            }, threshold = 50){
                if (typeof MutationObserver === 'undefined') {
                    return false;
                }
                let observer = new MutationObserver(util.throttle(function (mutations) {
                    fn.call(null, target);
                }, threshold));
                observer.observe(target, options);

                return observer;
            }
        };

        let EventHandler = {
            /**
             * 监听vb-content元素滚动事件
             * @param target
             * @param threshold
             * @returns {*}
             */
            scroll(target, threshold){
                let removeClass4Scrolling = util.debounce(function (wrapper) {
                    util.removeClass(wrapper, ENUM_SCROLL_CLAZZ.SCROLLING);
                });
                return util.throttle(function (e) {
                    // 计算draggerX和draggerY
                    _updateDragger(target);
                    // 添加.vb-scrolling样式
                    let wrapper = target.parentNode.parentNode;
                    util.addClass(wrapper, ENUM_SCROLL_CLAZZ.SCROLLING);
                    removeClass4Scrolling(wrapper);

                    // onScroll回调函数
                    let stateBean = util.getStateBean(target);
                    let onScrollFn = stateBean.options.onScroll;
                    if (typeof onScrollFn === 'function') {
                        onScrollFn(e);
                    }

                }, threshold);
            },
            /**
             * 监听window.resize事件
             * @param target
             * @returns {*|Function}
             */
            resize(target){
                return util.debounce(function (e) {
                    // 计算draggerX和draggerY
                    _updateDragger(target);
                });
            },
            /**
             * 监听content元素上的wheel事件
             * @param target
             * @returns {*|Function}
             */
            wheel(target){
                return util.throttle(function (e) {
                    // 判断是否已经滚动到最边缘
                    let content = target.parentNode;
                    let ratio = util.calcRatio4VisibleArea(content);
                    if (ratio.h >= 1) {
                        return false;
                    }
                    let scrollTop = content.scrollTop;
                    if (e.deltaY < 0 && scrollTop <= 0) {
                        // 向上滚动 - 鼠标中键
                        e.preventDefault();
                        return;
                    }
                    let distance = content.scrollHeight - content.clientHeight;
                    if (e.deltaY > 0 && scrollTop >= distance) {
                        // 向下滚动 - 鼠标中键
                        e.preventDefault();

                    }
                });
            },
            /**
             * 监听鼠标释放事件 - .dragger-slider-y
             * @param target
             * @returns {*}
             */
            mouseup4sliderY(target){
                return function (e) {
                    let stateBean = util.getStateBean(target);
                    // 移除监听器
                    document.removeEventListener('mousemove', stateBean.eventHandlers.mousemove4sliderY, false);
                    document.removeEventListener('mouseup', stateBean.eventHandlers.mouseup4sliderY, false);
                    // 移除.hover类名
                    let wrapper = target.parentNode.parentNode;
                    let dragger4y = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_Y}`);
                    util.removeClass(dragger4y, ENUM_SCROLL_CLAZZ.DARGGER_HOVER);
                };
            },
            /**
             * 监听鼠标拖动事件 - .dragger-slider-y
             * @param target
             * @param originalEvent
             * @param relativeDistance
             * @param threshold
             * @returns {*}
             */
            mousemove4sliderY(target, originalEvent, relativeDistance, threshold = 10){
                return util.throttle(function (e) {
                    let content = target.parentNode;
                    let slider4y = originalEvent.target;
                    let rect4DraggerY = slider4y.parentNode.getBoundingClientRect();
                    let rect4SliderY = slider4y.getBoundingClientRect();
                    let origPageY = originalEvent.pageY;
                    let currPageY = e.pageY;
                    let ratio = util.calcRatio4VisibleArea(content);

                    let pos = 0;
                    if (currPageY < origPageY) {
                        // 向上
                        pos = currPageY - relativeDistance;
                        // pos = rect4SliderY.top + (currPageY - origPageY);
                        pos = Math.max(pos, rect4DraggerY.top);
                        // slider4y.style.transform = `translateY(${pos}px)`;
                        // slider4y.style.top = `${pos}px`;
                        content.scrollTop = pos / ratio.h;
                        return;
                    }
                    if (currPageY > origPageY) {
                        // 向下
                        pos = currPageY - relativeDistance;
                        // pos = rect4SliderY.top + (currPageY - origPageY);
                        let bottom = pos + rect4SliderY.height;
                        pos = bottom > rect4DraggerY.bottom ? (pos - (bottom - rect4DraggerY.bottom)) : pos;
                        // slider4y.style.transform = `translateY(${pos}px)`;
                        // slider4y.style.top = `${pos}px`;
                        content.scrollTop = pos / ratio.h;

                    }
                }, threshold);
            },
            /**
             * 监听鼠标按下事件 - .dragger-slider-y
             * @param target
             * @returns {*}
             */
            mousedown4sliderY(target){
                // 竖直滚动条
                return function (e) {
                    // 只监听鼠标左键
                    if (e.which != 1) {
                        return false;
                    }
                    let stateBean = util.getStateBean(target);
                    let distance = e.pageY - e.target.getBoundingClientRect().top;

                    stateBean.eventHandlers.mousemove4sliderY = EventHandler.mousemove4sliderY(target, e, distance);
                    stateBean.eventHandlers.mouseup4sliderY = EventHandler.mouseup4sliderY(target);
                    // 添加事件监听器
                    document.addEventListener('mousemove', stateBean.eventHandlers.mousemove4sliderY, false);
                    document.addEventListener('mouseup', stateBean.eventHandlers.mouseup4sliderY, false);
                    // 添加.hover类名
                    util.addClass(e.target.parentNode, ENUM_SCROLL_CLAZZ.DARGGER_HOVER);
                };
            },
            /**
             * 监听鼠标释放事件 - .dragger-slider-x
             * @param target
             * @returns {*}
             */
            mouseup4sliderX(target){
                return function (e) {
                    let stateBean = util.getStateBean(target);
                    // 移除监听器
                    document.removeEventListener('mousemove', stateBean.eventHandlers.mousemove4sliderX, false);
                    document.removeEventListener('mouseup', stateBean.eventHandlers.mouseup4sliderX, false);
                    // 移除.hover类名
                    let wrapper = target.parentNode.parentNode;
                    let dragger4x = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_X}`);
                    util.removeClass(dragger4x, ENUM_SCROLL_CLAZZ.DARGGER_HOVER);
                };
            },
            /**
             * 监听鼠标拖动事件 - .dragger-slider-x
             * @param target
             * @param originalEvent
             * @param relativeDistance
             * @param threshold
             * @returns {*}
             */
            mousemove4sliderX(target, originalEvent, relativeDistance, threshold = 10){
                return util.throttle(function (e) {
                    let content = target.parentNode;
                    let slider4x = originalEvent.target;
                    let rect4DraggerX = slider4x.parentNode.getBoundingClientRect();
                    let rect4SliderX = slider4x.getBoundingClientRect();
                    let origPageX = originalEvent.pageX;
                    let currPageX = e.pageX;
                    let ratio = util.calcRatio4VisibleArea(content);

                    let pos = 0;
                    if (currPageX < origPageX) {
                        // 向左
                        pos = currPageX - relativeDistance;
                        pos = Math.max(pos, rect4DraggerX.left);
                        content.scrollLeft = pos / ratio.w;
                        return;
                    }
                    if (currPageX > origPageX) {
                        // 向右
                        pos = currPageX - relativeDistance;
                        let right = pos + rect4SliderX.width;
                        pos = right > rect4DraggerX.right ? (pos - (right - rect4DraggerX.right)) : pos;
                        content.scrollLeft = pos / ratio.w;

                    }
                }, threshold);
            },
            /**
             * 监听鼠标按下事件 - .dragger-slider-x
             * @param target
             * @returns {*}
             */
            mousedown4sliderX(target){
                // 竖直滚动条
                return function (e) {
                    // 只监听鼠标左键
                    if (e.which != 1) {
                        return false;
                    }
                    let stateBean = util.getStateBean(target);
                    let distance = e.pageX - e.target.getBoundingClientRect().left;

                    stateBean.eventHandlers.mousemove4sliderX = EventHandler.mousemove4sliderX(target, e, distance);
                    stateBean.eventHandlers.mouseup4sliderX = EventHandler.mouseup4sliderX(target);
                    // 添加事件监听器
                    document.addEventListener('mousemove', stateBean.eventHandlers.mousemove4sliderX, false);
                    document.addEventListener('mouseup', stateBean.eventHandlers.mouseup4sliderX, false);
                    // 添加.hover类名
                    util.addClass(e.target.parentNode, ENUM_SCROLL_CLAZZ.DARGGER_HOVER);
                };
            },
            /**
             * 处理el突变事件
             * @param target
             */
            mutationObserver(target){
                return function () {
                    // console.log(target, target.parentNode);
                    _updateDragger(target);
                };
            }
        };

        /**
         * 更新vb-dragger
         * @param target
         * @private
         */
        function _updateDragger(target) {
            let content = target.parentNode;
            let wrapper = content.parentNode;
            let dragger4x = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_X}`);
            let dragger4y = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_Y}`);
            let slider4x = dragger4x.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_X}`);
            let slider4y = dragger4y.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_Y}`);
            let rect = target.getBoundingClientRect();

            // 计算clientHeight/scrollHeight的比例
            let ratio = util.calcRatio4VisibleArea(content);

            // 横向滚动条
            if (ratio.w >= 1) {
                dragger4x.style.display = 'none';
                slider4x.style.width = 0;
            } else {
                dragger4x.style.display = 'block';
                slider4x.style.width = `${parseInt(content.clientWidth * ratio.w)}px`;
                // slider4x.style.left = `${Math.abs(parseInt(rect.left)) * ratio.w}px`;
                slider4x.style.transform = `translateX(${Math.abs(parseInt(rect.left)) * ratio.w}px)`;
            }

            // 纵向滚动条
            if (ratio.h >= 1) {
                dragger4y.style.display = 'none';
                slider4y.style.height = 0;
            } else {
                dragger4y.style.display = 'block';
                slider4y.style.height = `${parseInt(content.clientHeight * ratio.h)}px`;
                // slider4y.style.top = `${Math.abs(parseInt(rect.top)) * ratio.h}px`;
                slider4y.style.transform = `translateY(${Math.abs(parseInt(rect.top)) * ratio.h}px)`;
            }
        }

        /**
         * 包装目标元素
         * @param target
         * @private
         */
        function _wrapTargetElement(target) {
            let parentNode = target.parentNode;
            let wrapper = document.createElement('div');
            let content = document.createElement('div');
            let dragger4x = document.createElement('div');
            let slider4x = document.createElement('div');
            let dragger4y = document.createElement('div');
            let slider4y = document.createElement('div');

            util.addClass(wrapper, Date.now());
            util.addClass(wrapper, ENUM_SCROLL_CLAZZ.WRAPPER);
            util.addClass(content, ENUM_SCROLL_CLAZZ.CONTENT);
            util.addClass(dragger4x, ENUM_SCROLL_CLAZZ.DARGGER_X);
            util.addClass(dragger4y, ENUM_SCROLL_CLAZZ.DARGGER_Y);
            util.addClass(slider4x, ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_X);
            util.addClass(slider4y, ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_Y);

            wrapper.appendChild(content);
            wrapper.appendChild(dragger4x);
            wrapper.appendChild(dragger4y);
            dragger4y.appendChild(slider4y);
            dragger4x.appendChild(slider4x);

            parentNode.replaceChild(wrapper, target);

            content.appendChild(target);

            return wrapper;
        }

        // 初始化
        function initScrollbar(el, binding) {
            let target = el;
            // 获取滚动条尺寸
            let scrollbarSize = util.calcScrollbarSize(target);
            // 包装target元素
            let wrapper = _wrapTargetElement(target);
            // binding.modifiers
            let bindingModifiers = binding.modifiers;
            // binding.value
            let bindingValue = binding.value;
            let options = Object.assign({}, DEFAULTS, bindingValue, bindingModifiers);

            let content = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.CONTENT}`);
            let dragger4x = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_X}`);
            let dragger4y = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_Y}`);
            let slider4x = dragger4x.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_X}`);
            let slider4y = dragger4y.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_Y}`);
            content.style.marginBottom = `-${scrollbarSize.height}px`;
            content.style.marginRight = `-${scrollbarSize.width}px`;
            content.style.maxHeight = `calc(100vh + ${scrollbarSize.height}px)`;

            // 添加监听器
            let stateBean = util.createStateBean(el);
            stateBean.options = options;
            stateBean.eventHandlers.scrollHandler = EventHandler.scroll(target, options.threshold4scroll);
            stateBean.eventHandlers.resizeHandler = EventHandler.resize(target);
            stateBean.eventHandlers.mousedown4sliderY = EventHandler.mousedown4sliderY(target);
            stateBean.eventHandlers.mousedown4sliderX = EventHandler.mousedown4sliderX(target);
            stateBean.eventHandlers.wheelHandler = EventHandler.wheel(target);
            // MutationObserver事件
            stateBean.eventHandlers.mutationObserver = util.initMutationObsever(target, EventHandler.mutationObserver(target));

            // 滚动事件
            content.addEventListener('scroll', stateBean.eventHandlers.scrollHandler, false);
            // resize事件
            window.addEventListener('resize', stateBean.eventHandlers.resizeHandler, false);
            // 滚动条拖动事件
            slider4y.addEventListener('mousedown', stateBean.eventHandlers.mousedown4sliderY, false);
            slider4x.addEventListener('mousedown', stateBean.eventHandlers.mousedown4sliderX, false);
            // wheel事件
            options.preventParentScroll && content.addEventListener('wheel', stateBean.eventHandlers.wheelHandler, false);

            updateScrollbar(el);
        }

        // 更新
        function updateScrollbar(el) {
            _updateDragger(el);
        }

        // 销毁
        function destroy(el) {
            let stateBean = util.getStateBean(el);
            let wrapper = stateBean.wrapper;
            let content = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.CONTENT}`);
            let dragger4x = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_X}`);
            let dragger4y = wrapper.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_Y}`);
            let slider4x = dragger4x.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_X}`);
            let slider4y = dragger4y.querySelector(`.${ENUM_SCROLL_CLAZZ.DARGGER_SLIDER_Y}`);
            // 移除监听器
            stateBean.eventHandlers.mutationObserver && stateBean.eventHandlers.mutationObserver.disconnect();
            content.removeEventListener('scroll', stateBean.eventHandlers.scrollHandler, false);
            window.removeEventListener('resize', stateBean.eventHandlers.resizeHandler, false);
            stateBean.options.preventParentScroll && content.removeEventListener('wheel', stateBean.eventHandlers.wheelHandler, false);
            slider4y.removeEventListener('mousedown', stateBean.eventHandlers.mousedown4sliderY, false);
            slider4x.removeEventListener('mousedown', stateBean.eventHandlers.mousedown4sliderX, false);
            // 还原DOM结构
            // let parent = wrapper.parentNode;
            // content.removeChild(el);
            // parent.replaceChild(el, wrapper);
            // 移除stateBean
            util.deleteStateBean(el);
            stateBean = null;

        }

        // 注册指令 v-bar2
        Vue.directive('bar2', {
            bind(el, binding, vnode){
                // console.log('start init v-bar2', el.__vuebar2)
            },
            update(el, binding, vnode, oldnode){
                // console.log('Updating vnode')
            },
            inserted(el, binding, vnode){
                // console.log('Detect parentNode inserted v-bar2');
                initScrollbar.call(this, el, binding);
            },
            componentUpdated(el, binding, vnode, oldnode){
                updateScrollbar.call(this, el);
            },
            unbind(el, binding, vnode){
                // console.log('unbind v-bar2', el.parentNode);
                destroy.call(this, el);
            },
        });
    };

    // Expose
    if (typeof exports === 'object' && typeof module === 'object') {
        // commonJS
        module.exports = Vuebar2;
    } else if (typeof define === 'function' && define.amd) {
        // amd
        define(() => Vuebar2);
    } else if (typeof window !== 'undefined') {
        // browser
        window.Vuebar2 = Vuebar2;
    } else {
        throw 'Unknown Javascript runtime';
    }

    // 自动注册插件
    if (typeof Vue !== 'undefined') {
        Vue.use(Vuebar2);
    }

})();
