//'use strict';
const Redis = require('ioredis');
const conf = require('../../config/env.js');
const redisConf = conf.redis;
const store = conf.store;
const PREFIX = 'CNST';

/**
 * Store基类（默认存储在内存中）
 */
class Store {
    constructor() {
        this._map = new Map();
        this._timers = new Map();
    }

    getID(key) {
        return `${PREFIX}:${key}`;
    }

    async get(key) {
        let promise = new Promise(resolve => {
            let id = this.getID(key);
            if (!this._map.has(id)) {
                resolve(null);
            }
            resolve(JSON.parse(this._map.get(id)));
        });
        return promise;
    }

    async set(key, value, maxAge) {
        return new Promise(resolve => {
            let id = this.getID(key);
            if (this._map.has(id) && this._timers.has(id)) {
                // 若之前已存在，则立即关闭定时任务
                let _timer = this._timers.get(id);
                !!timer && (clearTimeout(_timer));
            }
            // 检测是否需要开启定时任务
            if (maxAge) {
                this._timers.set(id, setTimeout(() => {
                    this.delete(key)
                }, maxAge))
            }
            try {
                this._map.set(id, JSON.stringify(value));
            } catch (e) {
                console.error('Set property error:', e);
            }
            resolve(id);
        });
    }

    async delete(key) {
        return new Promise(resolve => {
            try {
                let id = this.getID(key);
                // 清除记录
                this._map.delete(id);
                // 关闭定时任务
                let _timer = this._timers.get(id);
                !!_timer && (clearTimeout(_timer));
                this._timers.delete(id);
                resolve(true);
            } catch (e) {
                resolve(false);
            }
        });
    }
}

/**
 * RedisStore
 */
class RedisStore extends Store {
    constructor() {
        super();
        this._redis = new Redis(redisConf);
    }

    async get(key) {
        let id = this.getID(key);
        let data = await this._redis.get(id);
        return JSON.parse(data);
    }

    /**
     * 存储
     * @param key
     * @param value
     * @param maxAge 单位ms
     * @return {Promise.<*>}
     */
    async set(key, value, maxAge = redisConf.maxAge) {
        let id = this.getID(key);
        try {
            await this._redis.set(id, JSON.stringify(value), 'EX', maxAge / 1000);
        } catch (e) {
            console.error('Set property error:', e);
        }
        return id;
    }

    async delete(key) {
        let id = this.getID(key);
        try {
            await this._redis.del(id);
        } catch (e) {
            console.error('Del property error:', e);
        }
    }
}

/**
 * StoreUtil 用于暴露给调用者
 */
class StoreUtil {
    constructor(store) {
        // 默认使用Store实例
        this._store = store === 'redis' ? new RedisStore() : new Store();
    }

    get(key) {
        return this._store.get(key);
    }

    set(key, value, maxAge) {
        return this._store.set(key, value, maxAge);
    }

    del(key) {
        return this._store.delete(key);
    }
}

/**
 * 返回单例
 * @type {StoreUtil}
 */
exports = module.exports = new StoreUtil(store);
// For test unit
exports.StoreUtil = StoreUtil;
