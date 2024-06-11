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

An increasing amount of JavaScript libraries are available to perform machine learning tasks in Node.js or in the browser. Of particular interest is winkJS. A library designed to help perform Natural Language Processing (NLP) tasks. Let’s look further into how it works and what it can do.

<!--more-->

## What is winkJS?
In a previous blog post on machine learning libraries written in JavaScript, the collection created by winkJS was mentioned. Of particular interest is the winkNLP library which can assist in performing covering tokenization, sentence boundary detection (sbd), negation handling, sentiment analysis, part-of-speech (pos) tagging, named entity recognition (ner), custom entities recognition (cer).


## Who should use winkJS?
A great thing about this library is how beginner friendly it is. Whether you’re new to machine learning or JavaScript, there several methods that make development a breeze. Not only that, but there are a couple of built in helpers its and as. When combined with a property name, these 2 helpers can do a lot.

## Keep Going...
Want to get the type for each character in a text collection? Use its.type and get an array specifying the type for each token.

Want to remove stop words? There’s its.stopWordFlag which will return an array of bool values for each token. From there, you can use plain old JavaScript to remove any stop words.

its.pos will provide the part-of-speech for each token in an array of strings.
its.sentiment will provide a score between -1 and 1. (How is sentiment calculated?)
its.readabilityStats will return the Flesch Reading Ease Score, sentiment score, reading time, a list of complex words, and more.

The as helper can reduce tokens to Bigrams with the as.bigrams argument, create a frequency table with as.freqTable and convert a collection to a set in JavaScript with as.set.

What you really want to see is how this works, right? So, let’s get to the code.

## Let’s Code!

I've created a quick demo that returns the readability stats and sentiment analysis for a text input. In addition, all complex words are then highlighted on the page.

First up, we'll have to install the winkNLP package and the wink-eng-lite-web-model. winkJS offers another model (wink-eng-lite-model), but it's not recommended for use with browsers or Node.js versions lower than v16. I won't judge, but if you're using a version of Node.js that's lower than v16, I highly recommend updating to a later version.

```
$ npm or yarn install wink-nlp --save
$ npm or yarn install wink-eng-lite-web-mode --save
```

For this demo, I used winkNLP in the browser which requires the use of a bundler. I decided to use browserify, so if you're following along, be sure to install that as well or the bundling tool of your choice.

```
$ npm or yarn install install browserify
```

Next, load the installed packages and pass in the model to the nlp helper.

```javascript
const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);
```

This will now allow us to access the its and as helpers.

```javascript
const its = nlp.its;
// const as = nlp.as (As wasn't used in this demo. Here's how it can be accessed.)
```

In an index.html file, add a form with an input or text area along with a section to display the readability stats. Then let's go ahead and access those elements by assigning them below.


```javascript
const text = document.getElementById('text-input')
const submitBttn = document.getElementById('text-submit-bttn')
const results = document.getElementById('result')
const resultText = document.getElementById('result-text')
```

Let's now get the text submitted via the form and use its.readability stats to perform a quick analysis. The readability stats will be returned in an object.

```javascript
// Get text from the input field.
submitBttn.addEventListener('click', (e) => {
  e.preventDefault()
  const textInput = text.value

  // Pass text as an argument to the readDoc method to create a new collection.
  const doc = nlp.readDoc(textInput);

  // Get readability stats for the text input.
  const readabilityStats = doc.out(its.readabilityStats);

  // Insert the readability stats into the DOM.
  results.insertAdjacentHTML('afterbegin', `
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
})
```

We're looking good so far. Now, we want to highlight the complex words inside the readabilityStats object. Let's push all of the complex words to an empty array. Split the words in the text input into an array. This will allow us to compared each word in the text input against the complexWordsList array. 

If there's a match, we will wrap the complex word in a span element and let's give it a class of complex word so that we can change the background color with a little CSS. Once the loop is complete, join the text and then insert it into the DOM.

```javascript
const complexWords = readabilityStats.complexWords
  let complexWordsList = []
  for (let word in complexWords) {
    // Add the complex word to the complexWordsList array.
    complexWordsList.push(word)
  }

  const textList = textInput.split(' ');
  textList.forEach((word, idx) => {
    if (complexWordsList.includes(word)) {
      textList[idx] = `<span class="complex-word">${word}</span>`
    }
  })

  const modifiedText = textList.join(' ');
  resultText.innerHTML = modifiedText;
```

And we're done! Take a look at the short video below to see how the app works. You may find the complete code at my GitHub.

<img src="img/blog/2024-06-10-performing-nlp-in-javascript/wink-nlp-demo.gif" style="margin: 0 auto" />

## Wrap Up
Now we see a few quick and easy way to use the winkNLP library created by winkJS. To expand on this demo, we could highlight the various parts-of-speech in the text. We could change the background based on the sentiment score or go further and allow users to input more than one text input and return a similarity score.

Be sure to check out the documentation here for even more ways to use winkNLP.



