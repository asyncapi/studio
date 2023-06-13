#!/bin/bash

# Step 1: Get the value of $VERSION environment variable
VERSION="$VERSION"

# Step 2: Extract the package name and version
PACKAGE_NAME="${VERSION%-v*}"
PACKAGE_VERSION="${VERSION##*-}"

# Step 3: Check if the package name matches the package name
if [ "$PACKAGE_NAME" = "$1" ]; then
  # Update the version of your npm package here
  npm --no-git-tag-version --allow-same-version version "$PACKAGE_VERSION"
else
  echo "Version was not bumped because this release doesn't belong to this package."
fi