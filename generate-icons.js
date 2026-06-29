const sharp = require('sharp');
const path = require('path');

const sizes = [192, 512, 1024];

async function generateIcon(size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F5132"/>
      <stop offset="100%" stop-color="#166534"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${size * 0.01}" stdDeviation="${size * 0.015}" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#bg)"/>
  <g transform="translate(${size * 0.5}, ${size * 0.5})" filter="url(#shadow)">
    <!-- Book shape -->
    <g transform="translate(${-size * 0.2}, ${-size * 0.2})">
      <rect x="${size * 0.02}" y="${size * 0.02}" width="${size * 0.36}" height="${size * 0.36}" rx="${size * 0.03}" fill="white" opacity="0.15" transform="rotate(-5)"/>
      <rect x="0" y="0" width="${size * 0.36}" height="${size * 0.36}" rx="${size * 0.03}" fill="white"/>
      <line x1="${size * 0.18}" y1="${size * 0.04}" x2="${size * 0.18}" y2="${size * 0.36}" stroke="#0F5132" stroke-width="${size * 0.008}" opacity="0.3"/>
      <!-- Lines on page -->
      <line x1="${size * 0.06}" y1="${size * 0.10}" x2="${size * 0.15}" y2="${size * 0.10}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.06}" y1="${size * 0.15}" x2="${size * 0.15}" y2="${size * 0.15}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.06}" y1="${size * 0.20}" x2="${size * 0.15}" y2="${size * 0.20}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.06}" y1="${size * 0.25}" x2="${size * 0.15}" y2="${size * 0.25}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.21}" y1="${size * 0.10}" x2="${size * 0.30}" y2="${size * 0.10}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.21}" y1="${size * 0.15}" x2="${size * 0.30}" y2="${size * 0.15}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.21}" y1="${size * 0.20}" x2="${size * 0.30}" y2="${size * 0.20}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
      <line x1="${size * 0.21}" y1="${size * 0.25}" x2="${size * 0.30}" y2="${size * 0.25}" stroke="#0F5132" stroke-width="${size * 0.006}" opacity="0.2"/>
    </g>
    <!-- Star decoration -->
    <circle cx="0" cy="${-size * 0.02}" r="${size * 0.015}" fill="#C9A227" opacity="0.8"/>
  </g>
</svg>`;

  const outputPath = path.join(__dirname, 'public', 'icons', `icon-${size}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`Generated icon-${size}.png`);
}

async function main() {
  for (const size of sizes) {
    await generateIcon(size);
  }
  console.log('All icons generated!');
}

main().catch(console.error);
