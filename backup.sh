#!/bin/bash

# === Configuration ===
SOURCE="/mnt/d/PROJECTS/AlgorithmicEngine"
DEST="/mnt/d/BACKUPS"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="$DEST/AlgorithmicEngine-$DATE"

# === Create backup folder ===
mkdir -p "$BACKUP_DIR"

# === Copy files safely, excluding virtual environment and node_modules ===
rsync -av --progress --exclude='.venv' --exclude='node_modules' "$SOURCE/" "$BACKUP_DIR/"

echo "✅ Backup completed!"
echo "Location: $BACKUP_DIR "
