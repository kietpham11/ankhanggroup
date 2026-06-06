const { Jimp } = require("jimp");
const path = require("path");

async function cropLogo() {
  const imagePath = path.join(__dirname, "public", "images", "logo-ankhang-transparent.png");
  const outPath = path.join(__dirname, "public", "images", "logo-icon-only.png");
  
  const image = await Jimp.read(imagePath);
  
  // The image is stacked. Let's crop the top part.
  // We'll guess the symbol takes up the top 60% of the height.
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  // Try cropping the top 65% of the image
  image.crop({ x: 0, y: 0, w: width, h: Math.floor(height * 0.65) });
  
  await image.write(outPath);
  console.log("Cropped logo saved to", outPath);
}

cropLogo().catch(console.error);
