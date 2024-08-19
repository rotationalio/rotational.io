---
title: "Building My First Event-Driven NLP Application"
slug: "building-an-nlp-event-driven-app"
date: "2023-07-13T16:45:10-04:00"
draft: false
image: img/blog/victory.jpg
photo_credit: Photo by [Zion National Park](https://www.flickr.com/photos/zionnps/) on [Flickr Commons](https://flic.kr/p/auFchv)
authors: [Aatmaj Janardanan]
profile: img/team/aatmaj-janardanan.png
tags: ['NLP', 'AI', 'ML', 'Eventing']
description: "Rotational's summer intern shares challenges and victories encountered when developing his first event-driven data science app!"
---

A few weeks ago, I'd never used an event stream before. Read on to hear how I built my first event-driven data science app &mdash; the biggest challenges, my lessons learned, and a couple of key takeaways!

<!--more-->

## My Summer of Eventing

You might be wondering, what does eventing have to do with data science or NLP?? When I heard the topic of my summer internship, I will admit I also had some doubts.

So far, all of my learnings and education in the data science field have assumed that the subject of my analysis is a dataframe &mdash; some large batch of data that consists of a lot of rows of instances with columns that describe the features of each instance.

However, I am starting to understand that this kind of batch data is only one way of approaching data science. In industry, data scientists are increasingly being called on to develop analytics and models that represent data *as it actually flows through an organization* (which is usually in a stream of small changes over time). For that reason, I'm so glad to have the opportunity to explore event-driven data science applications and use cases during my summer internship.

In this post, I'll step through my process of building an event-driven application that fetches live news data from a RSS ingestor (Baleen), and performs streaming entity extraction and sentiment analysis. It took some work to switch my thinking over from the familiar batch framework to a streaming analytics architecture, and I'd like to share some of those challenges with others out there who are interested in event-driven data science and machine learning.


## The Initial Issue: No Data Fetching

[Baleen is a project](https://rotational.io/blog/data-curation-baleen/) incubated at Rotational for the purpose of build experimental corpora for Natural Language Processing

Baleen works on a schedule; every hour it fetches news articles from public RSS feeds and stores them to [Ensign](https://rotational.io/ensign/). Ensign is an [eventing platform](https://ensign.rotational.dev/eventing/) that provides storage and pub/sub access to topic streams. Baleen's Ensign `Publisher` stores each news article as an event in a `documents` topic stream. You can think of a topic stream like a database table in a traditional RDBMS. My app was meant to read off of that `documents` stream using a `Subscriber` and to perform and report analytics on the text of each article as soon as it was published.

My first step was being added to the Baleen team in Ensign's UI, which is similar to being given IAM access to a database. The Baleen team administrator gave me the permission to write to and read from the `documents` stream, and I had to create a set of [API keys](https://ensign.rotational.dev/getting-started/ensign/) and store those keys as environment variables.

This allowed me to set up an initial `Subscriber`:

```python
class BaleenSubscriber:
    """
    Implementing an event-driven Natural Language Processing tool that
    does streaming HTML parsing, entity extraction, and sentiment analysis
    """
    def __init__(self, topic="documents"):
        """
        Initialize the BaleenSubscriber, which will allow a data consumer
        to subscribe to the topic where the publisher is pushing articles
        """

        self.topic = topic
        self.ensign = Ensign()
```

If you don't provide an argument to the line `self.ensign = Ensign()`, PyEnsign will read the credentials (`ENSIGN_CLIENT_ID` and `ENSIGN_CLIENT_SECRET`) from your environment. Alternatively you can supply them as string args: `self.ensign = Ensign(client_id="your_client_id", client_secret="your_secret")`, or use another method you prefer.

The next step was to add a `subscribe` method to access the topic stream (I'll describe the `parse_event` method shortly!):

```python
    async def subscribe(self):
       """
       Subscribe to the article and parse the events.
       """
       id = await self.ensign.topic_id(self.topic)
       async for event in self.ensign.subscribe(id):
           await self.parse_event(event)
```

And another method to run the subscribe method in a continuous loop:

```python
    def run(self):
        """
        Run the subscriber forever.
        """
        asyncio.run(self.subscribe())
```

At the beginning, I couldn't see any data being fetched from Baleen while using the `Subscriber`. After investigating the issue, we discovered that Baleen was publishing Ensign events in `msgpack` format (because it leverages the [Watermill](https://rotational.io/blog/prototyping-eda-with-watermill/) API on the backend) rather than the `json` format I was expecting.

{{<figure src="/img/blog/2023-07-12-Building-a-NLP-Event-Driven-Application-Challenges-and-Solution/meme2.png" alt="Meme">}}

## Unmarshalling Msgpack in Python

To address the issue of fetching data from Baleen, we needed to find a way to unmarshal MessagePack format correctly in Python. [MessagePack](https://msgpack.org/index.html) is essentially a binary JSON format. Hence, we needed to find a Python library that could unpack these events correctly.

After some research, I came across the [`msgpack` Python library](https://pypi.org/project/msgpack/), which provides CPython bindings for reading and writing MessagePack data. Using this library, we were able to unpack the event correctly by deserializing the msgpack bytes.

With the help of the msgpack library, we could now process the Watermill messages and extract the necessary data for our NLP research!

## NLP Magic

Now I could add my text analytics method to the `BaleenSubscriber` class, which does all of the data science steps:

```python
    async def parse_event(self,event):
        """
        Decode and ack the event.
        ----------------
        Decode the msgpack payload, in preparation for applying our NLP "magic"
        """

        try:
            data = msgpack.unpackb(event.data)
        except json.JSONDecodeError:
            print("Received invalid msgpack data in event payload:", event.data)
            await event.nack(Nack.Code.UNKNOWN_TYPE)
            return

        # Parsing the content using BeautifulSoup
        soup = BeautifulSoup(data[b'content'], 'html.parser')
        # Finding all the 'p' tags in the parsed content
        paras = soup.find_all('p')
        score = []
        ner_dict = {}
        for para in paras:
            text = TextBlob(para.get_text())
            score.append(text.sentiment.polarity)
            ner_text = self.NER(str(para.get_text()))
            for word in ner_text.ents:
                if word.label_ in ner_dict.keys():
                    if word.text not in ner_dict[word.label_]:
                        ner_dict[word.label_].append(word.text)
                else :
                    ner_dict[word.label_] = [word.text]

        print("\nSentiment Average Score : ", sum(score) / len(score))
        print("\n------------------------------\n")
        print("Named Entities : \n",json.dumps(
                ner_dict,
                sort_keys=True,
                indent=4,
                separators=(',', ': ')
                )
              )
        await event.ack()
```

Now, every time a new article is published, I get something like this:

```bash
Sentiment Average Score :  0.05073840565119635

------------------------------

Named Entities :
 {
    "CARDINAL": [
        "two",
        "one",
        "five",
        "18",
        "2"
    ],
    "DATE": [
        "recent months",
        "Friday",
        "her first day",
        "four years",
        "March",
        "The next month",
        "this week",
        "Saturday",
        "the next two days"
    ],
    "FAC": [
        "the Great Hall of the People",
        "Tiananmen Square"
    ],
    "GPE": [
        "U.S.",
        "China",
        "the United States",
        "Beijing",
        "Shanghai",
        "The United States",
        "Washington",
        "Hong Kong",
        "Detroit"
    ],
    "NORP": [
        "American",
        "Chinese",
        "Americans"
    ],
    "ORDINAL": [
        "first"
    ],
    "ORG": [
        "Treasury",
        "the Treasury Department",
        "the American Chamber of Commerce",
        "Boeing",
        "Bank of America",
        "the Mintz Group",
        "Bain & Company",
        "TikTok",
        "ByteDance",
        "the Center for American Studies at",
        "Peking University",
        "Renmin University",
        "The U.S. State Department",
        "the Chamber of Commerce",
        "the People\u2019s Bank of China",
        "Treasury Department",
        "CCTV",
        "The Financial Times",
        "The Times"
    ],
    "PERSON": [
        "Janet Yellen",
        "Alan Rappeport",
        "Keith Bradsher",
        "Janet L. Yellen",
        "Yellen",
        "Biden",
        "Li Qiang",
        "Cargill",
        "Wang Yong",
        "Wang",
        "Shi Yinhong",
        "Michael Hart",
        "Hart",
        "Liu He",
        "Yi Gang",
        "Li",
        "Claire Fu",
        "Christopher Buckley"
    ],
    "TIME": [
        "five hours",
        "more than an hour",
        "afternoon",
        "over an hour"
    ]
}
```

## Key Learnings

Stay tuned for a follow on post on the NLP steps in further detail (I will continue adding features throughout my internship)!

For now, here are my key takeaways from my first month of eventing:
1.	Understand the API/schema: This is the number one challenge when you are experimenting with a new data source (whether or not it's a streaming dataset). Gain a clear understanding of the APIs and SDKs to identify any limitations or issues.
2.	Debugging is an investigation: Conduct extensive research, run local debug commands, and trigger actions to verify functionality.
3.	Data serialization: Recognize the use of custom marshallers for converting events between frameworks, enabling interoperability.
4.	Researching Python libraries:
    - Documentation: Read the library's documentation to understand its features, requirements, and usage instructions.
    - Compatibility: Ensure the library is compatible with the Python version and project dependencies.
	- Community Engagement: Evaluate the level of community engagement, such as discussions and forums, to gauge the library's support and active development.
	- Test and Evaluate: Set up a separate test environment (e.g. `venv`) to experiment with the library, assess its performance, stability, and suitability for your specific project requirements.


## Your Turn!

Want to try your hand at an event-driven data science project? Check out the [Data Playground](https://rotational.io/data-playground/) for open data sets and ideas for how to get started!

If you're looking to start your first event-driven app, check out [Ensign](https://rotational.app/register/), a platform and community for data scientists working on event-driven projects.
