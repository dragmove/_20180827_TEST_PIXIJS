import $ from 'jquery';
import aid from 'aid.js';
import { TweenMax } from 'gsap/TweenMax';
import FullSizeCanvas from './components/FullSizeCanvas';

(function() {
  'use strict';

  $(document).ready(init);

  function init() {
    console.log('init');

    setCanvas();
  }

  function setCanvas() {
    let parent = $('.wrap-canvas');

    const canvas = new FullSizeCanvas({
      parent: parent,
      canvasCalss: 'canvas',
      width: 1920,
      height: 1080,
      alignX: 'center',
      alignY: 'top',
      imgs: [
        {
          img: $('.img-1').get(0)
        }
      ],
      spriteObj: {
        img: $('.sprite-1').get(0),
        width: 600,
        height: 340
      }
    });

    canvas.init();

    /*
    $(window)
      .on('resize', function(evt) {
        console.log(
          'canvasVideo resize - window.innerWidth, window.innerHeight :',
          window.innerWidth,
          window.innerHeight
        );

        parent.css({
          width: window.innerWidth,
          height: window.innerHeight
        });
      })
      .trigger('resize');
      */
  }
})();
