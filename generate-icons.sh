#!/bin/bash

# Icon generation script for Qirim Junior
# Uses sips (macOS built-in tool) to resize icons

set -e

SOURCE_IMAGE="src/assets/imageLoadingPlaceholder.png"
ANDROID_DIR="android/app/src/main/res"
IOS_DIR="ios/qirim_junior/Images.xcassets/AppIcon.appiconset"

echo "🎨 Generating app icons from $SOURCE_IMAGE"

# Create directories if they don't exist
mkdir -p "$IOS_DIR"

# ===== iOS App Icons =====
echo "📱 Generating iOS icons..."

# iPhone Notification (20pt)
sips -z 40 40 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-20@2x.png" > /dev/null
sips -z 60 60 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-20@3x.png" > /dev/null

# iPhone Settings (29pt)
sips -z 58 58 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-29@2x.png" > /dev/null
sips -z 87 87 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-29@3x.png" > /dev/null

# iPhone Spotlight (40pt)
sips -z 80 80 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-40@2x.png" > /dev/null
sips -z 120 120 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-40@3x.png" > /dev/null

# iPhone App (60pt)
sips -z 120 120 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-60@2x.png" > /dev/null
sips -z 180 180 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-60@3x.png" > /dev/null

# iPad Notification (20pt)
sips -z 20 20 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-20.png" > /dev/null

# iPad Settings (29pt)
sips -z 29 29 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-29.png" > /dev/null

# iPad Spotlight (40pt)
sips -z 40 40 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-40.png" > /dev/null

# iPad App (76pt)
sips -z 76 76 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-76.png" > /dev/null
sips -z 152 152 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-76@2x.png" > /dev/null

# iPad Pro App (83.5pt)
sips -z 167 167 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-83.5@2x.png" > /dev/null

# App Store
sips -z 1024 1024 "$SOURCE_IMAGE" --out "$IOS_DIR/Icon-1024.png" > /dev/null

echo "✅ iOS icons generated"

# ===== Android App Icons =====
echo "🤖 Generating Android icons..."

# Create Android mipmap directories
mkdir -p "$ANDROID_DIR/mipmap-mdpi"
mkdir -p "$ANDROID_DIR/mipmap-hdpi"
mkdir -p "$ANDROID_DIR/mipmap-xhdpi"
mkdir -p "$ANDROID_DIR/mipmap-xxhdpi"
mkdir -p "$ANDROID_DIR/mipmap-xxxhdpi"

# App Icons (launcher icons)
sips -z 48 48 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-mdpi/ic_launcher.png" > /dev/null
sips -z 72 72 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-hdpi/ic_launcher.png" > /dev/null
sips -z 96 96 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xhdpi/ic_launcher.png" > /dev/null
sips -z 144 144 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xxhdpi/ic_launcher.png" > /dev/null
sips -z 192 192 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xxxhdpi/ic_launcher.png" > /dev/null

# Round Icons
sips -z 48 48 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-mdpi/ic_launcher_round.png" > /dev/null
sips -z 72 72 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-hdpi/ic_launcher_round.png" > /dev/null
sips -z 96 96 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xhdpi/ic_launcher_round.png" > /dev/null
sips -z 144 144 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xxhdpi/ic_launcher_round.png" > /dev/null
sips -z 192 192 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xxxhdpi/ic_launcher_round.png" > /dev/null

# Foreground icons for adaptive icons (108dp with 72dp safe area)
# These should be larger to account for the safe zone
sips -z 108 108 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-mdpi/ic_launcher_foreground.png" > /dev/null
sips -z 162 162 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-hdpi/ic_launcher_foreground.png" > /dev/null
sips -z 216 216 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xhdpi/ic_launcher_foreground.png" > /dev/null
sips -z 324 324 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xxhdpi/ic_launcher_foreground.png" > /dev/null
sips -z 432 432 "$SOURCE_IMAGE" --out "$ANDROID_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png" > /dev/null

echo "✅ Android icons generated"

# ===== Android Notification Icons =====
echo "🔔 Generating Android notification icons..."

# Create drawable directories
mkdir -p "$ANDROID_DIR/drawable-mdpi"
mkdir -p "$ANDROID_DIR/drawable-hdpi"
mkdir -p "$ANDROID_DIR/drawable-xhdpi"
mkdir -p "$ANDROID_DIR/drawable-xxhdpi"
mkdir -p "$ANDROID_DIR/drawable-xxxhdpi"

# Notification icons (should be white/transparent, but we'll use the source for now)
# In production, you'd want a simplified white icon on transparent background
sips -z 24 24 "$SOURCE_IMAGE" --out "$ANDROID_DIR/drawable-mdpi/ic_notification.png" > /dev/null
sips -z 36 36 "$SOURCE_IMAGE" --out "$ANDROID_DIR/drawable-hdpi/ic_notification.png" > /dev/null
sips -z 48 48 "$SOURCE_IMAGE" --out "$ANDROID_DIR/drawable-xhdpi/ic_notification.png" > /dev/null
sips -z 72 72 "$SOURCE_IMAGE" --out "$ANDROID_DIR/drawable-xxhdpi/ic_notification.png" > /dev/null
sips -z 96 96 "$SOURCE_IMAGE" --out "$ANDROID_DIR/drawable-xxxhdpi/ic_notification.png" > /dev/null

echo "✅ Notification icons generated"

echo ""
echo "🎉 All icons generated successfully!"
echo ""
echo "📋 Summary:"
echo "  - iOS icons: $IOS_DIR"
echo "  - Android app icons: $ANDROID_DIR/mipmap-*"
echo "  - Android notification icons: $ANDROID_DIR/drawable-*"
echo ""
echo "⚠️  Note: Don't forget to update Contents.json for iOS icons"
