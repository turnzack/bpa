const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const baselinePath = path.join(__dirname, "..", "..", "validation", "fixtures", "visual-dimensions-mismatch", ".kirov", "visuals", "desktop", "home.png");

fs.mkdirSync(path.dirname(baselinePath), { recursive: true });

const png = new PNG({ width: 1, height: 1 });
png.data[0] = 255;
png.data[1] = 0;
png.data[2] = 0;
png.data[3] = 255;

fs.writeFileSync(baselinePath, PNG.sync.write(png));
console.log("Fake baseline generated.");
