#!/usr/bin/env python
# img2aspect
# Manages image sizes on the command line.
#
# Author:   Benjamin Bengfort <bbengfort@districtdatalabs.com>
# Created:  Mon Sep 12 14:19:14 2016 -0400
#
# Copyright (C) 2016 District Data Labs
# For license information, see LICENSE.txt
#
# ID: img2aspect.py [] benjamin@bengfort.com $

"""
Manages image sizes on the command line.
"""

##########################################################################
## Imports
##########################################################################

import os
import argparse

from PIL import Image


##########################################################################
## Command Description
##########################################################################

DESCRIPTION = "Resize and crop images to a particular aspect"
EPILOG = "This should not modify the original image, but make a copy!"
ARGUMENTS = {
    ('-o', '--output'): {
        'metavar': 'PATH',
        'default': None,
        'help': 'specify the path to write the modified image to',
    },
    ('-a', '--aspect'): {
        'default': '16x9',
        'metavar': 'WxH',
        'help': 'the aspect ratio e.g. 16x9',
    },
    'image': {
        'nargs': 1,
        'help': 'path to the image to resize and crop',
    }
}


##########################################################################
## Helper Functions
##########################################################################

def copyname(path, suffix="-modified"):
    """
    Returns the path to write out the copy name to.
    """
    name, ext = os.path.splitext(os.path.basename(path))
    name = "{}{}{}".format(name, suffix, ext)
    return os.path.join(
        os.path.dirname(path), name
    )


def aspect(s):
    """
    Parses an aspect from a string and returns a (width, height) tuple.
    """
    try:
        ratio = tuple(map(int, s.lower().split("x")))
        if len(ratio) != 2:
            raise ValueError("Not enough dimensions!")
        return ratio
    except:
        raise Exception("Could not parse the aspect from '{}'".format(s))


def reshape(imgpath, ratio):
    """
    Reshapes an image to the specified ratio by cropping along the larger
    dimension that doesn't meet the specified aspect ratio.
    """

    def crop_height(image, rx):
        width, height = image.size
        return image.crop((
            0, (rx/2),
            width, height - (rx/2),
        ))

    def crop_width(image, rx):
        width, height = image.size
        return image.crop((
            (rx/2), 0,
            width - (rx/2), height,
        ))

    image = Image.open(imgpath)
    width, height = image.size

    # Find the delta change.
    rxheight = ((width / ratio[0]) * ratio[1]) - height
    rxwidth  = ((height / ratio[1]) * ratio[0]) - width

    # Can only crop pixels, not add them.
    if rxheight < 0 and rxwidth < 0:
        # If both sides can be cropped to get what we want:
        # Select the largest (because both are negative)
        if rxheight > rxwidth:
            return crop_height(image, rxheight * -1)
        else:
            return crop_width(image, rxwidth * -1)

    elif rxheight < 0:
        # Trim height to fit aspect ratio
        return crop_height(image, rxheight * -1)

    elif rxwidth < 0:
        # Trim width to fit aspect ratio
        return crop_width(image, rxwidth * -1)

    else:
        # Can't do anything in this case
        return image


##########################################################################
## Main Method and Argument Parsing
##########################################################################

def main(args):
    """
    Handles user import and executes the transformation
    """

    imgpath = args.image[0]
    outpath = args.output or copyname(imgpath, suffix="-{}".format(args.aspect))
    ratio   = aspect(args.aspect)
    image   = reshape(imgpath, ratio)

    image.save(outpath)
    print(
        "Saved new {}px x {}px image to {}".format(
            image.size[0], image.size[1], outpath
        )
    )


if __name__ == '__main__':

    # Parser construction
    parser = argparse.ArgumentParser(
        description=DESCRIPTION, epilog=EPILOG,
    )

    # Add the arguments
    for args, kwargs in ARGUMENTS.items():
        if isinstance(args, str):
            args = (args,)
        parser.add_argument(*args, **kwargs)

    # Parse the args and execute the main method
    args = parser.parse_args()
    main(args)
