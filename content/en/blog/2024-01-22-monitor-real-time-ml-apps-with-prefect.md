---
title: "Monitoring Real-Time Machine Learning Applications With Prefect"
slug: "monitor-real-time-ml-apps-with-prefect"
date: "2024-01-22T08:57:31-05:00"
draft: false
image: img/blog/2024-01-22-monitor-real-time-ml-apps-with-prefect/orchestra.jpg
photo_credit: "Photo by [Manuel Nägeli on Unsplash](https://unsplash.com/@gwundrig?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
authors: ['Prema Roman']
profile: img/team/prema-roman.png
tags: ['AI', 'ML', 'Python', 'Data']
description: "Prefect enables data scientists to add orchestration and observabillity into their data pipelines without having to write custom code."
---

In machine learning projects, there has been a shift away from research to operations where shipping models early and often is critical.  Learn how using Prefect will help you quickly move from developing models to operationalizing them.

<!--more-->

There is an AI arms race where companies are rushing to get value out of AI and are feeling the pressure to deploy solutions quickly so that they don’t get wiped out by competitors.  

For those of us from a more traditional data science background where a deep understanding of the algorithms was the main focus of our education, shifting to this new paradigm has caused a lot of growing pains.  It already takes an inordinate amount of time working with data and making sense of it to build a machine learning model, let alone having to now manage application development and deployments.  

Fortunately, there are many new tools that are now available that take away some of the complexities around operationalizing and managing machine learning models.  One such tool is [Prefect](https://www.prefect.io).  Prefect is a modern workflow orchestration platform designed specifically for data practioners to help them manage their workflows and to add observability into their applications without having to write custom code.  It is written in Python so there is no need to learn a new language.  

Prefect offers a lot of neat features but what’s even more awesome is that getting started is SUPER easy.  All it takes to integrate Prefect into your application workflow is four steps:
- Install Prefect in a virtual environment like you would any other package: `pip install prefect`.
- For functions within your application that you want to monitor, e.g., `score` for monitoring model predictions, add the `@flow` decorator on top of the function signature.
- Run the following command in a terminal window: `prefect server start` (note that your virtual environment must be activated before running this command).
- Run your application.

You can now view the status of your application on the Prefect dashboard.  

The example I will demonstrate is a real-time sentiment analysis application that uses [Ensign](https://rotational.io/ensign/) as the streaming data platform, [River](https://riverml.xyz) for the real-time machine learning model, and [Prefect]((https://www.prefect.io)) as the orchestration platform.  

For those of you who have read some of my previous blog posts, you will recognize that the code that I am using is eerily similar to one that I used in an earlier blog post :stuck_out_tongue_winking_eye:.  This proves that it doesn’t take much to integrate Prefect into an existing application.

If you are not familiar with Ensign, check out [Ensign U](https://rotational.io/ensign-u/) to learn more about how you can use Ensign to build real-time applications.  For this application you will need to create two topics: `river_pipeline` and `river_metrics`.  Topics are analogous to tables in a relational database.

This application consists of three components:

- A publisher component that reads data from a csv file that contains Yelp review data and publishes (writes) this data to the `river_pipeline` topic.
- A subscriber component that listens for new messages on the `river_pipeline` topic and loads and uses a real-time machine learning model that makes predictions and learns incrementally as it receives new training instances. At the end, it calculates the precision and recall scores which it publishes to a different topic called `river_metrics`.
- The third component listens for new messages on the `river_metrics` topic and checks to see if the precision or recall scores are below a pre-specified threshold and logs the values if they fall below the threshold.

As you can imagine, especially with real-time applications that are going to be running on an ongoing basis, it is crucial that there is monitoring set up so that you can view the health and status of your applications and can address issues as soon as they arise.

Let’s now take a look at some code and see how to integrate Prefect into the application.

## Yelp Data Publisher
This component contains a class called `YelpDataPublisher` whose main function is called `publish`.

```python
async def publish(self):
    """
    Read data from the yelp.csv file and publish to river_pipeline topic.
    This can be replaced by a real time streaming source
    Check out https://github.com/rotationalio/data-playground for examples
    """
    train_df = pd.read_csv(os.path.join("data", "yelp.csv"))
    train_dict = train_df.to_dict("records")
    for record in train_dict:
        event = Event(json.dumps(record).encode("utf-8"), mimetype="application/json")
        await self.ensign.publish(self.topic, event, on_ack=handle_ack, on_nack=handle_nack)
```

This function reads a csv file and converts it to a Pandas dataframe that is then converted to a list of dictionary objects. It loops through this list of dictionary objects one record at a time and converts them into Ensign `events` that are published (stored) in the `river_pipeline` topic.  In reality, this would be replaced by a real-time source that would be accessed through an API.  The idea remains the same.  Usually real-time APIs send data in JSON format which can be directly converted to Ensign events.

In order to integrate Prefect into this application, we will write another function that instantiates the `YelpDataPublisher` class and calls the `publish` function.

```python
@flow(log_prints=True)
def run_yelp_data_publisher():
    publisher = YelpDataPublisher()
    asyncio.run(publisher.publish())
```

Note that there is a decorator called `flow` with the parameter `log_prints` which is set to `True`.  The decorator converts the function into a Prefect **Flow**, which is a special function that can be monitored and can optionally have built-in retries if specified.  The `log_prints` parameter converts the print statements to INFO level log messages.  If you want to set up other types of logging messages such as WARNING and ERROR messages, you can use `get_run_logger` from Prefect.  We will see this example in the Metrics Subscriber component.

The other item to note above is the use of `asyncio.run` before the function call.  Since the publish method is asynchronous we use `asyncio` to call the function.  Asynchronous functions are common in real-time applications where functions need to have the ability to run independently of each other.

And that’s all it takes to monitor the Yelp Data Publisher component!

## Yelp Data Subscriber

Similar to the Yelp Data Publisher, the class name is `YelpDataSubscriber` and it’s main function is…you guessed it…`subscribe`!

```python
async def subscribe(self):
    """
    Receive messages from river_pipeline topic
    """
    async for event in self.ensign.subscribe(self.sub_topic):
        await self.run_model_pipeline(event)
```

When a new event (data) arrives on the `river_pipeline` topic, this function calls the `run_model_pipeline` function.  Let’s examine that function.

```python
async def run_model_pipeline(self, event):
    """
    Make a prediction and update metrics based on the predicted value and the actual value
    Incrementally learn/update model based on the actual value
    """
    record = json.loads(event.data)
    y_pred = self.model.predict_one(record["text"])
    if y_pred is not None:
        self.confusion_matrix.update(y_true=record["sentiment"], y_pred=y_pred)
        self.classification_report.update(y_true=record["sentiment"], y_pred=y_pred)
    # the precision and recall won't be great at first, but as the model learns on
    # new data, the scores improve
    print(self.precision_recall)
    pr_list = self.precision_recall.get()
    pr_dict = {"precision": pr_list[0], "recall": pr_list[1]}
    event = Event(json.dumps(pr_dict).encode("utf-8"), mimetype="application/json")
    await self.ensign.publish(self.pub_topic, event, on_ack=handle_ack, on_nack=handle_nack)
    # learn from the train example and update the model
    self.model.learn_one(record["text"], record["sentiment"])
```

The model that is used here is the real-time version of a Multinomial Naive Bayes classifier that is wrapped in a Pipeline object with a Bag of Words vectorizer.   For those who are not familiar with real-time machine learning models, this is going to look backwards.  With traditional models, we typically `fit` a model to a batch of data and then run predictions on new data.  Real-time machine learning models make predictions first on new data and then learn on that data when the label becomes available.   We have the labels, so we will simply make the prediction first by calling `predict_one` and then call `learn_one` on the same data.   We will also update the confusion matrix and the classification report using the prediction and the label.  Finally, the latest precision and recall scores are published to the `river_metrics` topic.  

We will integrate Prefect as shown below.  Note that it looks almost the same as the function that was used for the Yelp Data Publisher component.

```python
@flow(log_prints=True)
def run_yelp_data_subscriber():
    subscriber = YelpDataSubscriber()
    asyncio.run(subscriber.subscribe())
```

## Metrics Subscriber

The class used in this component is called `MetricsSubscriber` and the top level function is also called `subscribe`.  It calls another function called `check_metrics` which is defined below.

```python
async def check_metrics(self, event):
    """
    Check precision and recall metrics and print if below threshold
    """
    metric_info = json.loads(event.data)
    precision = metric_info["precision"]
    recall = metric_info["recall"]
    if precision < self.threshold:
        self.logger.warn(f"Precision is below threshold: {precision}")
    if recall < self.threshold:
        self.logger.warn(f"Recall is below threshold: {recall}”)
```

For each event that arrives on the `river_metrics` topic, it extracts the precision and recall scores and checks to see if the scores are below a pre-defined threshold.  You will notice here that the print statements are replaced by a logger which is instantiated in the class using Prefect’s `get_run_logger` method.  In this case, we want to log a WARNING message so that the person who is monitoring the application can check to see if this is something that needs to be addressed.  The following code snippet shows how Prefect is integrated here.  You can see how the logger is initialized and passed to the `MetricsSubscriber` class as a parameter.

```python
@flow(log_prints=True)
def run_metrics_subscriber():
    logger = get_run_logger()
    subscriber = MetricsSubscriber(logger=logger)
    asyncio.run(subscriber.subscribe())
```

## Running the application

The full source code to run the application is available [here](https://github.com/rotationalio/prefect-example).

### Step 1: Create and source environment variables on your machine

In order to use Ensign, you will need to have downloaded API keys and set them as environment variables as follows:

```bash
export ENSIGN_CLIENT_ID="your client id here"
export ENSIGN_CLIENT_SECRET="your client secret here"
```

### Step 2: Create and activate a Python virtual environment

```bash
$ virtualenv venv
$ source venv/bin/activate
```

### Step 3: Install the required packages

```bash
$ pip install -r requirements.txt
```

### Step 4: Set up and start the Prefect server
You can either host your own Prefect server on your own infrastructure or use [Prefect Cloud](https://app.prefect.cloud/).  Follow the instructions after signing up to create a Prefect server on the cloud.  

If you choose to set up a local server, you simply need to open up a terminal window and run the following command to get started. Make sure that Prefect is installed in your virtual environment first and that you have activated it.  The command to run the Prefect server on your machine is as follows:

```bash
$ prefect server start
```

### Step 5: Run the Metrics Subscriber

Open up a new terminal window and activate the virtual environment.  Run the following command:

```bash
$ python river_sentiment_analysis.py metrics
```

### Step 6: Run the Yelp Data Subscriber

Open up a new terminal window and activate the virtual environment.  Run the following command:

```bash
$ python river_sentiment_analysis.py subscribe
```

### Step 7: Run the Yelp Data Publisher

Open up a new terminal window and activate the virtual environment.  Run the following command:

```bash
$ python river_sentiment_analysis.py publish
```

You can then take a look at the Prefect dashboard to view your jobs.  It will look something like the screenshot below.  Note that there are three bars below to the `Flow Runs` section.  The two blue bars are the Yelp Data Subscriber and the Metrics Subscriber components.  These are blue because they are still running.  The green bar is the Yelp Data Publisher which is green because it finished running and it ran successfully.  Since the publisher was reading from a csv file instead of a real-time API, it completed running after there were no more records in the csv file. You can see that the dashboard gives you a quick overview of the health and status of your application.

![Prefect Dashboard](/img/blog/2024-01-22-monitor-real-time-ml-apps-with-prefect/prefect_dashboard.png)

The following screenshot shows the Flow runs.  This gives you the ability to drill down further into a single component.

![Prefect Flow Runs](/img/blog/2024-01-22-monitor-real-time-ml-apps-with-prefect/prefect_flow_runs.png)

You can also check the logs for warnings and errors.  Note you can see the instances where the precision and recall were lower than the threshold.  One thing to note with real-time models is they tend to perform poorly at first and then get better over time as is evidenced by the screenshot below.

![Prefect Logs](img/blog/2024-01-22-monitor-real-time-ml-apps-with-prefect/prefect_logs.png)

Prefect offers a lot more features not demonstrated in this example such as scheduling, notifications, and artifacts that can be used for data quality checks and documentation.  These are particularly useful for analyzing results over time.

## Conclusion
As you can see, integrating Prefect into an application is very straightforward.  But more importantly, it empowers scrappy data teams to be self-reliant by adding observability into their own applications without having to rely on an external team to build one for them.  And given the current “data science 2.0” climate where model deployment is becoming even more critical, leveraging a user-friendly tool like Prefect is the ideal solution to ensure that we remain competitive as data scientists.