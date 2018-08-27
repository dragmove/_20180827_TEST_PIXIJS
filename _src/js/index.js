import $ from 'jquery';
import aid from 'aid.js';
import * as PIXI from 'pixi.js';
import { TweenMax } from 'gsap/TweenMax';

class CanvasSlideShow {
  constructor(options) {
    const _ = this;

    console.log('_ :', options);

    _.options = Object.assign(
      {
        stageWidth: 1920,
        stageHeight: 1080,
        pixiSprites: [],
        centerSprites: false,
        texts: [],
        autoPlay: true,
        autoPlaySpeed: [10, 3],
        fullScreen: true,

        displaceScale: [200, 70],
        displacementImage: '',

        // navElement
        displaceAutoFit: false,
        wacky: false,
        interactive: false,
        interactionEvent: '',

        displaceScaleTo: [20, 20], // aid.falsy(_.options.autoPlay) ? [0, 0] : [20, 20],
        textColor: '#fff',
        displacementCenter: false,
        dispatchPointerOver: false
      },
      options
    );

    //  PIXI variables
    _.renderer = new PIXI.autoDetectRenderer(
      _.options.stageWidth,
      _.options.stageHeight,
      { transparent: true }
    );

    _.stage = new PIXI.Container();

    _.slidesContainer = new PIXI.Container();

    _.displacementSprite = new PIXI.Sprite.fromImage(
      _.options.displacementImage
    );

    _.displacementFilter = new PIXI.filters.DisplacementFilter(
      _.displacementSprite
    );

    // TEXTS
    _.style = new PIXI.TextStyle({
      fill: _.options.textColor,
      wordWrap: true,
      wordWrapWidth: 400,
      letterSpacing: 20,
      fontSize: 14
    });

    // SLIDES ARRAY INDEX
    _.currentIndex = 0;

    // TICKER
    _.ticker = null;
    _.render = null;

    _.rafID = null;
  }

  init() {
    const _ = this;

    _.initPixi();
    _.loadPixiSprites(_.options.pixiSprites);

    /// ---------------------------
    //  DEFAULT RENDER/ANIMATION
    /// ---------------------------
    console.log('_.options.autoPlay :', _.options.autoPlay);
    if (_.options.autoPlay === true) {
      _.ticker = new PIXI.ticker.Ticker();

      _.ticker.autoStart = _.options.autoPlay;

      _.ticker.add(function(delta) {
        _.displacementSprite.x += _.options.autoPlaySpeed[0] * delta;
        _.displacementSprite.y += _.options.autoPlaySpeed[1];

        _.renderer.render(_.stage);
      });
    } else {
      _.render = new PIXI.ticker.Ticker();

      _.render.autoStart = true;

      _.render.add(function(delta) {
        _.renderer.render(_.stage);
      });
    }

    /// ---------------------------
    //  INTERACTIONS
    /// ---------------------------
    if (_.options.interactive === true) {
      let mouseX, mouseY;

      // Enable interactions on our slider
      _.slidesContainer.interactive = true;
      _.slidesContainer.buttonMode = true;

      // hover
      if (
        _.options.interactionEvent === 'hover' ||
        _.options.interactionEvent === 'both'
      ) {
        console.log('hover');

        _.slidesContainer.pointerover = function(mouseData) {
          console.log('pointerover :', mouseData);

          mouseX = mouseData.data.global.x;
          mouseY = mouseData.data.global.y;

          TweenMax.to(_.displacementFilter.scale, 1, {
            x: '+=' + Math.sin(mouseX) * 100 + '',
            y: '+=' + Math.cos(mouseY) * 100 + ''
          });

          _.rotateSprite();
        };

        _.slidesContainer.pointerout = function(mouseData) {
          console.log('pointerout :', mouseData);

          TweenMax.to(_.displacementFilter.scale, 1, { x: 0, y: 0 });
          cancelAnimationFrame(_.rafID);
        };
      }

      // click
      if (
        _.options.interactionEvent === 'click' ||
        _.options.interactionEvent === 'both'
      ) {
        console.log('click');

        _.slidesContainer.pointerdown = function(mouseData) {
          console.log('pointerdown :', mouseData);

          mouseX = mouseData.data.global.x;
          mouseY = mouseData.data.global.y;

          TweenMax.to(_.displacementFilter.scale, 1, {
            x: '+=' + Math.sin(mouseX) * 1200 + '',
            y: '+=' + Math.cos(mouseY) * 200 + ''
          });
        };

        _.slidesContainer.pointerup = function(mouseData) {
          console.log('pointerup :', mouseData);

          if (_.options.dispatchPointerOver === true) {
            TweenMax.to(_.displacementFilter.scale, 1, {
              x: 0,
              y: 0,
              onComplete: function() {
                TweenMax.to(_.displacementFilter.scale, 1, { x: 20, y: 20 });
              }
            });
          } else {
            TweenMax.to(_.displacementFilter.scale, 1, { x: 0, y: 0 });
            cancelAnimationFrame(_.rafID);
          }
        };
      }
    }

    _.setTempProcess();
  }

  setTempProcess() {
    const _ = this;

    TweenMax.to(_.displacementFilter.scale, 1, { x: 0, y: 0 });
  }

  initPixi() {
    const _ = this;

    // Add canvas to the HTML
    $('.wrap').append(_.renderer.view);

    // Add child container to the main container
    _.stage.addChild(_.slidesContainer);

    // Enable Interactions
    _.stage.interactive = true;

    console.log(_.renderer.view.style);

    // Fit renderer to the screen
    if (aid.truthy(_.options.fullScreen)) {
      _.renderer.view.style.objectFit = 'cover';
      _.renderer.view.style.width = '100%';
      _.renderer.view.style.height = '100%';
      _.renderer.view.style.top = '50%';
      _.renderer.view.style.left = '50%';
      _.renderer.view.style.webkitTransform =
        'translate( -50%, -50% ) scale(1.2)';
      _.renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.2)';
    } else {
      _.renderer.view.style.maxWidth = '100%';
      _.renderer.view.style.top = '50%';
      _.renderer.view.style.left = '50%';
      _.renderer.view.style.webkitTransform = 'translate( -50%, -50% )';
      _.renderer.view.style.transform = 'translate( -50%, -50% )';
    }

    _.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    // Set the filter to stage and set some default values for the animation
    _.stage.filters = [_.displacementFilter];

    // TODO: wacky is what ?
    /*
    if ( options.autoPlay === false ) {
      displacementFilter.scale.x = 0;
      displacementFilter.scale.y = 0;
    }
    if ( options.wacky === true ) {
      displacementSprite.anchor.set(0.5);
      displacementSprite.x = renderer.width / 2;
      displacementSprite.y = renderer.height / 2; 
    }
    */

    _.displacementSprite.scale.x = 2;
    _.displacementSprite.scale.y = 2;

    // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
    _.displacementFilter.autoFit = _.options.displaceAutoFit;

    _.stage.addChild(_.displacementSprite);
  }

  loadPixiSprites(pixiSprites) {
    const _ = this;

    console.log('pixiSprites :', pixiSprites);

    const rSprites = _.options.pixiSprites; // TODO: sprites ?
    // const rTexts = options.texts;

    for (let i = 0; i < rSprites.length; i++) {
      const texture = new PIXI.Texture.fromImage(pixiSprites[i]); // TODO: sprites ?

      let image = new PIXI.Sprite(texture);

      /*
      if (rTexts) {
        var richText = new PIXI.Text(rTexts[i], style);
        image.addChild(richText);

        richText.anchor.set(0.5);
        richText.x = image.width / 2;
        richText.y = image.height / 2;
      }
      

      if (options.centerSprites === true) {
        image.anchor.set(0.5);
        image.x = renderer.width / 2;
        image.y = renderer.height / 2;
      }
      */

      // image.transform.scale.x = 1.3;
      // image.transform.scale.y = 1.3;

      if (i !== 0) {
        TweenMax.set(image, { alpha: 0 });
      }

      _.slidesContainer.addChild(image);
    }
  }

  rotateSprite() {
    const _ = this;

    _.displacementSprite.rotation += 0.001;

    _.rafID = window.requestAnimationFrame(_.rotateSprite.bind(_));
  }
}

(function() {
  'use strict';

  $(document).ready(init);

  function init() {
    console.log('init');

    let spriteImages = document.querySelectorAll('.slide-item__image');
    let spriteImagesSrc = [];

    for (let i = 0; i < spriteImages.length; i++) {
      const img = spriteImages[i];
      spriteImagesSrc.push(img.getAttribute('src'));
    }

    const canvasSlideShow = new CanvasSlideShow({
      pixiSprites: spriteImagesSrc,
      displacementImage: 'img/dmaps/2048x2048/clouds.jpg',
      autoPlay: true,
      autoPlaySpeed: [10, 3],
      displaceScale: [200, 70],
      interactive: true,
      interactionEvent: 'both', // 'click', 'hover', 'both'
      displaceAutoFit: false,
      dispatchPointerOver: true // restarts pointerover event after click
    });

    canvasSlideShow.init();
  }
})();
