#!/usr/bin/env bash

set -e

# Change to the initial working directory
cd "$INIT_CWD" || { echo "Failed to change directory to $INIT_CWD"; exit 1; }

# Function to check if index.tsx exists and run barrelsby if it doesn't
run_barrelsby() {
    local dir="$1"
    shift  # Remove the first argument (dir) from the list
    if [ ! -f "$dir/index.tsx" ]; then
        barrelsby -d "$dir" "$@"
    fi
}

run_barrelsby "$INIT_CWD/src" -D -l all -q -S