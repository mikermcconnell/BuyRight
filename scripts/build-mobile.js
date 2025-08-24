const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to API directory
const apiPath = path.join(__dirname, '..', 'src', 'app', 'api');
const tempPath = path.join(__dirname, '..', 'src', 'app', 'api.bak');

console.log('🔧 Preparing mobile build...');

// Step 1: Rename API directory temporarily
if (fs.existsSync(apiPath)) {
  console.log('📦 Moving API routes temporarily...');
  fs.renameSync(apiPath, tempPath);
}

try {
  // Step 2: Build the app
  console.log('🏗️ Building mobile app...');
  execSync('npm run build:mobile', { stdio: 'inherit' });
  
  // Step 3: Sync with Capacitor
  console.log('📱 Syncing with Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });
  
  console.log('✅ Mobile build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
} finally {
  // Step 4: Restore API directory
  if (fs.existsSync(tempPath)) {
    console.log('♻️ Restoring API routes...');
    fs.renameSync(tempPath, apiPath);
  }
}