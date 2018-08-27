import CanvasMovieClip from './CanvasMovieClip';

class FullSizeCanvas {
  constructor(options) {
    const _ = this;

    _.option = Object.assign(
      {
        parent: null,
        canvasClass: 'canvas',
        width: 1280,
        height: 1024,
        alignX: 'center',
        alignY: 'center',
        imgs: [],
        spriteObj: null
      },
      options
    );

    _.parent = _.option.parent;

    _.$canvas = null;

    _.canvas = null;
    _.ctx = null;

    _.$proxyResize = $.proxy(_.resize, _);

    _.animationFrame = null;

    _.isPlaying = true;

    _.imgs = _.option.imgs;

    _.spriteObj = _.option.spriteObj;

    _.movieClip = null;
  }

  // temp methods
  /*
  drawImage(img, renderSizeObj) {
    const _ = this,
      size = renderSizeObj || _.getImageSizeAspectFill();

    _.ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      size.width,
      size.height
    );
  }
  */

  // public methods
  init(obj) {
    const _ = this;

    _.setInstance();
    // this.setCallbacks();
  }

  setInstance() {
    const _ = this,
      opt = _.option;

    _.$canvas = $(_.getCanvasTpl()).css({ position: 'absolute' });
    _.parent.append(_.$canvas);

    _.canvas = _.$canvas.get(0);
    _.ctx = _.canvas.getContext('2d');

    _.movieClip = new CanvasMovieClip({
      ctx: _.ctx,
      img: _.spriteObj.img,
      width: _.spriteObj.width,
      height: _.spriteObj.height,
      frameNum: 6,
      fps: 10
    });

    const size = _.getImageSizeAspectFill();
    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(opt.alignX, opt.alignY, size);

    $(window).on('resize', _.$proxyResize);
    _.resize();

    _.loopAnimation();
  }

  resize(evt) {
    let _ = this,
      size = _.getImageSizeAspectFill(); // _.getCanvasSizeWidthFit();

    _.setCanvasSize(size.width, size.height);
    _.setWrapAlign(_.option.alignX, _.option.alignY, size);
  }

  update() {
    const _ = this;
    _.drawCanvas();
  }

  drawCanvas() {
    const _ = this,
      size = _.getImageSizeAspectFill();

    _.drawImages(_.imgs, size);

    _.movieClip.render(size);
  }

  drawImages(imgObjs, size) {
    const _ = this;

    let obj, img;
    for (let i = 0, max = imgObjs.length; i < max; i++) {
      obj = imgObjs[i];
      img = obj.img;

      _.ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        size.width,
        size.height
      );
    }
  }

  loopAnimation() {
    let _ = this;

    _.animationFrame = window.requestAnimationFrame(_.loopAnimation.bind(_));

    _.update();
  }

  setCanvasSize(width, height) {
    const _ = this;

    _.ctx.canvas.width = width;
    _.ctx.canvas.height = height;

    _.$canvas.attr({ width: width, height: height });
  }

  setWrapAlign(alignX, alignY, modifiedSize) {
    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      left = 0,
      top = 0;

    switch (alignX) {
      case 'left':
        left = 0;
        break;

      case 'center':
        left = Math.round((winWidth - modifiedSize.width) / 2);
        break;

      case 'right':
        left = Math.round(winWidth - modifiedSize.width);
        break;
    }

    switch (alignY) {
      case 'top':
        top = 0;
        break;

      case 'center':
        top = Math.round((winHeight - modifiedSize.height) / 2);
        break;

      case 'bottom':
        top = Math.round(winHeight - modifiedSize.height);
        break;
    }

    this.setCanvasPos({ left: left, top: top });
  }

  setCanvasPos(css) {
    this.$canvas.css(css);
  }

  getImageSizeAspectFill() {
    let _ = this,
      opt = _.option;

    let winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      modifiedSizeW = winWidth,
      modifiedSizeH = Math.ceil((winWidth / opt.width) * opt.height);

    if (modifiedSizeH < winHeight) {
      modifiedSizeW = Math.ceil((winHeight / opt.height) * opt.width);
      modifiedSizeH = winHeight;
    }

    return {
      width: modifiedSizeW,
      height: modifiedSizeH
    };
  }

  getCanvasTpl() {
    return `<canvas class="${this.option.canvasClass}"></canvas>`;
  }
}

export default FullSizeCanvas;
