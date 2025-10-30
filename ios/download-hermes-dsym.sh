#!/bin/bash

# Download Hermes dSYM for React Native 0.82.1
# This script downloads the Hermes debug symbols needed for App Store submission

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DSYM_DIR="$SCRIPT_DIR/dSYMs"
RN_VERSION="0.82.1"
HERMES_URL="https://repo1.maven.org/maven2/com/facebook/react/react-native-artifacts/${RN_VERSION}/react-native-artifacts-${RN_VERSION}-hermes-framework-dSYM-debug.tar.gz"

echo "📦 Downloading Hermes dSYM for React Native ${RN_VERSION}..."

# Create dSYMs directory if it doesn't exist
mkdir -p "$DSYM_DIR"

# Check if already downloaded
if [ -d "$DSYM_DIR/iphoneos/hermesvm.framework.dSYM" ]; then
    echo "✅ Hermes dSYM already exists at $DSYM_DIR/iphoneos/"
    echo "   UUID: $(dwarfdump --uuid "$DSYM_DIR/iphoneos/hermesvm.framework.dSYM" 2>/dev/null | grep UUID || echo 'Could not read UUID')"
    exit 0
fi

# Download if tar.gz doesn't exist
if [ ! -f "$DSYM_DIR/hermes.tar.gz" ]; then
    echo "⬇️  Downloading from Maven Central (~400MB)..."
    curl -L -o "$DSYM_DIR/hermes.tar.gz" "$HERMES_URL"
else
    echo "ℹ️  Using cached hermes.tar.gz"
fi

# Extract
echo "📂 Extracting dSYM files..."
cd "$DSYM_DIR"
tar -xzf hermes.tar.gz

# Verify
if [ -d "$DSYM_DIR/iphoneos/hermesvm.framework.dSYM" ]; then
    echo "✅ Hermes dSYM downloaded successfully!"
    echo "   Location: $DSYM_DIR/iphoneos/hermesvm.framework.dSYM"
    echo "   UUID: $(dwarfdump --uuid "$DSYM_DIR/iphoneos/hermesvm.framework.dSYM" 2>/dev/null | grep UUID || echo 'Could not read UUID')"
else
    echo "❌ Error: dSYM extraction failed"
    exit 1
fi

echo ""
echo "🎉 Done! The Hermes dSYM will be automatically included in your next archive build."
