# Hermes dSYM Files

This directory contains debug symbol files (dSYM) for the Hermes JavaScript engine used in React Native.

## Why are these needed?

Apple requires dSYM files for all frameworks when uploading to the App Store. The Hermes engine doesn't include dSYMs in the standard CocoaPods distribution, so they must be downloaded separately.

## How to download

Run the download script from the `ios` directory:

```bash
cd ios
./download-hermes-dsym.sh
```

This will:
1. Download the Hermes dSYM package for React Native 0.82.1 (~400MB)
2. Extract the files to `ios/dSYMs/`
3. Verify the UUID matches the framework

## What gets downloaded

The script downloads dSYM files for all platforms:
- `iphoneos/` - iPhone/iPad devices (used for App Store)
- `iphonesimulator/` - iOS Simulator
- `catalyst/` - Mac Catalyst
- `appletvos/` - Apple TV
- `appletvsimulator/` - Apple TV Simulator
- `xros/` - Vision Pro
- `xrsimulator/` - Vision Pro Simulator
- `macosx/` - macOS

## Automatic integration

The Xcode project includes a "Copy Hermes dSYM" build phase that automatically:
- Copies `hermesvm.framework.dSYM` from `iphoneos/` into your archive
- Only runs for Release builds
- Includes the dSYM in App Store submissions

## Re-downloading

You only need to re-download if:
- You upgrade to a different React Native version
- The dSYM files are missing or corrupted
- You're setting up the project on a new machine

## Git

This directory is excluded from git via `.gitignore` because:
- The files are very large (~1.8GB total)
- They can be re-downloaded easily
- They're specific to the React Native version in package.json

## Troubleshooting

**Error: "Could not read UUID"**
- The dSYM file may be corrupted. Delete `ios/dSYMs/` and re-run the script.

**Error: "dSYM extraction failed"**
- Check your internet connection
- Try deleting `hermes.tar.gz` and re-running the script

**UUID mismatch in App Store validation**
- Run `pod install` to ensure Hermes is up to date
- Delete `ios/dSYMs/` and re-download
- Clean DerivedData and create a fresh archive
