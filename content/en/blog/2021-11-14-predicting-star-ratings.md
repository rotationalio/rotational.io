---
title: "Predicting Star Ratings: Sentiment Analysis Built on MongoDB"
slug: "predicting-star-ratings"
date: 2021-11-14T10:40:29-04:00
draft: false
image: img/blog/predicting-stars.jpg
author: Nabiha Naqvie
category: AI/ML
description: "Modern sentiment analysis requires both creativity and elbow grease. In this post, we explore a project to understand Amazon reviews and predict start ratings using open source sentiment analyzers and MongoDB."
profile: img/team/nabiha-naqvie.png
---

If you want to build a robust machine learning model, the most important ingredient is data -- but keep in mind that tuning your model will rely on devising a systematic way to store and query that data! In this post, we explore a project to understand a large dataset of Amazon reviews and predict start ratings using open source sentiment analyzers and the MongoDB ecosystem. <!--more-->

The complete project is posted here: https://github.com/georgetown-analytics/Amazonian-Sentiments.

## Introduction

Customer reviews have become an epicenter of the e-commerce industry. Amazon.com, being one of the best-known e-commerce companies, has seen an increase of an estimate of $2.7B revenue annually and sales revenue of $107 billion in 2015 solely due to customer reviews[^1]. The importance of reviews to businesses sparked our interest to delve into understanding reviews from a company perspective, particularly how to narrow focus for smaller companies who may not have the headcount or marketing savvy to preserve their online reputations.

## The Project

This project came out of the [Georgetown Data Science Program](https://scs.georgetown.edu/programs/375/certificate-in-data-science/), which is centered on applied machine learning and focused on exercising skills across the full predictive pipeline, from data ingestion and storage to feature analysis, algorithm selection, and hyperparameter tuning. The program culminates in a capstone project that produces a data product to illustrate practical use of these skills. For an additional challenge, we decided to focus the project to understand the sentiment of reviews to predict star ratings.

From the perspective of the business problem, our intent was to highlight for companies which reviews require the most urgent response, maximizing their opportunity to change the commenter from a detractor to a supporter. One of the goals of the project was to explore various models to find the best suited model for sentiment analysis. We experimented with two different sentiment analyzers: EmoMap[^2] and the NLTk's Vader score.

## The Data

Our dataset was the UCSD Amazon[^3] reviews, which contains 142.8 million reviews collected from May 1996 to July 2014. For text data management, the best choice is often to store data in a NoSQL document storage database that allows streaming reads of the documents with minimal overhead, or to simply write each document to disk[^4]. Since the UCSD Amazon reviews are in JSON format and text, the best storage platform to use was MongoDB. MongoDB is a document-oriented database, classified as NoSQL -- NoSQL refers to "not only SQL" and references a variety of non-relational databases. MongoDB is commonly known for storing JSON documents.

## The Mongo Ecosystem

As a first time user, I had to learn that there were two components of using the database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and [MongoDB Compass](https://www.mongodb.com/products/compass). MongoDB Compass is a GUI that allows users to interact with the data, whereas MongoDB Atlas is a storage platform that creates and distributes the clusters and connects multiple users to MongoDB Compass. Compass is particularly convenient because it provides the opportunity to connect to the data with Jupyter Notebook. One of the cons of working with the free tier of MongoDB is the data storage limit is 512MB (unless you are willing to pay) and that it requires a bit of learning curve to connect MongoDB Atlas to MongoDB Compass. The pros of working with MongoDB was the ease of importing the data from MongoDB Compass to Jupyter Notebook.

## Data Wrangling

The data was thoroughly cleaned, particularly tokenizing and lemmatizing the review text, and multiple binary categories were added for Exploratory Data Analysis (EDA). An example of binary categories was to divide the star ratings into positive (1) or negative (0). Once the data was prepared, we conducted initial feature analysis, where both sentiment analyzers scored higher than the other features. The data sets were split into train, validate, and test sets at a 60/20/20 split. The addition of a validation test set allowed us to test for overfitting for the dependent variables used in the VADER and Five Emotions models. The data sets were randomized at various stages to ensure that any review order in the initial data set was overcome. After the team decided on which variables to include in the models, the splits were changed to a train/test set with an 80/20 split.

## Model Selection

For the machine learning analysis, four different approaches were taken and we compared the model accuracy for these four approaches. The approaches were: TF-IDF word vectorizer; Doc2Vec document vectorizer; a Five Emotions (joy, anger, sadness, fear and disgust) model ; and a VADER-focused approach.The team modelled the three approaches above with a number of regressors and classifiers. The models looked at predicting both binary classification (positive or negative review) and specific 1-5 rating. Models used included Binary and Multinomial Logistics Regressions, Support Vector Machines (SVM), Random Forests (RF), Naive Bayes Classifiers (NBC), and K Nearest Neighbors (KNN). Different combinations of the models were used for each of the four approaches to compare and contrast accuracy and precision.

## Evaluation

Our strongest overall approach, in terms of accuracy, was TF-IDF. For the binary analysis, the logistic regression performed very well. For the multi-class, TF-IDF was also the strongest performer. Our second most accurate approach was Doc2Vec. It performed well overall, but lagged behind TF-IDF by around 3 percentage points for both binary and multiclass. The VADER and Five Emotions approaches were both a tier below the word vectorizers in terms of accuracy, with VADER being the stronger of the two. Similarly, both VADER and Five Emotions models significantly underperformed the word vectorizer models for multiclass.

## Next Steps

Moving forward, we plan to create a GUI or a dashboard that will alert merchants to specific negative reviews or feedback. The objective is to highlight opportunities to mitigate reputation damage, covert undecided shoppers to satisfied customers, and identify responses to campaigns that generate unintended negative responses.

To see our implementation, go to: https://github.com/georgetown-analytics/Amazonian-Sentiments.

---

## Footnotes

[^1]: Haque, M. E., Tozal, M. E., & Islam, A. (2018, August). Helpfulness prediction of online product reviews. In Proceedings of the ACM Symposium on Document Engineering 2018 (pp. 1-4). https://doi.org/10.1145/3209280.3229105
[^2]: EmoMap (2018). https://github.com/JULIELab/EmoMap
[^3]: Amazon review data (2018). http://deepyeti.ucsd.edu/jianmo/amazon/index.html
[^4]: Bengfort, B., Bilbro, R., Ojeda, T., (2018). [Applied Text Analysis with Python.](https://www.amazon.com/Applied-Text-Analysis-Python-Language-Aware/dp/1491963042) O’Reilly Media, Inc.
