#!/bin/bash

# Check input arguments
if [ $# -ne 1 ]; then
    echo "Usage: ./bin/new-blog.sh \"my blog title\""
    if [ $# -eq 0 ]; then
    echo "Specify the title of the new blog post"
    else
    echo "Ensure you enclose the title in quotes"
    fi
    exit 1
fi

# Slugify the title
TITLE=$(echo $1 | sed -e 's/ /-/g' | tr '[:upper:]' '[:lower:]')

# Create the new blog post
hugo new blog/$(date +%F)-$TITLE.md