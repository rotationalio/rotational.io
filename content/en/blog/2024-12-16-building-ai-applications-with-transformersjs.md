---
title: "Build AI Applications In Minutes With Transformers.js"
slug: "building-ai-applications-with-transformersjs"
date: "2024-12-16T12:09:12-05:00"
draft: false
image: img/blog/2024-12-16-building-ai-applications-with-transformersjs/building-ai-applications-with-javascript.jpg
photo_credit: |
  Photo [Jeswin Thomas](https://unsplash.com/@jeswinthomas?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash") on [Unsplash](https://unsplash.com/photos/person-holding-black-and-white-audio-mixer-dfRrpfYD8Iw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash")
authors: ['Danielle Maxwell']
profile: img/team/danielle-maxwell.png
tags: ['AI', 'ML', 'JavaScript']
description: "Creating AI applications with JavaScript is easier than you think! Learn how to build and deploy your first one in minutes with Transformers.js."
---

Creating AI applications is easier than ever these days, especially in JavaScript. Discover how you can build your own in only a few minutes with Transformers.js!

<!--more-->
### What is Transformers.js?
Transformers.js is a library that provides the ability to run AI models in the browser. It uses the ONNX runtime to convert Hugging Face's Python models so that they may be used with JavaScript.

Currently, over 1,300 models are available for use. Supported tasks include: 
- Natural Language Processing 
- Computer Vision
- Audio
- Multimodal

It is also possible to convert custom models developed with Python, JAX, or TensorFlow. You may read more about that [here](https://huggingface.co/docs/transformers.js/main/en/custom_usage#convert-your-models-to-onnx).

### ML on the Browser Benefits
What are the benefits of running AI models in the browser?
- Lower latency. Speed has always been important and being able to reduce the need to make API calls by allowing users to run AI models on their device will greatly improve that.

- Models on device allow users to get results without sending their data to another location. This greatly improves privacy for your users.

- Ability to develop apps where users won't need an internet connection. This is especially useful when working with progressive web apps

### How to Build AI Applications in Minutes
Let's build an application that will create a text description of an uploaded image. For this example, we're going to to use the [Vit GPT2 Image Captioning model](https://huggingface.co/Xenova/vit-gpt2-image-captioning).

When building your own application, [locate a model](https://huggingface.co/models) on Hugging Face. Filter the results by selecting the Transformers.js library and the task needed to build your app.

Now that we know which model will be used, we'll need to call the pipeline API.

``` javascript
// Specify the task and model
const pipe = await pipeline("image-to-text", 'Xenova/vit-gpt2-image-captioning')
```

We'll have to specify the task, but if the model isn't Transformer.js will select a default model for you.

Nex up, we're going to get the uploaded image and convert it to an object URL.

```javascript
// Listen for image upload
imageUpload.addEventListener("change", async (e) => {
    const image = e.target.files[0];

    if (!image) {
      return errorMsg.textContent = "The uploaded file is not an image. Please try again.";
    }
    
    if (image.type === "image/svg+xml") {
      return errorMsg.textContent = "SVG images are not supported. Please try again.";
    }

    imageContainer.innerHTML = "";
    let imgURL = URL.createObjectURL(image);
    const imageEl = document.createElement("img");
    imageEl.src = imgURL;
    imageContainer.appendChild(imageEl);
    textDescription.textContent = "";
    getTextDescription(imgURL);
});
```

We then get the text description from the image to text model via the `getTextDescription` function.

```javascript
async function getTextDescription(img) {
  status.textContent = "Generating text description...";
  const out = await pipe(img)
  let description = out[0].generated_text;
  textDescription.textContent = description[0].toUpperCase() + description.slice(1);
  status.textContent = "";
}
```

Add the script to your HTML file and style it however you like. You may then deploy it as you would any static app.

For this example, I used Hugging Face's [Spaces feature](https://huggingface.co/spaces). Spaces is similar to a remote repository like GitHub where you may store your code. Even better, a UI will automatically be deployed that you may share with others. 

It's also possible to store your code in GitHub and then connect it to a Space.

Take a look at the UI for the image to text app [here](https://huggingface.co/spaces/dmaxwell/retreat-2024) and test it out.

If you're more of a visual learner, watch me talk about building this application with Transformers.js along with one for the Conf42 JavScript conference [here](https://youtu.be/nqRYT-FR0W4).


