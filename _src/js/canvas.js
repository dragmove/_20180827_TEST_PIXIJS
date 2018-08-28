import $ from 'jquery';
import { isDef, not } from './util/util';

window.requestNextAnimationFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, ele) {
      const _ = this;

      let start, finish;

      window.setTimeout(function() {
        start = +new Date();

        callback(start);

        finish = +new Date();

        _.timeout = 1000 / 60 - (finish - start);
      }, _.timeout);
    }
  );
})();

(function() {
  'use strict';

  /*
  let now = 0,
    lastTime = 0,
    lastFpsUpdateTime = 0,
    lastFpsUpdate = 0;
  */

  let isRender = true;

  $(document).ready(init);

  function init() {
    console.log('init');

    window.requestNextAnimationFrame(animate);
  }

  function animate(time) {
    time = not(isDef)(time) ? +new Date() : time;

    if (isRender) {
      erase(time);
      preDraw(time);
      update(time);
      draw(time);

      /*
      const fps = calculateFps(); // change now, lastTime

      if (now - lastFpsUpdateTime > 1000) {
        lastFpsUpdateTime = now;
        lastFpsUpdate = fps;
      }
      */

      window.requestNextAnimationFrame(animate);
    }
  }

  function erase(time) {}

  function preDraw(time) {}

  function update(time) {
    // update object properties
    // instance.render(time); // example) update per (time - lastTime > 1000)
  }

  function draw(time) {
    // context.save, restore, etc...
  }

  /*
  function calculateFps() {
    now = +new Date();

    const fps = 1000 / (now - lastTime);

    lastTime = now;

    return fps;
  }
  */
})();
