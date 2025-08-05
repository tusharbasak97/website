#!/bin/bash

# WebP Conversion Script for Tushar Basak Portfolio
# Converts JPG and PNG images to WebP format with fallbacks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
QUALITY=85
IMAGES_DIR="assets/images"
PORTFOLIO_DIR="assets/images/portfolio"

echo -e "${BLUE}🔄 Starting WebP conversion process...${NC}"

# Function to convert image to WebP
convert_to_webp() {
    local input_file="$1"
    local output_file="${input_file%.*}.webp"

    if [ -f "$output_file" ]; then
        echo -e "${YELLOW}⚠️  WebP already exists: $output_file${NC}"
        return 0
    fi

    echo -e "${BLUE}🔄 Converting: $input_file -> $output_file${NC}"

    if cwebp -q $QUALITY "$input_file" -o "$output_file"; then
        echo -e "${GREEN}✅ Successfully converted: $output_file${NC}"

        # Show file size comparison
        original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file")
        webp_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file")
        savings=$(( (original_size - webp_size) * 100 / original_size ))

        echo -e "${GREEN}   📊 Size reduction: ${savings}% (${original_size} -> ${webp_size} bytes)${NC}"
    else
        echo -e "${RED}❌ Failed to convert: $input_file${NC}"
        return 1
    fi
}

# Create directories if they don't exist
mkdir -p "$IMAGES_DIR"
mkdir -p "$PORTFOLIO_DIR"

# Convert main images
echo -e "${BLUE}🖼️  Converting main images...${NC}"
find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
    # Skip favicon and icon files (keep original format for compatibility)
    if [[ "$img" =~ (favicon|icon|apple-touch|android-chrome|mstile) ]]; then
        echo -e "${YELLOW}⏭️  Skipping icon file: $img${NC}"
        continue
    fi
    convert_to_webp "$img"
done

# Convert portfolio images
echo -e "${BLUE}🖼️  Converting portfolio images...${NC}"
if [ -d "$PORTFOLIO_DIR" ]; then
    find "$PORTFOLIO_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r img; do
        convert_to_webp "$img"
    done
fi

echo -e "${GREEN}✅ WebP conversion completed!${NC}"

# Generate a report
echo -e "${BLUE}📊 Generating conversion report...${NC}"

total_original=0
total_webp=0
converted_count=0

find "$IMAGES_DIR" "$PORTFOLIO_DIR" -name "*.webp" 2>/dev/null | while read -r webp_file; do
    if [ -f "$webp_file" ]; then
        # Find corresponding original file
        base_name="${webp_file%.*}"
        original_file=""

        for ext in jpg jpeg png JPG JPEG PNG; do
            if [ -f "${base_name}.${ext}" ]; then
                original_file="${base_name}.${ext}"
                break
            fi
        done

        if [ -n "$original_file" ] && [ -f "$original_file" ]; then
            original_size=$(stat -f%z "$original_file" 2>/dev/null || stat -c%s "$original_file")
            webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file")

            total_original=$((total_original + original_size))
            total_webp=$((total_webp + webp_size))
            converted_count=$((converted_count + 1))
        fi
    fi
done

if [ $converted_count -gt 0 ]; then
    total_savings=$(( (total_original - total_webp) * 100 / total_original ))
    echo -e "${GREEN}📈 Conversion Summary:${NC}"
    echo -e "${GREEN}   Files converted: $converted_count${NC}"
    echo -e "${GREEN}   Total original size: $(numfmt --to=iec $total_original)${NC}"
    echo -e "${GREEN}   Total WebP size: $(numfmt --to=iec $total_webp)${NC}"
    echo -e "${GREEN}   Total savings: ${total_savings}% ($(numfmt --to=iec $((total_original - total_webp))))${NC}"
else
    echo -e "${YELLOW}⚠️  No files were converted or no size comparison available${NC}"
fi

echo -e "${GREEN}🎉 WebP conversion process completed successfully!${NC}"
