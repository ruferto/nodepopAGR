'use strict';
const jimp = require('jimp');

async function resize(imgPath, imgName) {
  // Read the image.
  const image = await jimp.read(imgPath + '/' + imgName);

  // Resize the image to height 150 and auto width.
  await image.resize(jimp.AUTO, 100);

  // Save and overwrite the image
  await image.writeAsync(imgPath + '/thumbs/' + imgName);
}

module.exports = resize;
