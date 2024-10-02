#!/bin/bash

# Directory to monitor
MONITOR_DIR="/path/to/your/folder"

# Printer name
PRINTER_NAME="Bar-Code-Printer-TT065-50"

# Loop through all .prn files in the directory
for file in "$MONITOR_DIR"/*.prn; do
  if [ -e "$file" ]; then
    # Print the file
    lp -d "$PRINTER_NAME" -o raw "$file"
    # Optionally, move the file to a processed directory or delete it
    # mv "$file" /path/to/processed/folder/
    rm "$file"
  fi
done