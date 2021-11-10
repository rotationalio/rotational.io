---
title: "2021 9 29 Predicting Star Ratings Based on Sentiment Analysis"
slug: "predicting-star-ratings-based-on-sentiment-analysis"
date: 2021-09-29T10:40:29-04:00
draft: false
image_webp: 
image: 
author: Nabiha Naqvie 
social: 
    - icon: "ti-linkedin" # themify icon pack : https://themify.me/themify-icons
    link: https://www.linkedin.com/in/nabiha-naqvie-22765612a/  
description: "For the SCS Georgetown University Data Science Certificate in Cohort 24, the Amaznonian Sentiment team utilized sentiment analyzers to understand Amazon reviews to predict star ratings"  
---

Customer reviews have become an epicenter of the ecommerce industry. Amazon.com, being one of the well-known ecommerce companies, have seen an increase of an estimate of $2.7B revenue annually and sales revenue of $107 billion in 2015 solely due to customer reviews¹. The importance of reviews to businesses sparked our interest to delve into understanding reviews from the companies perspective, particularly how to narrow focus for smaller companies who may not have the headcount or marketing savvy to preserve their online reputations. To add complexity or layers, we decided to focus the project to understand the sentiment of reviews to predict star ratings. One of the goals of the project was to explore various models to find the best suited for sentiment analysis. The intent is to highlight for companies which feed items require the most urgent response, maximizing their opportunity to change the commenter from a detractor to a supporter. Our project involves predicting star ratings based on two different sentiment analyzers: EmoMap² and the NLTk's Vader score.

For this project, the USCD Amazon³ reviews were used and stored in MongoDB Compass. The data was thoroughly cleaned, particaulary tokenizing and lemmaitizing the review text, and multiple binary categories were added for Exploratory Data Analysis (EDA). An example of binary categories was to divide the star ratings into positive (1) or negative (0). Once the data was prepared, we conducted initial feature analysis, where both sentiment analyzers scored higher than the other features. The data sets were split into train, validate, and test sets at a 60/20/20 split. The addition of a validation test set allowed us to test for overfitting for the dependent variables used in the VADER and Five Emotions models. The data sets were randomized at various stages to ensure that any review order in the initial data set was overcome. After the team decided on which variables to include in the models, the splits were changed to a train/test set with an 80/20 split.

For the machine learning analysis, four different approaches were taken and we compared the model accuracy for these four approaches. The approaches were: TF-IDF word vectorizer; Doc2Vec document vectorizer; a Five Emotions (joy, anger, sadness, fear and disgust) model ; and a VADER-focused approach.The team modelled the three approaches above with a number of regressors and classifiers. The models looked at predicting both binary classification (positive or negative review) and specific 1-5 rating. Models used included Binary and Multinomial Logistics Regressions, Support Vector Machines (SVM), Random Forests (RF), Naive Bayes Classifiers (NBC), and K Nearest Neighbors (KNN). Different combinations of the models were used for each of the four approaches to compare and contrast accuracy and precision.

Our strongest overall approach, in terms of accuracy, was TF-IDF. For the binary analysis, the logistic regression  performed very well. For the multi-class, TF-IDF was also the strongest performer. Our second most accurate approach was Doc2Vec. It performed well overall, but lagged behind TF-IDF by around 3 percentage points for both binary and multiclass. The VADER and Five Emotions approaches were both a tier below the word vectorizers in terms of accuracy, with VADER being the stronger of the two. Similarly, both VADER and Five Emotions models significantly underperformed the word vectorizer models for multiclass.

Moving forward, we plan to create a GUI or a dashboard that will alert merchants to specific negative reviews or feedback. The objective is to highlight opportunities to mitigate reputation damage, covert undecided shoppers to satisfied customers, and identify responses to campaigns that generate unintended negative responses.
 
Our Github link is: https://github.com/georgetown-analytics/Amazonian-Sentiments

**** 
¹Haque, M. E., Tozal, M. E., & Islam, A. (2018, August). Helpfulness prediction of online product reviews. In Proceedings of the ACM Symposium on Document Engineering 2018 (pp. 1-4). https://doi.org/10.1145/3209280.3229105
²https://github.com/JULIELab/EmoMap/blob/master/coling18/main/lexicon_creation/lexicons/Warriner_BE.tsv
³http://deepyeti.ucsd.edu/jianmo/amazon/index.html

