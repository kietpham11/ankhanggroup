const { Jimp } = require("jimp");
const path = require("path");

async function removeBackground() {
  const imagePath = path.join(__dirname, "public", "images", "logo-ankhang.png");
  const outPath = path.join(__dirname, "public", "images", "logo-ankhang-transparent.png");
  
  const image = await Jimp.read(imagePath);
  
  // Replace white/light-grey background with transparent
  image.scan((x, y, idx) => {
    const r = image.bitmap.data[idx + 0];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    
    // Background is light, gold has low Blue, navy is dark
    // So if r, g, b are all high (e.g. > 200), it's the background
    if (r > 200 && g > 200 && b > 200) {
      // Set alpha to 0 (transparent)
      image.bitmap.data[idx + 3] = 0;
    } else {
      // We could do some edge smoothing but let's keep it simple
    }
  });
  
  await image.write(outPath);
  console.log("Background removed and saved to", outPath);
}

removeBackground().catch(console.error);
