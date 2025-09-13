#!/bin/bash

# Set your source and backup destination
SOURCE="/mnt/d/PROJECTS/AlgorithmicEngine"
DEST="/mnt/d/BACKUPS"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Create backup folder
mkdir -p "$DEST/AlgorithmicEngine-$DATE"

# Copy everything
cp -r "$SOURCE/" "$DEST/AlgorithmicEngine-$DATE"

echo "✅ Backup saved to: $DEST/AlgorithmicEngine-$DATE"