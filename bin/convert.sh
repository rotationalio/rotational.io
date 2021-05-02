#!/bin/bash

if [ "$#" -ne 1 ]
then
  echo "Converts jpg files to webp files in the same path"
  echo "Usage: ./convert.sh static/images/blog/myimage.jpg"
  exit 1
fi

IN=$1
OUT="${IN%.*}.webp"
echo "converting $IN --> $OUT"
cwebp -q 80 $IN -o $OUT
