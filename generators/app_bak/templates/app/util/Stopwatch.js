'use strict';
/**
 * 计时器
 * @type {Stopwatch}
 */
module.exports = class Stopwatch {
    constructor(task) {
        this.isRunning = false;
        this.sTime = null;
        this.totalTime = 0;
        this.currTask = null;
        this.taskList = [];
        if (task) {
            this.start(task);
        }
    }

    start(task) {
        if (this.isRunning) {
            console.error("Can't start StopWatch: it's already running");
            return;
        }
        this.isRunning = true;
        this.sTime = Date.now();
        this.currTask = task;
    }

    stop() {
        if (!this.isRunning) {
            console.error("Can't start StopWatch: it's not running");
            return;
        }
        this.isRunning = false;
        let eTime = Date.now();
        let takes = eTime - this.sTime;
        this.totalTime += takes;
        this.taskList.push({
            task: this.currTask,
            takes: takes
        });
        this.sTime = null;
        this.currTask = null;
    }

    end() {
        this.stop();
        let arr = [];
        this.taskList.forEach(item => {
            arr.push('Stopwatch - TASK[' + (item.task) + ']: running time ' + (item.takes) + ' ms');
        });
        arr.length > 1 && arr.push('Stopwatch - ALL_TASKS: running time ' + (this.totalTime) + ' ms');
        return arr.join('\n');
    }
};
