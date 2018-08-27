class CanvasMovieClip {
  constructor(options) {
    const _ = this;

    _.option = Object.assign(
      {
        ctx: null,
        img: null,
        width: 0,
        height: 0,
        frameNum: 1,
        fps: 60,
        isLoop: true
      },
      options
    );

    _.ctx = _.option.ctx;
    _.img = _.option.img;

    _.currentFrame = 1;
    _.frameNum = _.option.frameNum;
    _.isLoop = _.option.isLoop || false;

    _.renderInfo = {
      img: _.img,
      x: 0,
      y: 0,
      width: _.option.width,
      height: _.option.height
    };

    _.fpsInterval = 1000 / _.option.fps;
    _.now = Date.now();
    _.then = Date.now();
    _.startTime = _.then;
  }

  render(size) {
    const _ = this;

    _._draw(_.renderInfo, size);

    _.now = Date.now();
    _.elapsed = _.now - _.then;

    if (_.elapsed > _.fpsInterval) {
      _.then = _.now - (_.elapsed % _.fpsInterval);

      // update visual
      _.renderInfo = Object.assign({}, _.renderInfo, {
        y: _.renderInfo.y + _.option.height
      });

      _.currentFrame += 1;

      if (_.isLoop === true) {
        if (_.currentFrame > _.frameNum) {
          _.renderInfo = Object.assign({}, _.renderInfo, {
            y: 0
          });

          _.currentFrame = 1;
        }
      }
    }
  }

  _draw(renderInfo, size) {
    const _ = this;

    _.ctx.drawImage(
      renderInfo.img,
      renderInfo.x,
      renderInfo.y,
      renderInfo.width,
      renderInfo.height,
      0,
      0,
      size.width,
      size.height
    );
  }
}

export default CanvasMovieClip;
