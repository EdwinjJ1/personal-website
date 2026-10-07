#!/bin/bash
#
# sync-photos-to-r2.sh
#
# Sync photography photos from NAS to Cloudflare R2
#
# Prerequisites:
# 1. Install rclone: brew install rclone
# 2. Configure R2: rclone config
#    - Name: r2
#    - Type: S3
#    - Provider: Other
#    - Endpoint: https://<account-id>.r2.cloudflarestorage.com
#    - Access Key ID: <R2_TOKEN_ID>
#    - Secret Access Key: <R2_TOKEN_SECRET>
#
# Usage:
#   ./scripts/sync-photos-to-r2.sh
#

set -e  # Exit on error

# Configuration
# TODO: Update these values for your environment
NAS_PATH="${NAS_PHOTO_PATH:-./public/images/photography}"
BUCKET_NAME="${R2_BUCKET_NAME:-evanlin-photos}"
R2_REMOTE="${R2_REMOTE:-r2}"
R2_PATH="${R2_REMOTE}:${BUCKET_NAME}/photography"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Cloudflare R2 Photo Sync ===${NC}"
echo ""

# Check if rclone is installed
if ! command -v rclone &> /dev/null; then
    echo -e "${RED}Error: rclone is not installed${NC}"
    echo "Install with: brew install rclone"
    exit 1
fi

# Check if NAS path exists
if [ ! -d "$NAS_PATH" ]; then
    echo -e "${RED}Error: NAS path not found: $NAS_PATH${NC}"
    echo "Set the correct path with: NAS_PHOTO_PATH=/path/to/photos ./scripts/sync-photos-to-r2.sh"
    exit 1
fi

# Check if rclone remote is configured
if ! rclone listremotes | grep -q "^${R2_REMOTE}:$"; then
    echo -e "${RED}Error: rclone remote '${R2_REMOTE}' not configured${NC}"
    echo "Configure with: rclone config"
    echo "  - Name: ${R2_REMOTE}"
    echo "  - Type: S3"
    echo "  - Provider: Other"
    echo "  - Endpoint: https://<account-id>.r2.cloudflarestorage.com"
    exit 1
fi

# Show configuration
echo "Configuration:"
echo "  Source: $NAS_PATH"
echo "  Destination: $R2_PATH"
echo ""

# Confirm before syncing
read -p "Continue with sync? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Sync cancelled."
    exit 0
fi

# Perform sync
echo -e "${GREEN}Starting sync...${NC}"
rclone copy "$NAS_PATH/" "$R2_PATH" \
    --progress \
    --transfers 10 \
    --checkers 20 \
    --retries 3 \
    --low-level-retries 10 \
    --stats-one-line \
    --stats 5s

echo ""
echo -e "${GREEN}Sync completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update photo metadata in src/data/Photography.ts"
echo "  2. Build and deploy: npm run build && git push"
echo ""
echo "Photos will be available at: ${CDN_URL:-https://images.evanlin.site}/photography/"
