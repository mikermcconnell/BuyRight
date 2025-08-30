# BuyRight App Keystore Information

## 🔐 Android App Signing Setup

### Keystore Details:
- **File Name**: `buyright-release-key.keystore`
- **Location**: `android/app/buyright-release-key.keystore`
- **Alias**: `buyright-key`
- **Algorithm**: RSA 2048-bit
- **Validity**: 10,000 days (27+ years)
- **Certificate**: Self-signed

### Security Information:
- **Store Password**: [STORED SECURELY - NOT IN VERSION CONTROL]
- **Key Password**: [STORED SECURELY - NOT IN VERSION CONTROL]

### Certificate Details:
- **Common Name (CN)**: BuyRight
- **Organizational Unit (OU)**: Development
- **Organization (O)**: BuyRight App
- **Locality (L)**: Toronto
- **State/Province (S)**: Ontario
- **Country (C)**: CA

## 🚨 CRITICAL SECURITY NOTES:

1. **NEVER commit the keystore file to version control**
2. **Store keystore and passwords in a secure location**
3. **Create multiple backups of the keystore file**
4. **If you lose this keystore, you cannot update your published app**

## 📁 File Locations (Protected by .gitignore):
```
android/app/buyright-release-key.keystore  ← SECURE THIS FILE!
```

## 🔄 Google Play Console Upload:
- **Signed AAB File**: `android/app/build/outputs/bundle/release/app-release.aab`
- **File Size**: ~2.98 MB
- **Status**: ✅ Ready for Google Play Console

## 🛡️ Backup Recommendations:
1. Copy keystore to encrypted cloud storage
2. Store passwords in password manager
3. Create offline backup on encrypted drive
4. Share securely with team members if needed

## 📋 For Future Updates:
When building future releases, use the same keystore:
```bash
./gradlew bundleRelease
```

The build.gradle is configured to automatically sign releases with this keystore.