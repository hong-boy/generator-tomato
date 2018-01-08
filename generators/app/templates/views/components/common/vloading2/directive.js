'use strict';
import Loading from './Loading.js'
let PLUGIN_NAME = 'loading2';
let plugin = {};
plugin.install = function (Vue, options) {
    Vue.directive(PLUGIN_NAME, {
        bind(el, binding, vnode){
            let inst = new Loading(el, binding.value);
            el.__vloading2Inst = inst;
        },
        inserted(el, binding, vnode){
            // el.__vloading2Inst.show(binding);
        },
        update(el, binding, vnode, oldnode){
            if (binding.oldValue != binding.value) {
                el.__vloading2Inst.update(binding.value);
            }
        },
        unbind(el, binding, vnode){
            el.__vloading2Inst.destroy();
        }
    });
};

if (typeof Vue !== 'undefined') {
    Vue.use(plugin);
}
export default plugin;
