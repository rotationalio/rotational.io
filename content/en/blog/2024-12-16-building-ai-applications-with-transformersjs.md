---
title: "How to Build AI Applications In Minutes With Transformers.js"
slug: "how-to-build-ai-applications-in-minutes-with-transformersjs"
date: "2024-12-16T12:09:12-05:00"
draft: false
image: img/blog/2024-12-16-building-ai-applications-with-transformersjs/building-ai-applications-with-javascript.jpg
photo_credit: |
  Photo [Jeswin Thomas](https://unsplash.com/@jeswinthomas?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash") on [Unsplash](https://unsplash.com/photos/person-holding-black-and-white-audio-mixer-dfRrpfYD8Iw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash")
authors: ['Danielle Maxwell']
profile: img/team/danielle-maxwell.png
tags: ['AI', 'ML', 'JavaScript']
description: "Creating AI applications with JavaScript is easier than you think! Learn how to build an image to text app in five minutes with Transformers.js."
---

Creating AI applications is easier than ever these days, especially in JavaScript. Discover how you can build your own in only a few minutes with Transformers.js!

<!--more-->
> If you're more of a visual learner, click [here](https://youtu.be/nqRYT-FR0W4) to watch my talk for the Conf42 JavaScript conference on how to build AI applications with Transformers.js and TensorFlow.js.

### What is Transformers.js?
Transformers.js is a JavaScript library that provides the ability to run AI models in the browser. At the time of this writing, over 1,300 models are available for use and this number continues to grow each day.

With Transformers.js, it is also possible to [convert custom models](https://huggingface.co/docs/transformers.js/main/en/custom_usage#convert-your-models-to-onnx) developed with Python, JAX, or TensorFlow so that they may run in the browser.

Supported tasks currently include: 
- Natural Language Processing (ex. text classification and translation)
- Computer Vision (ex. image classification and object detection)
- Audio (ex. automatic speech recognition and text-to-speech)
- Multimodal (embeddings and zero-shot classification)

### What are the benefits of running AI models in the browser?

1. Reduces latency. Running AI models in the browser will improve speed as we will not need to send and receive data via API calls.

2. When models are on a user's device it allows them to get results without sending their data elsewhere which will greatly improve privacy.

3. Offers the ability to develop AI apps where users won't need an internet connection, like with Progressive Web Applications (PWAs).

### How to Build AI Applications in Minutes with Transformers.js
Let's build an application that will provide a text description of an uploaded image. For this example, we're going to to use the [Vit GPT2 Image Captioning model](https://huggingface.co/Xenova/vit-gpt2-image-captioning).

> When building your own application, [locate a model](https://huggingface.co/models) on Hugging Face. Filter the results by selecting the Transformers.js library and the task needed to develop your app.

Now that we know which model will be used, we'll need to initialize a pipeline function and pass in the task the model will handle. Hugging Face uses [pipelines](https://huggingface.co/docs/transformers.js/en/pipelines) to group together a pre-trained model with the preprocessing of inputs and postprocessing of outputs.

For this example, our task is "image-to-text". Then we're going to specify the model we've decided to use. If a model isn't passed into the pipeline function, Transformer.js, will select a default model for you. 

``` javascript
// Specify the task and model
const pipe = await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning")
```

Also, it is now possible to specify if the model should be run on GPU. Models are run on the CPU by default, so to use GPU instead, make the following change to the code:

``` javascript
const pipe = await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning", { device: "webgpu" })
```

Next up, we're going to get the uploaded image file and create an object URL.

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

Now, we can get a text description of the image from our model via the `getTextDescription` function and display in in the UI.

```javascript
async function getTextDescription(img) {
  status.textContent = "Generating text description...";
  const out = await pipe(img)
  let description = out[0].generated_text;
  textDescription.textContent = description[0].toUpperCase() + description.slice(1);
  status.textContent = "";
}
```

Add the script to your HTML file and style the page however you'd like. And just like that your app will be ready to deploy like any static web application.

Check out the complete code [here](https://huggingface.co/spaces/dmaxwell/retreat-2024/tree/main).

### Deploying With Hugging Face Spaces
For this example, I used Hugging Face's [Spaces feature](https://huggingface.co/spaces) to deploy the image-to-text application. Spaces looks similar to GitHub, but what makes it stand out is that it will automatically deploy your completed app so that it may be shared with others. If you use GitHub, it is possible to connect a repository to a Hugging Face Space.

Take a look at the final image to text app [here](https://huggingface.co/spaces/dmaxwell/retreat-2024) and test it out.