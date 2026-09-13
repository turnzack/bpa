const fs = require('fs');
const lines = fs.readFileSync('e:/v0reponses/v0-interface-versel/src/App.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('isAutoPilot') || line.includes('reuseActiveTab')) {
    console.log(`${i + 1}: ${line}`);
  }
});
