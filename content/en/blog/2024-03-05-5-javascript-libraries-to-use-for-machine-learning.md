---
title: "5 Javascript Libraries to Use for Machine Learning"
slug: "5-javascript-libraries-to-use-for-machine-learning"
date: "2024-03-05T13:25:57-05:00"
draft: false
image: img/blog/2024-03-05-5-javascript-libraries-to-use-for-machine-learning/5-javascript-libraries-to-use-for-machine-learning.webp
photo_credit: "Photo by [Prateek Katyal](https://unsplash.com/@prateekkatyal) on [Unsplash](https://unsplash.com/photos/piled-books-on-brown-wooden-shelf-_YzGQvASeMk)"
authors: ['Danielle Maxwell']
profile: img/team/danielle-maxwell.png
tags: ['ML', 'NLP', 'Neural Networks', 'JavaScript']
description: "Get to know 5 JavaScript libraries you can use for machine learning."
---

I’d say it’s well documented that Python and machine learning go together like babies and pacifiers. But what about other programming languages, such as JavaScript?

<!--more-->

Though several JavaScript libraries have been created for machine learning, several have been deprecated or aren't actively maintained. To keep this list from getting too long, I decided to focus on 5 developer friendly tools that can help you get started rather quickly even if you don't have much experience with machine learning or data science.

Before digging into the 5 JavaScript libraries for machine learning that I think you should use, let’s consider why we may want to use JavaScript in the first place.

### Why use JavaScript for Machine Learning


### [TensorFlow.js](https://www.tensorflow.org/js)

TensorFlow.js is quite possibly the most well known JavaScript machine learning library. [First announced by Google in 2018](https://blog.tensorflow.org/2018/03/introducing-tensorflowjs-machine-learning-javascript.html), TensorFlow.js allows for the development of machine learning models in JavaScript. Developers can work with existing pre-trained models or even import their own.

If you’re in need of a little inspiration for working with TensorFlow.js, check out this [playlist](https://www.youtube.com/playlist?list=PLQY2H8rRoyvzSZZuF0qJpoJxZR1NgzcZw) of what others have built with it. 

### [Brain.js](https://brain.js.org/#/)

Want to create your own neural network in JavaScript? Look no further than Brain.js. What makes this library worth looking into is how easy it is to get started, especially if you don’t have a lot of machine learning experience.

After looking at a [few examples](https://brain.js.org/#/examples), you should be able to train a model pretty quickly with any dataset.


### [Danfo.js](https://danfo.jsdata.org/) 

This library was built to make data manipulation and processing easier in JavaScript. Danfo.js can be used in the browser, with client-side libraries such as React, and in Node.js environments.

Danfo.js was [built on TensforFlow.js](https://dev.to/dminor/intoduction-to-danfo-js-44j6), which allows for dataframes to be converted into tensors and vice versa. Another benefit of using the library is how easy it is to remove or fill in missing data.

If you’re familiar with using Python’s [pandas](https://pandas.pydata.org/) library, you may notice some similarities since Danfo.js was modeled after pandas. 


### [ml.js](https://github.com/mljs/ml) 

Need to work with classification and regression algorithms for your machine learning project? ml.js has got you covered. They’ve even compiled all of their machine learning and numerical analytics tools into the ml.js library which is currently recommended for use in the browser.

Should you need to work with one of their tools in Node.js, it is recommended to install dependencies individually. Check out all of their [repositories here](https://github.com/mljs) to get started.

### [winkJS](https://github.com/winkjs)

Though more of a collection of libraries, I would be remiss to leave out winkJS. This compilation of open source libraries makes it possible to easily work with Natural Language Processing (NLP), machine learning, and statistical analysis in JavaScript. The [winkNLP library](https://winkjs.org/wink-nlp/) “has a comprehensive natural language processing (NLP) pipeline covering tokenization, sentence boundary detection (sbd), negation handling, sentiment analysis, part-of-speech (pos) tagging, named entity recognition (ner), custom entities recognition (cer).”

winkNLP also has full TypeScript support, may be used in the browser or Node.

