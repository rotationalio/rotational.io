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
authors: Your Name
description : "Add Description Here"
---
```

The next steps are as follows:

1. Update the `authors` and `description` fields.
2. Find a blog image from [Unsplash](https://unsplash.com/collections/63030615/rotational-website) and add to `image_webp` and `image` fields.
3. Write the blog post!

## Author

To create a new author, use the [`hugo new`](https://gohugo.io/commands/hugo_new/#readout) command as follows:

```
$ hugo new authors/firstname-lastname/_index.md
```

> **NOTE**: ensure that these commands are run in the root of the project.

This will create a new file in the `content/en/authors` directory (English is the default language for our site) that you can open and begin to edit. When creating new author, Hugo uses the `archetypes/authors.md` template file and generates the following [frontmatter](https://gohugo.io/content-management/front-matter#readout):

```
---
title: "Your Name"
name: "Your Name"
slug: "firstName-lastName"
profile: img/team/firstName-lastName.png
designation : Your Job Title
field: Your Specialty
social :
  - name : "linkedin"
    link: 'Link to Your LinkedIn Profile'
    icon: 'fa-linkedin-in'
  - name : "twitter"
    link : "Link to Your Twitter Profile"
    icon: 'fa-twitter'
  - name : "github"
    link: 'Link to Your GitHub Profile'
    icon: 'fa-github'
---

<!--Write a brief 1-2 sentence bio/personal description below-->

```

The next steps are as follows:

1. Add your image link to the `profile` field.
2. Update the `designation` and `field` fields with your function at Rotational.
3. Add your `social` media profile `link` for LinkedIn, Twitter, and GitHub.
4. Write a brief description about yourself.

**Note**: If you would like to not include any social media links, delete the entire `social` field. If you would like to not include a link to a specific social media site, delete the `name`, `link`, and `icon` fields.

## hugo new command

"hugo new" command is used to create content…

If you type "hugo new example.md" the file created will be directly located in the root of the "content" folder.

According to archetypes and their content folder, you can use "hugo new archetype-content-folder/your-file.md" to create
a specific file

e.g:  $ hugo new blog/YYYY-MM-DD-title-of-blog.md  "to create blog post"
        Or
      $ hugo new authors/firstname-lastname/_index.md  "to create a new author".


Can be useful: you can create blog subfolder by typing :

       $ hugo new blog/subfolder/YYYY-MM-DD-title-of-blog.md

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
diagram_image:
diagram_alt:
weight:
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
`limits`,
`diagram_image`,
`diagram_alt`,
`weight`

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

## Case Studies

To add a new case study page, use the hugo new command as follows:

```
$ hugo new case-studies/case-study-name.md
```

This will create a new file in the `content/en/case-studies/` directory that you may open and edit. When creating a new data source,, Hugo uses the `archetypes/case-studies.md` template file and generates the following frontmatter:

```
---
title: "New Case Study"
slug: "new-case-study"
headertext: Case Studies
subheadertext: "Real Results: AI in Action"
industry: "Add client's industry here"
service: "Add service type here"
case:
  - title: Problem
    description: "Describe problem here"
  - title: Solution
    description:" Describe solution here"
  - title: Results
    results:
      - result: "Describe result here"
      - result: "Describe result here"
real_results:
  tagline: Innovate or Stagnate
  title: Real Results
  description: "Describe results in more detail here"
  approach: "Describe Rotational's approach to solve client's problem"
  result: "Describe result after providing solution to client's problem"
---
```

Next, update the following fields:
`industry`,
`service`,
below the `case` field update the following:
`description`,
`result`,
below the `real_results` field, update the following
`description`,
`approach`,
`result`

By default, 2 results are listed below the `results` field:
```
results:
  - result:
  - result:
```

This will display 2 bullet points in the `Results` box on a case study page. If only 1 bullet point will be included, delete one of the `- result` fields. To display more bullet points, add a `- result` field.

## Learning Page

The learning page is a collection of our webinars, conference talks, and other appearances that are available online. To add a resource to the learning page use the hugo new command as follows:

```
$ hugo new learning/learning-resource-name.md
```

This will create a new file in the `content/en/learning` directory. When using the new command, Hugo uses the `archetypes/learning.md` template file to generate the following frontmatter:

```
---
title: "Learning Resource Name"
slug: "learning-resource-name"
draft: false
event_date: "2023-12-22"
image: "img/resources/event-image.png"
name: "Write the name or title of the event"
description: "Write the event's description"
events: ['Podcast', 'Webinar', 'Conference Talk']
registration_link: https://link-to-register-for-event.com
call_to_action: "Write call to action for upcoming event"
video_link: youtube.com/link-to-video
audio_link: https://link-to-audio-source.com
categories: ['Video', 'Audio']
presenters: ['Presenter Name 1', 'Presenter Name 2']
topics: ['Add Topic 1 Here', 'Add Topic 2 Here']
photo_credit: "Add photo credit"
---
```
Next, update the fields in the frontmatter.

**NOTE** After creating a new learning resource with the hugo new command, the `slug` for the learning page on the website will be the same as the `learning-resource-name` used when creating a new learning resource. For example, `https://rotational.io/learning/learning-resource-name`. If a different `slug` should be used, it should be updated in the frontmatter.

Depending on the type of learning resource added, some of the fields may be optional, such as `registration_link`, `call_to_action`, `video_link`, and `audio_link`.

1. If the `event_date` is in the future and has a `registration_link`, include the time of the event in the field, `2024-01-16T12:00:00-05:00`. This will display a button with text from the `call_to_action` field encouraging users to register for an event. However, if the event occurred in the past or will not have a registration link, the date may be listed without the time, `2024-01-16`.

2. If the learning resource's `description` will have multiple lines, the [YAML syntax for multiline strings](https://yaml-multiline.info/) should be used.

Below is an example of a `description` with multiple lines:

```
description: |
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
```

If the description has multiple lines and you see an error or the text appears in a `red` color, try indenting the text by using the `tab` button. This should resolve the issue.

3. List the event type in the `events` field.

4. If a learning resource has a video that is on YouTube, use the embed link. To locate this link, go to the video's page on YouTube. 
Then select `Share`. 
Click the `Embed` option.
You should then see the info similar to the following:

```
<iframe width="560" height="315" src="https://www.youtube.com/embed/youtube-video" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
```

Copy the link that appears after `src=` and use it for the `video_link` field.

5. Update the `categories` field with the learning resource's media type.

6. Update the `presenters` field with the name of any staff featured in the learning resource.

7. Update the `topics` field with any topics that could provide more detail about the learning resource. This is similar to the `tags` listed in a `blog` post.

**NOTE**: Make sure that the `draft: true` in the front matter is removed or changed to `draft: false` before publishing a learning resource.

## Installing a specific Hugo version on MacOS

[Hugo Version Manager](https://github.com/jmooring/hvm) is a tool that helps you download, manage, and switch between different versions of Hugo.

Step 1 - Install the executable

```
go install github.com/jmooring/hvm@latest
```

Step 2 - Install the Hugo version you are interested in

```
hvm use <insert version here> (e.g. v0.138.0+extended+withdeploy)
```

Step 3 - Add the hvm location to the $PATH variable in your bash_profile. Make sure to run `source ~/.bash_profile` afterwards!  The following is an example:

```
export PATH="/Users/prema/Library/Caches/hvm/default:$PATH"
```

You should be able to see the installed package when you run `hugo version`.

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