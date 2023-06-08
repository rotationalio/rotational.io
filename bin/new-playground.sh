# Slugify the title
TITLE=$(echo $1 | sed -e 's/ /-/g' | tr '[:upper:]' '[:lower:]')

# Create a new data playground
hugo new data-playground/$TITLE.md