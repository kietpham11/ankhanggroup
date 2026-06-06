const { Jimp } = require("jimp");
const path = require("path");

async function checkImage() {
  const imagePath = path.join(__dirname, "public", "images", "logo-icon-only.png");
  const image = await Jimp.read(imagePath);
  console.log(`Cropped image size: ${image.bitmap.width}x${image.bitmap.height}`);
}
checkImage().catch(console.error);
