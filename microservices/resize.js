'use strict';
const jimp = require('jimp');

async function resize(imgPath, imgName) {
  try {
    const image = await jimp.read(imgPath + imgName);

    await image.resize(jimp.AUTO, 100);

    await image.writeAsync(imgPath + '/thumbs/' + imgName);
  } catch (error) {
    console.error(error);
  }
}

module.exports = resize;
