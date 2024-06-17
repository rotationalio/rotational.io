---
title: "NLP with Javascript Using winkJS"
slug: "nlp-with-javascript-using-winkJS"
date: "2024-06-10T16:06:03-04:00"
draft: false
image: img/blog/2024-06-10-performing-nlp-in-javascript/machine-learning-robot.webp
photo_credit: "Image by [fszalai](https://pixabay.com/users/fszalai-32964329/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7770312) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7770312)"
authors: ['Danielle Maxwell']
profile: img/team/danielle-maxwell.png
tags: ['JavaScript', 'NLP']
description: "Use the JavaScript machine learning library winkJS to make Natural Language Processing (NLP) beginner friendly."
---

winkJS is a collection of open source libraries, created by [Graype Systems](https://graype.in/), designed to make Natural Language Processing (NLP), machine learning, and statistical analysis accessible in JavaScript. Let's take an in-depth look into their winkNLP library and how it can be a handy tool for developers, including those who are new to machine learning.

<!--more-->

## What is winkNLP?
In a blog post about [machine learning libraries written in JavaScript](/blog/5-javascript-libraries-to-use-for-machine-learning/), the winkNLP library by winkJS was recommended. It has a multilingual tokenizer, can work with sentence boundary detection (sbd), perform sentiment analysis, and provide part-of-speech tagging out the box. The library has additional tools that can provide a Flesch reading score, measure similarity, flag stop words, and so much more.

## How does it work?
winkNLP has a readDoc method where text passed to it may be split into tokens, sentences, or entities. It's possible define entities by using the learnCustomEntities method. Once the text is divided up, it can be accessed by the **its** or **as** helpers to make development a breeze.

Want to get the type for each character in a text collection? Use its.type and get an array specifying the type for each token.

Need to create a frequency table for sentences, tokens, or entities? as.freqTable will return a frequency table in descending order.

winkNLP also includes a vector tool that uses BM25 algorithm to compute weights for terms. If necessary, the vectorizer's default configuration can be updated.

## Let’s Code!
A major highlight of using winkNLP is how beginner friendly it is. Though I'm not the most experienced with NLP, I was able to create a quick demo that returns readability stats (Flesch reading score, sentiment, reading time, and complex word count) for a text input and highlights all of the complex words.

To get started, we'll have to install the winkNLP package and the wink-eng-lite-web-model. Another model is available (wink-eng-lite-model), but it's not recommended for use with browsers or Node.js versions lower than v16. No judgement here, but if you're using a version of Node.js that's lower than v16, I highly recommend updating to a later version.

```
$ npm or yarn install wink-nlp --save
$ npm or yarn install wink-eng-lite-web-mode --save
```

For this demo, I used winkNLP in the browser which requires the use of a bundler. I decided to use browserify, so if you're following along, be sure to install that as well or the bundling tool of your choice.

```
$ npm or yarn install install browserify
```

Next, load the installed packages and pass the model to the nlp helper.

```javascript
const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);
```

This will now allow us to access the its and as helpers.

```javascript
const its = nlp.its;
// const as = nlp.as (as wasn't used in this demo. Here's how it can be accessed.)
```

In an index.html file, add a form with an input or text area along with a section to display the readability stats. Then let's go ahead and access those elements by assigning them below.


```javascript
const text = document.getElementById('text-input');
const submitBttn = document.getElementById('text-submit-bttn');
const readingStats = document.getElementById('reading-stats');
const highlightedText = document.getElementById('highlighted-text');
```

Let's now get the text submitted via the form and use its.readability stats to perform a quick analysis. The readability stats will be returned in an object.

```javascript
// Get text from the input field.
submitBttn.addEventListener('click', (e) => {
  e.preventDefault();
  const textInput = text.value;

  // Pass text as an argument to the readDoc method to create a new collection.
  const doc = nlp.readDoc(textInput);

  // Get readability stats for the text input.
  const readabilityStats = doc.out(its.readabilityStats);

  // Insert the readability stats into the DOM.
  readingStats.insertAdjacentHTML('afterbegin', `
  <h2>Readability Stats</h2>
  <ul>
    <li>Flesch Reading Ease Score: ${readabilityStats.fres}</li>
    <li>
      Reading Time: ${readabilityStats.readingTimeMins} minutes 
      and ${readabilityStats.readingTimeSecs} seconds
    </li>
    <li>Sentiment: ${readabilityStats.sentiment}</li>
    <li>Word Count: ${readabilityStats.numOfWords}</li>
    <li>Sentence Count: ${readabilityStats.numOfSentences}</li>
  </ul>
`);
});
```

We're looking good so far. Now, we want to highlight the complex words inside the readabilityStats object. Let's push all of the complex words to an empty array. Split the words in the text input into an array. This will allow us to compared each word in the text input against the complexWordsList array. 

If there's a match, we will wrap the complex word in a span element and let's give it a class of complex word so that we can change the background color with a little CSS. Once the loop is complete, join the text and then insert it into the DOM.

```javascript
const complexWords = readabilityStats.complexWords;
  let complexWordsList = [];
  for (let word in complexWords) {
    // Add the complex word to the complexWordsList array and make it lowercase to handle case insensitivity.
    complexWordsList.push(word.toLowerCase());
  };

  const textList = textInput.split(' ');
  textList.forEach((word, idx) => {
     // Remove any special characters from a word.
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (complexWordsList.includes(word)) {
      textList[idx] = `<span class="complex-word">${word}</span>`
    };
  });

  const modifiedText = textList.join(' ');
  highlightedText.innerHTML = modifiedText;
```

And we're done! If you followed these instructions, you'll need to user the bundler to view the app locally. Run the following command, if you used browserify, or the one for your bundling tool of choice.
```
browserify index.js -o bundle.js
```

Take a look at the short video below to see how the app works. You may find the complete code at my [GitHub](https://github.com/daniellemaxwell/wink-nlp-example).

<img src="img/blog/2024-06-10-performing-nlp-in-javascript/wink-nlp-demo.gif" style="margin: 0 auto" />

## Wrap Up
Now you see how easy it is to get started with using NLP in JavaScript with the winkNLP library created by winkJS. To expand on this demo, we could change the background based on the sentiment score or go further and allow users to input more than one text input and return a similarity score.

If you've created an app with winkNLP or become inspired after reading this post, let me know.



