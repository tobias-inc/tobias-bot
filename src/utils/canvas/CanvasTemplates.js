const { createCanvas, Image } = require("canvas");

const CanvasUtils = require("./CanvasUtils.js");
const Constants = require("../Constants.js");

module.exports = class CanvasTemplates {
  static async levelUpdated(user, { level }) {
    const WIDTH = 150;
    const HEIGHT = 150;

    const LOGO_SIZE = 60;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const IMAGE_ASSETS = Promise.all([
      Image.from(user.displayAvatarURL),
      Image.from('https://images.unsplash.com/photo-1546417492-dcfe1fbb6669?ixlib=rb-1.2.1&w=1000&q=80'),
      Image.from('http://www.talencia.cat/mypics/max/1/16491_purple-cloud-background.jpg')
    ])

    const [avatarImage, backgroundImage, levelBackground] = await IMAGE_ASSETS;

    // Layout

    ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT);
    ctx.drawBlurredImage(levelBackground, 2, 0, HEIGHT - 60, WIDTH, 60);

    ctx.fillStyle = 'rgba(250, 250, 250, .5)';
    ctx.fillRect(0, HEIGHT - 60, WIDTH, 60)

    ctx.fillStyle = Constants.FAV_COLOR;
    ctx.fillRect(0, (HEIGHT - 60) - 2, WIDTH, 4);

    // Logo

    ctx.fillStyle = '#FFF';
    ctx.fillRect(((WIDTH - LOGO_SIZE) / 2) - 2, 8, LOGO_SIZE + 4, LOGO_SIZE + 4)

    ctx.drawImage(avatarImage, (WIDTH - LOGO_SIZE) / 2, 10, LOGO_SIZE, LOGO_SIZE);

    // Level Texts

    const blockSizeInsert = 5;

    const textLevelUpedMeasure = CanvasUtils.measureText(ctx, '22px Bebas Neue', 'SUBIU DE NIVEL');
    const blockAlign = CanvasUtils.resolveAlign(WIDTH / 2, 100, textLevelUpedMeasure.width + blockSizeInsert, textLevelUpedMeasure.height + blockSizeInsert, 2);

    ctx.fillStyle = 'rgba(0, 0, 0, .3)';
    ctx.fillRect(blockAlign.x, (blockAlign.y - textLevelUpedMeasure.height) - (blockSizeInsert * 1.5), textLevelUpedMeasure.width + blockSizeInsert, textLevelUpedMeasure.height + blockSizeInsert)

    ctx.fillStyle = '#FFF';
    ctx.write('SUBIU DE NIVEL', WIDTH / 2, 100, '22px Bebas Neue', 2);

    //

    const textLevelNumberMeasure = CanvasUtils.measureText(ctx, 'italic 22px Lemon Milk Bold', 'LVL');
    const textLevelNumber = `LVL ${level.toString().replace(/\d/g, ' ')}`;

    ctx.fillStyle = Constants.FAV_COLOR;
    const levelBrand = ctx.write(textLevelNumber, WIDTH / 2, 125, 'italic 22px Lemon Milk Bold', 2);

    ctx.fillStyle = '#1500ff';
    ctx.fillText(` ${level.toString()}`, levelBrand.leftX + textLevelNumberMeasure.width, levelBrand.bottomY)

    return canvas.toBuffer()
  }
}