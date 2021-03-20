# Rotational.io

![Publish Action](https://github.com/rotationalio/rotational.io/actions/workflows/publish.yml/badge.svg)

**The official website and blog of Rotational Labs.**

This repository maintains the content for the [rotational.io](https://rotational.io/) website, generated using [Hugo](https://gohugo.io/). Contributors to the blog or website should review this README carefully for workflow and style guidelines. Thank you so much for your efforts for Rotational!

## Getting Started

After cloning the repository from origin or from your fork, and changing into the root directory of the repository, you'll need to [install Hugo](https://gohugo.io/getting-started/installing/). On Mac, we recommend using [Homebrew](https://brew.sh/) as follows:

```
$ brew install hugo
```

You can check the version of Hugo as follows:

```
$ hugo version
```

It may be helpful to ensure the installed version of Hugo matches the deployment Hugo version, which can be found [here](https://github.com/rotationalio/rotational.io/blob/main/.github/workflows/publish.yml#L17).

Once Hugo is installed, run a local server as follows:

```
$ hugo serve -D
```

Note that the `-D` flag enables draft content, which is necessary to see any draft posts or content that you're writing. With the local server running, you can navigate to [http://localhost:1313/](http://localhost:1313/) to view the rendered website. Everytime you make changes in the repository, the website will be re-rendered and you can simply refersh the page to see it.

## Blog

To create a new blog post, use the [`hugo new`](https://gohugo.io/commands/hugo_new/#readout) command as follows:

```
$ hugo new blog/YYYY-MM-DD-title-of-blog.md
```

To automatically add the date, you can use `hugo new blog/$(date +%F)-title.md` or you can use the helper script we've created as follows:

```
$ ./bin/new-blog.sh "Title of My Awesome Blog Post"
```

> **NOTE**: ensure that these commands are run in the root of the project.

This will create a new file in the `content/english/blog` directory (English is the default language for our site) that you can open and begin to edit. When creating new blog content, Hugo uses the `archetypes/blog.md` template file and generates the following [frontmatter](https://gohugo.io/content-management/front-matter#readout):

```
---
title: "Title Of My Awesome Blog Post"
slug: "title-of-my-awesome-blog-post"
date: "2021-03-20T11:45:48-04:00"
draft: true
image_webp: images/blog/
image: images/blog/
author: Your Name
description : "Add Description Here"
---
```

The next steps are as follows:

1. Update the `author` and `description` fields.
2. Find a blog image from [Unsplash](https://unsplash.com/collections/63030615/rotational-website) and add to `image_webp` and `image` fields.
3. Write the blog post!

## I18n and L10n

[TODO: add details]

## Publication

We strongly recommend that new blog posts are submitted as Pull Requests and reviewed there as part of the editorial workflow.

> **NOTE**: Make sure that the `draft: true` in the front matter is removed or changed to `draft: false` before publication!

Once edited, when the PR is merged into the main branch, [GitHub Actions](https://github.com/rotationalio/rotational.io/actions) will automatically publish the blog to our website; it may take a few minutes but please keep refreshing the page to make sure the changes worked correctly.

If manual deployment is required (e.g. to publish a branch that is not main), you can use the following script:

```
$ ./bin/publish.sh
```

Please note that this will require all changes to be committed before using it.

## Acknowledgements

We couldn't do what we do without the contributions of others, so we want to acknowledge and thank them for their efforts. Our website uses the following open source tools and royalty-free media:

- [Hugo static site generator](https://gohugo.io/)
- [GitHub Pages](https://pages.github.com/)
- [Themefisher](https://themefisher.com/)
- [Boostrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [The Noun Project](https://thenounproject.com/)
- [Unsplash](https://unsplash.com/)
- [NASA Image and Video Library](https://images.nasa.gov/)