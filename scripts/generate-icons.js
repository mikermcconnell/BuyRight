/**
 * Icon Generator Script
 * Creates placeholder icons for PWA and Android app
 * In production, replace with actual designed icons
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA and Android
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple HTML-based icon for each size
// In production, use a proper image processing library like sharp
function createPlaceholderIcon(size) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#58CC02"/>
  
  <!-- Centered Content -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- House Icon (scaled) -->
    <g transform="scale(${size/512})">
      <!-- House Body -->
      <path d="M -120 20 L -120 120 L 120 120 L 120 20 L 0 -100 Z" 
            fill="white" 
            stroke="none"/>
      
      <!-- Roof -->
      <path d="M -140 20 L 0 -120 L 140 20 L 120 20 L 0 -100 L -120 20 Z" 
            fill="white" 
            stroke="none"/>
      
      <!-- Door -->
      <rect x="-30" y="40" width="60" height="80" fill="#58CC02" rx="4"/>
      
      <!-- Window Left -->
      <rect x="-90" y="40" width="40" height="40" fill="#58CC02" rx="4"/>
      
      <!-- Window Right -->
      <rect x="50" y="40" width="40" height="40" fill="#58CC02" rx="4"/>
      
      <!-- Checkmark Circle -->
      <circle cx="60" cy="-60" r="45" fill="white"/>
      <circle cx="60" cy="-60" r="38" fill="#58CC02"/>
      
      <!-- Checkmark -->
      <path d="M 40 -60 L 55 -45 L 80 -75" 
            stroke="white" 
            stroke-width="8" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            fill="none"/>
    </g>
  </g>
</svg>`;
  
  return svg;
}

// Generate icons
console.log('Generating app icons...');

iconSizes.forEach(size => {
  const svg = createPlaceholderIcon(size);
  const filePath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.svg`);
  
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Created icon-${size}x${size}.svg`);
});

// Create special icons for shortcuts
const specialIcons = {
  'dashboard': `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <rect width="96" height="96" rx="19" fill="#58CC02"/>
    <rect x="20" y="20" width="25" height="25" fill="white" rx="4"/>
    <rect x="51" y="20" width="25" height="35" fill="white" rx="4"/>
    <rect x="20" y="51" width="25" height="25" fill="white" rx="4"/>
    <rect x="51" y="61" width="25" height="15" fill="white" rx="4"/>
  </svg>`,
  
  'calculator': `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <rect width="96" height="96" rx="19" fill="#58CC02"/>
    <rect x="18" y="18" width="60" height="60" fill="white" rx="8"/>
    <rect x="26" y="26" width="44" height="16" fill="#58CC02" rx="2"/>
    <circle cx="35" cy="52" r="4" fill="#58CC02"/>
    <circle cx="48" cy="52" r="4" fill="#58CC02"/>
    <circle cx="61" cy="52" r="4" fill="#58CC02"/>
    <circle cx="35" cy="65" r="4" fill="#58CC02"/>
    <circle cx="48" cy="65" r="4" fill="#58CC02"/>
    <circle cx="61" cy="65" r="4" fill="#58CC02"/>
  </svg>`
};

Object.entries(specialIcons).forEach(([name, svg]) => {
  const filePath = path.join(__dirname, '..', 'public', 'icons', `${name}-96x96.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Created ${name}-96x96.svg`);
});

// Create a badge icon
const badge = `<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
  <circle cx="36" cy="36" r="36" fill="#58CC02"/>
  <text x="36" y="48" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="white">B</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'icons', 'badge-72x72.svg'), badge);
console.log('✓ Created badge-72x72.svg');

console.log('\n✅ Icon generation complete!');
console.log('Note: These are SVG placeholders. For production, convert to PNG format using a tool like sharp or imagemagick.');