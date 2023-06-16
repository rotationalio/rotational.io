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

If you have yarn installed and prefer to use it for front end:

```
$ yarn dev:hugo
```

Note that the `-D` flag enables draft content, which is necessary to see any draft posts or content that you're writing. With the local server running, you can navigate to [http://localhost:1313/](http://localhost:1313/) to view the rendered website. Everytime you make changes in the repository, the website will be re-rendered and you can simply refersh the page to see it.

To install or update dependencies before making front end changes:
```
$ yarn install
```

The Tailwind CSS library is used to add CSS styles to the site. Tailwind automatically builds an output.css file which is the main stylesheet for the website. 

In a separate terminal window the following command will watch for any CSS changes and automatically rebuild the output.css file: 

```
$ yarn dev:css
```


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

This will create a new file in the `content/en/blog` directory (English is the default language for our site) that you can open and begin to edit. When creating new blog content, Hugo uses the `archetypes/blog.md` template file and generates the following [frontmatter](https://gohugo.io/content-management/front-matter#readout):

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

## Author

To create a new author, use the [`hugo new`](https://gohugo.io/commands/hugo_new/#readout) command as follows:

```
$ hugo new author/firstname-lastname.md
```

> **NOTE**: ensure that these commands are run in the root of the project.

This will create a new file in the `content/en/author` directory (English is the default language for our site) that you can open and begin to edit. When creating new blog content, Hugo uses the `archetypes/author.md` template file and generates the following [frontmatter](https://gohugo.io/content-management/front-matter#readout):

```
---
title: "" # Your full name
image: "" # Note if left empty, the Gravatar from your email will be used
email: ""
social:
  - icon : "ti-linkedin" # themify icon pack : https://themify.me/themify-icons
    link : "https://www.linkedin.com/in/" # Linkedin
  - icon : "ti-twitter-alt" # themify icon pack : https://themify.me/themify-icons
    link : "https://twitter.com/" # Twitter
  - icon : "ti-github" # themify icon pack : https://themify.me/themify-icons
    link : "https://github/com/" # Github
---

<!--Write your job title or function below, should be one line-->


<!--Write a brief 1-2 sentence bio/personal description below-->

```

The next steps are as follows:

1. Update the `title`, `email`, and socials `link` fields.
2. Add your image link to `image` field or leave empty to use email gravatar
3. Write your function at Rotational and then description of you

## hugo new command

"hugo new" command is used to create content…

If you type "hugo new example.md" the file created will be directly located in the root of the "content" folder.

According to archetypes and their content folder, you can use "hugo new archetype-content-folder/your-file.md" to create
a specific file

e.g:  $ hugo new blog/YYYY-MM-DD-title-of-blog.md  "to create blog post"
        Or
      $ hugo new author/firstname-lastname.md  "to create new author".


Can be useful: you can create blog or author subfolder by typing :

       $ hugo new blog/subfolder/YYYY-MM-DD-title-of-blog.md
          Or
       $ hugo new author/subfolder/firstname-lastname.md

## WebP

Our current theme makes use of [WebP](https://developers.google.com/speed/webp) - an image format created by Google that is supposed to be smaller and richer to power web and mobile applications. However, because WebP is not fully supported by all browsers, the theme requires both a JPEG/PNG version of an image and the WebP version.

Likely most of the images we'll use will come in a JPEG/PNG format. To convert them to WebP on the command line, [download the `cwebp`](https://developers.google.com/speed/webp/download) encoder tool. The download will be an archive file containing the entire codec for the webp protocol, extract the `bin/cwebp` utility from it and place it somewhere in your `$PATH`, e.g. in `~/bin`. When you run the utility the first time, your system will probably block it since it was downloaded from the web and not installed with a digital signature. Open System Preferences > Security and Privacy and allow the program to be executed (it will probably prompt you again when you do this, select the Open button when it does).

To convert a JPEG to WebP, run the following command:

```
$ cwebp -q 80 static/images/test.jpg -o static/images/test.webp
```

The `-q` flag is a "quality flag" which should be a number between 0 (worst quality) and 100 (best quality). This flag controls the lossiness of the compression algorithm. Alternatively, you can use the `-lossless` flag to maximize the quality of the conversion. The `-o` flag is the output path to save the file to.

## I18n and L10n

When possible, we aim to translate blog posts from their original language into the other languages offered via the Rotational webpage.

Our practice so far has been to have the translations performed via Fiverr. We provide the translator with a Word doc, where the original Markdown has been copied in (keeping all the formatting as is). The cost is about $35 for a 1500-word post (this may vary from language-to-language), and takes about 2-3 days.

In future, we would like to introduce an additional LQA (Linguistic Quality Assurance) pass by a second translator to validate the original translation.

## Publication

We strongly recommend that new blog posts are submitted as Pull Requests and reviewed there as part of the editorial workflow.

> **NOTE**: Make sure that the `draft: true` in the front matter is removed or changed to `draft: false` before publication!

Once edited, when the PR is merged into the main branch, [GitHub Actions](https://github.com/rotationalio/rotational.io/actions) will automatically publish the blog to our website; it may take a few minutes but please keep refreshing the page to make sure the changes worked correctly.

If manual deployment is required (e.g. to publish a branch that is not main), you can use the following script:

```
$ ./bin/publish.sh
```

Please note that this will require all changes to be committed before using it.

## Data Playground

To add a new data source to the Data Playground, use the hugo new command as follows:

```
$ hugo new data-playground/$data-source-name.md
```

This will create a new file in the `content/en/data-playground/` directory that you may open and edit. When creating a new data source,, Hugo uses the `archetypes/data-playground.md` template file and generates the following frontmatter:

```
---
title: "New Data Source"
slug: "new-data-source"
subtitle: "Add Data Type Here" 
draft: true
image: img/data-playground/data-source-img.png
summary: "Add Summary To Display On List Page Here"
github_link: "https://github.com/rotationalio/[insert-link-here]"
description: "Add About This Data Source Description Here"
producer_name: "Add Producer Name Here"
producer_link: "https://producer-website.com"
data: "Add Details About the Data Provided Here"
is_account_required: false
license: "Add Data Source License Type Here (Ex. Free, Commercial)"
license_warning: Please review terms and conditions. Access to data sources can change.
is_api_key_required: false
api_type: "Add API Type(s) Provided Here and Separate Multiple Types With A Comma"
sdks: "Add Available SDKs Here and Separate Multiple SDKs With A Comma"
limits: "Add API Limit Information Here, If Available"

---
```

Next, update the following fields:
`subtitle`,
`image`,
`summary`,
`github_link`,
`description`,
`producer_name`,
`producer_link`,
`data`,
`is_account_required`,
`license`,
`is_api_key_required`,
`api_type`,
`sdks`,
`limits`

After updating the fields listed above, content added for the new data source should be added to the `static/index.json` file to update the search index.
To create an updated `static/index.json` file, use the following command:

```
$ yarn index
```

After running the command, you should see that the `static/index.json` file has been updated and should include the following for the new data source:
```
 {
        "uri": "/data-source-slug",
        "content": "Data source content",
        "tags": []
  },
```

Delete the JSON for `/_index` starting on line 2 of the `static/index.json` file. It should appears as follows:

```
    {
        "uri": "/_index",
        "content": "index content",
        "tags": []
    },
```

Once the new data source is updated and ready to be added to the website, be sure to change `draft` to `true`.
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