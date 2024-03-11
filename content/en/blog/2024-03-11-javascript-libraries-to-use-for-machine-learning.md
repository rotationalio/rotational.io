---
title: "5 Javascript Libraries to Use for Machine Learning"
slug: "5-javascript-libraries-to-use-for-machine-learning"
date: "2024-03-11T09:25:57-05:00"
draft: false
image: img/blog/2024-03-11-javascript-libraries-to-use-for-machine-learning/5-javascript-libraries-to-use-for-machine-learning.webp
photo_credit: "Photo by [Prateek Katyal](https://unsplash.com/@prateekkatyal) on [Unsplash](https://unsplash.com/photos/piled-books-on-brown-wooden-shelf-_YzGQvASeMk)"
authors: ['Danielle Maxwell']
profile: img/team/danielle-maxwell.png
tags: ['ML', 'NLP', 'Neural Networks', 'JavaScript']
description: "Get to know 5 JavaScript libraries you can use for machine learning."
---

Over the years, several JavaScript libraries have been created for machine learning. Let's sort through the ones that can help you get started quickly, even if you don't have much experience with machine learning or data science.

<!--more-->

Before getting to the list, I should note that it was difficult to narrow it down to 5. There were many libraries to choose from, but I wanted to focus on a diverse set of tools that I believe are also developer friendly.

### [TensorFlow.js](https://www.tensorflow.org/js)

TensorFlow.js is quite possibly the most well known JavaScript machine learning library. [First announced by Google in 2018](https://blog.tensorflow.org/2018/03/introducing-tensorflowjs-machine-learning-javascript.html), TensorFlow.js allows for the development of machine learning models in JavaScript via the browser or Node.js. Developers can work with existing models and also import their own.

If you’re in need of a little inspiration for working with TensorFlow.js, check out this [playlist](https://www.youtube.com/playlist?list=PLQY2H8rRoyvzSZZuF0qJpoJxZR1NgzcZw) of what others have built with it. 

### [Brain.js](https://brain.js.org/#/)

Want to train your own model? Look no further than Brain.js. After installing the library, you can train a model in just a few lines of code. Once you have your dataset, follow one of their [examples](https://brain.js.org/#/examples) and get going in no time.

Brain.js allows for training data to be saved and serialized to JSON. This could be useful if you need to add data and retrain a model.

### [Danfo.js](https://danfo.jsdata.org/) 

This library was built to make data manipulation and processing easier in JavaScript. Danfo.js can be used in the browser, with client-side libraries such as React, and in Node.js environments.

Danfo.js was [built on TensforFlow.js](https://dev.to/dminor/intoduction-to-danfo-js-44j6), which allows for dataframes to be converted into tensors and vice versa. Another benefit of using the library is how easy it is to remove or fill in missing data.

If you’re familiar with using Python’s [pandas](https://pandas.pydata.org/) library, you may notice some similarities since Danfo.js was modeled after pandas. 


### [ml.js](https://github.com/mljs/ml) 

Need to work with classification and regression algorithms for your next machine learning project? ml.js has got you covered. 

They’ve even compiled all of their machine learning and numerical analytics tools into the ml.js library which is currently recommended for use in the browser.

Should you need to work with one of their tools in Node.js, it is recommended to install dependencies individually. Check out all of their [repositories here](https://github.com/mljs) to get started.

### [winkJS](https://github.com/winkjs)

Though more of a collection of libraries, I could not leave out winkJS. This compilation of open source libraries makes it possible to easily work with Natural Language Processing (NLP), machine learning, and statistical analysis in JavaScript either in the browser or Node.js.

The most popular library, [winkNLP](https://winkjs.org/wink-nlp/) 
> has a comprehensive natural language processing (NLP) pipeline covering tokenization, sentence boundary detection (sbd), negation handling, sentiment analysis, part-of-speech (pos) tagging, named entity recognition (ner), custom entities recognition (cer).

Another great thing about winkNLP is that it has full support for TypeScript.

### Build Machine Learning Projects with JavaScript
I hope this list has inspired you to use one of or all of these tools while working on your next machine learning project. If there's a JavaScript library that you think should be on this list, let me know!