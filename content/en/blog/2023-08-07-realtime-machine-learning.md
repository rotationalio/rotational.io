---
title: "How companies can accelerate time to insight by leveraging models that train on the fly"
slug: "realtime-machine-learning"
date: "2023-08-07T21:12:02-04:00"
draft: true
image: img/blog/2023-08-11-realtime-machine-learning/bird-fly-unsplash.jpg
photo_credit: Photo by Navi on Unsplash
author: Prema Roman
profile: img/team/prema-roman.png
category: NLP, AI/ML, Eventing
description: "It's time to rethink how machine learning is done.  Switching to real-time machine learning enables companies to easily adapt in a world where change is the only constant."
---

In a world where more business is being conducted online and more people are spending time online, companies that have adopted online (aka real-time) machine learning have achieved better ROI on their data.  Unlike batchwise machine learning models, which are trained on a batch of data, and then no longer learn once deployed, real-time models continually learn on new data as soon as they arrive, which means that these models are less susceptible to concept drift and data drift.

<!--more-->

Let’s take YouTube as an example. Imagine that a user has been watching cat videos for a while because they recently bought a cat. YouTube will show similar cat videos the next time the user logs in. Soon thereafter, the user starts to search for videos on Python programming because they are interested in getting a job as a software developer. YouTube then starts to show videos on Python programming but also shows some cat videos because the user had recently watched cat videos. Over time the videos displayed on YouTube change based on what the user searched for and what the user watched.

A model that was trained on batch data is "frozen" at a point in time. Imagine if that model were deployed at the time the user had been mainly interested in cat videos. It would not have made the switch to Python programming videos when the user’s preferences changed. In a scenario like this, the user may not enjoy their experience any more and may decide to leave and find an alternative service.

Using real-time models can also lower operational costs by reducing infrastructure costs and manual retraining efforts.  Since real-time models learn from one data element at a time, there is no need for expensive hardware with a lot of memory.  The other benefit is that since the model is continually learning (and in effect re-training) on new information as it arrives, there is no need for a team to constantly retrain on new batches, test and compare, and finally swap out models during each retraining cycle.

This post covers two open source libraries that are designed for building real-time models: **Vowpal Wabbit** and **River**.

**Vowpal Wabbit** is a library that was co-sponsored by Microsoft Research and Yahoo Research.  In addition to real-time versions of traditional classification and regression models, it also has models for reinforcement learning and active learning.  One of Vowpal Wabbit’s core features is the use of hashing trick as an alternative to one-hot encoding for categorical variables.  The hashing trick algorithm hashes the feature name and the feature value in order to reduce the memory footprint and eliminates the need to know all the possible values for a categorical feature ahead of time.  The added benefit here is that for NLP tasks, the text features can be hashed and their hash values can be stored as indices directly in a vector rather than looking the indices up in a multi-dimensional array.  The drawback of the algorithm is that collisions can occur, but [experiments](https://booking.ai/dont-be-tricked-by-the-hashing-trick-192a6aae3087) have shown that the effect of collisions on prediction accuracy is low.

**River** was born out of a merger between two other open source libraries: [creme](https://github.com/MaxHalford/creme) and [scikit-multiflow](https://github.com/scikit-multiflow/scikit-multiflow).  River also offers a suite of models for regression, classification, and reinforcement learning, among others.  It also has algorithms specifically designed for drift detection. Unlike Vowpal Wabbit, River’s focus has been more on clarity and usability rather than performance.  One can argue, however, that performance is generally not a major concern when a model needs to learn on only one data element at a time.  River also has utilities for tasks that are useful in a streaming context such as calculating running averages.  Data is fed to the models in the form of dictionaries, which was a decision made by the creators of the library as they have excellent support in Python and can easily be converted to JSON payloads, which are widely used in web and streaming applications.


## Building a Sentiment Analysis Application

Now that we have the basics covered, let’s take a look at how to use these libraries on a sentiment analysis task on Yelp review data.  While the data that is used are in csv files, the code simulates a workflow that is streaming in nature by reading in one record at a time.  It can easily be replaced by consuming data from a real-time API.  The streaming engine used here is [PyEnsign](https://github.com/rotationalio/pyensign), which is a real-time data platform for building streaming data solutions.  The full source code is available [here](https://github.com/rotationalio/online-model-examples). 

Let's start with Vowpal Wabbit.


### Sentiment Analysis with Vowpal Wabbit
First, we need to convert the text and labels to a format that is compatible with the library. The labels and features are separated by a pipe(`|`).  The function to do this is as follows:

```python
def to_vw_format(document, label=None):
    return str(label or '') + ' |text ' + ' '.join(re.findall('\w{3,}', document.lower())) + '\n'
```

Check out this detailed [tutorial](http://www.philippeadjiman.com/blog/2018/04/03/deep-dive-into-logistic-regression-part-3/) on how to customize it for your project.

Next, we will initialize the Vowpal Wabbit model.
```python
self.model = vowpalwabbit.Workspace("--loss_function=logistic --bit_precision=28 --ngram=3 --binary --quiet")
```

We are solving a binary classification problem and will use the logistic loss function to calculate the error rate.  Take a look at other loss functions that can be used in Vowpal Wabbit [here](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Loss-functions).  The bit precision argument specifies the number of bits to use for hashing.  We are also going to be feeding trigrams to the model (ngram=3).  The `—-quiet` argument suppresses output.

We will then load the `yelp_train.csv` file and loop through the records to start the training process.  Note that for binary classification problems, the labels need to be -1 and 1, and so we will replace 0 with -1.  

Unlike traditional batchwise models where we call `fit` first and then `predict`, a real-time model reverses that paradigm by calling `predict` first on data that it hasn’t seen and then after it receives the label for that data, it learns from the data and updates its weights.  Let’s see how that works with the following code.  Note that `record` is a dictionary object that contains the text and labels.

```python
record = json.loads(event.data)
text = record["text"]
# convert the text to vw format (only pass in the text here 
# and see how vw predicts)
train_instance = to_vw_format(text)
y_pred = int(self.model.predict(train_instance))
self.preds.append(y_pred)
label = record["sentiment"]
self.labels.append(label)
# the precision and recall won't be great at first, but as the model 
# learns on new data, the scores improve 
precision = precision_score(self.labels, self.preds, pos_label=-1, average="binary", zero_division=np.nan)
print(f"Precision: {precision}")
recall = recall_score(self.labels, self.preds, pos_label=-1, average="binary", zero_division=np.nan)
print(f"Recall: {recall}")
# pass the text and label this time so that the model can learn from the example
learn_instance = to_vw_format(text, label)
self.model.learn(learn_instance)
```

Next, let's take a look at how to implement the application in River.

### Sentiment Analysis with River

We will first initialize the model and metrics.  The model is a Multinomial Naive Bayes classifier that is wrapped in a Pipeline object with a Bag of Words vectorizer.  In order to evaluate the model, we will initialize a classification report, confusion matrix, as well as precision and recall metrics that will get updated with each training sample.  As long as the classes are specified, there is no need to convert the class labels as we did for Vowpal Wabbit.

```python
self.model = Pipeline(('vectorizer', BagOfWords(lowercase=True)),('nb', MultinomialNB()))
self.confusion_matrix = metrics.ConfusionMatrix(classes=[0,1])
self.classification_report = metrics.ClassificationReport()
self.precision_recall =  metrics.Precision(cm=self.confusion_matrix, pos_val=1) + metrics.Recall(cm=self.confusion_matrix, pos_val=1)
```

Just like with Vowpal Wabbit, we will first call `predict_one` on the text and then call `learn_one` with the text and label.  Since we have the labels, we can also update the metrics and print the precision and recall scores after each update.

```python
y_pred = self.model.predict_one(record["text"])
if y_pred is not None:
    self.confusion_matrix.update(y_true=record["sentiment"], y_pred=y_pred)
    self.classification_report.update(y_true=record["sentiment"], y_pred=y_pred)
 print(self.precision_recall)
 self.model = self.model.learn_one(record["text"], record["sentiment"]) 
```

## Final Thoughts

There are a lot of similarities between Vowpal Wabbit and River.  Both use the `predict` first, then `learn` approach to machine learning and learn from one example at a time.  As the code demonstrates, there is no need to retrain and reload the model.  I personally found River to be more approachable.  However, I think Vowpal Wabbit is also a good machine learning library to use once you get past the initial learning curve.  The hashing trick is a neat feature and works very well with large text data.

One thing that I didn't go over in this blog post, as it could as well be a separate topic, is how to put all of this together in a real-time workflow.  I highly recommend looking at the code and trying it out yourself.  One of the cool things you can do is set up a real-time alerting system to get notified when the metrics drop below a threshold.  When I ran the examples, I noticed that initially neither model performed well, and I could see alerts coming through.  However, as both models learned on more data, the scores improved and I stopped seeing alerts.  And that is where real-time machine learning shines.

For a deeper dive into real-time machine learning, check out the following resources:
- [Introduction to streaming for data scientists](https://huyenchip.com/2022/08/03/stream-processing-for-data-scientists.html)
- [From batch to online/stream](https://riverml.xyz/dev/examples/batch-to-online/)
- [Vowpal Wabbit](https://vowpalwabbit.org/)
- [Vowpal Wabbit Tutorial on Kaggle](https://www.kaggle.com/code/kashnitsky/topic-8-online-learning-and-vowpal-wabbit#3.2.-News.-Multiclass-classification)
- [Streaming 101: The world beyond batch](https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/)


Photo by [Navi](https://unsplash.com/@navi_photography) on [Unsplash](https://unsplash.com/photos/HeoATyJ1DFQ)