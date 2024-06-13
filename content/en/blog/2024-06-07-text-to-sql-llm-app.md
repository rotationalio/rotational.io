---
title: "How to build a text-to-sql LLM application"
slug: "text-to-sql-llm-app"
date: "2024-06-07T20:36:22-04:00"
draft: false
image: img/blog/2024-06-07-text-to-sql-llm-app/dashboard.webp
photo_credit: "Photo by [Luke Chesser on Unsplash](https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)"
authors: ['Prema Roman']
profile: img/team/prema-roman.png
tags: ['AI', 'ML', 'LLM', 'Python']
description: "Accelerate data analysis by leveraging LLMs to build text-to-sql applications"
---

We have already discovered the capability of Large Language Models (LLMs) to streamline software development by generating boilerplate code that reduces a lot of up front work when developing new software.  But what about SQL?  Turns out there are text-to-sql LLMs that can do the same for SQL queries.

<!--more-->

This post will demonstrate how to use Vanna and Streamlit to build a text-to-sql application using Vanna and [Streamlit](https://streamlit.io).

Just here for the code? Check out this [repo](https://github.com/pdamodaran/vanna-text-to-sql) for the full example.

Vanna is an open source python library developed by [Vanna.AI](https://vanna.ai).   It uses Retrieval Augmented Generation (RAG), which is a technique that is used to improve the accuracy of LLMs.  The idea is to provide data to an LLM that it was not previously trained on to ensure that it can generate reasonable responses to questions related to this data.  In this case, the data provided is the knowledge about the internals of your database.  The process will be covered later in this post.

Vanna supports many databases including Postgres, SQLite, BigQuery, Snowflake, etc.   You can start experimenting with a Jupyter Notebook or create applications using Streamlit, Flask, Slackbot, or integrate it within your own front end application.  The pricing options are as follows:

- **Open source**: You use your own LLM, set up a local metadata storage using ChromaDB or any other vector database, and deploy via self-hosted Streamlit, Flask app, etc.  You also have the ability to customize as you see fit.
- **Free tier**: This tier uses the GPT 3.5 foundational model, hosted metadata storage and rate-limited usage of the LLM.
- **Paid tier**: This tier costs $30/ 1 million tokens, uses the GPT-4 with a load-balanced fallback to other LLMs.  It also provides SLA guarantees.
- **Enterprise tier**: Contact Vanna AI for a pricing plan that gives you access to developers who can help you customize your application based on your enterprise needs.

This example uses the free tier plan and a Postgres database.  

## Getting Started

### Step 1: Create a free Vanna.AI account

Follow the instructions in the [Vanna.AI](https://vanna.ai) website to create an account.  Once you are logged in, you will need to do the following:

- Get an API key (click on `API Keys` on the left side of the page) 
- Create a new RAG model (click on `RAG Models` on the left side of the page and choose a unique name for your model and click on the `Create Model` button)

### Step 2: Create and activate a virtual environment
Run the following on the command line to create a fresh new Python virtual environment:

```bash
virtualenv venv
source venv/bin/activate
```

### Step 3: Install the requirements
In order to run the code, the following Python libraries are required:

- streamlit
- vanna
- vanna[postgres]

```bash
pip install -r requirements.txt
```


## Train the RAG model

The following is a code snippet of the `DatabaseTrainer` class:

```python
from vanna.remote import VannaDefault

INFO_SCHEMA_QUERY = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS"

class DatabaseTrainer:
    """
    DatabaseTrainer uses Vanna AI to learn in the internals of a Postgres database
    to enable users to use natural language to generate and execute SQL queries
    """
    def __init__(self, api_key=None, model=None, db_creds=None):
        """
        Parameters
        ----------
        api_key : string
            The API key used to connect to Vanna AI
        
        model : string
            The name of the model that will be trained; the model needs
            to be set up in your Vanna AI account prior to use

        db_creds : dict
            Credentials to connect to a Postgres database.  The dictionary
            must contain the following keys: host, port, user, password, dbname
        """
        if api_key is None or api_key == "":
            raise ValueError("api_key must be a valid non-empty string")
        if model is None or model == "":
            raise ValueError("model must be valid non-empty string")
        if db_creds is None:
            raise ValueError("db_creds must be a valid non-empty dictionary")
        # Initialize vanna 
        self.vn = self._init_vanna(api_key=api_key, model=model)
        # Connect to the Postgres database
        self._connect_db(db_creds)
  
    def _init_vanna(self, api_key, model):
        """
        Initialize the VannaDefault class by using the API key to connect to
        the model set up in your Vanna AI account 
        """
        vn = VannaDefault(api_key=api_key, model=model)
        return vn
    
    def _connect_db(self, db_creds):
        """
        Connect Vanna to the postgres database
        """
        self.vn.connect_to_postgres(host=db_creds["host"], port=db_creds["port"], user=db_creds["user"], password=db_creds["password"], dbname=db_creds["dbname"])

    def train(self, ddl=None):
        """
        Train the model
        Parameters
        ----------
        ddl : string
            "CREATE TABLE" SQL statements of the tables in your database.    
        """
        if ddl is None or ddl == "":
             raise ValueError("ddl must be a valid non-empty string")
        # query the information_schema to get the table and column information from the database
        db_info_schema = self.vn.run_sql(INFO_SCHEMA_QUERY)
        # break up the information schema into bite-sized chunks that will be referenced by the LLM
        plan = self.vn.get_training_plan_generic(db_info_schema)
        self.vn.train(plan=plan)
        self.vn.train(ddl=ddl)
        print("Training complete!")
```

Let’s break it down step by step.

To initialize the DatabaseTrainer, you need to pass in the following parameters:

- `api_key`: Vanna API Key
- `model`: RAG model name
- `db_creds`: Credentials to connect to your Postgres database (this is a dictionary with the following keys: host, port, user, password, dbname)

The `__init__` method does the following:

- Initialize the `VannaDefault` class by using the API key to connect to the model set up in your Vanna AI account.
- Connect Vanna to your Postgres database using the database credentials.

The `train` method requires a `ddl` parameter.  This parameter is a string that contains all the `CREATE TABLE` SQL statements of the tables in your database.  This method does the following:

- Run the following query to retrieve the table and column information from the database:  `SELECT * FROM INFORMATION_SCHEMA.COLUMNS`.
- Train the RAG model on the information schema and the ddl.

The following code snippet is an example of how you can execute the training process:

```python
from src.database_trainer import DatabaseTrainer

database_trainer = DatabaseTrainer(api_key="Your Vanna API key", 
    model="Your Vanna RAG model", 
    db_creds="Your database credentials")
database_trainer.train(ddl="Your database DDL")
```

## Run the Streamlit text-to-sql LLM application

Now that the RAG model has been trained, it’s time to integrate it into an application.  Vanna has a few boilerplate examples on its website that you can use to get started.  The code to run the application is based off Vanna’s streamlit example.  You will need to add the following secrets in the `.streamlit/secrets.toml` file:

```bash
VANNA_API_KEY="Your Vanna API key"
MODEL="Your Vanna RAG model"
POSTGRES_HOST="Database host"
POSTGRES_PORT="Database port" 
POSTGRES_USER="Database user"
POSTGRES_PWD="Database password"
POSTGRES_DB="Database name"
```

To run the application, simply run the following command:

```bash
python -m streamlit run sql_app.py
```

The following is a screenshot of the application.  It provides the following functionality:
- View suggested questions
- Display and execute the SQL code
- See a table of the results
- If applicable, show and execute Plotly code and display a chart
- Show follow up questions

![screenshot](img/blog/2024-06-07-text-to-sql-llm-app/sql_app.webp)

The [repo](https://github.com/pdamodaran/vanna-text-to-sql) includes a demo of the application.  

## Conclusion
As this post demonstrated, LLMs can be used to accelerate data analysis tasks by training a RAG model to build a text-to-sql application.  This post just scratches the surface on how to build these types of applications.

A few enhancements can be made to reduce errors:
- Train the model on documentation about your tables.  For example, you can describe the type of data the table holds and possible values for fields in those tables.  The way to train on documentation is as follows: `vn.train(documentation="insert documentation here")`
- Train the model on commonly run SQL queries: `vn.train(sql="insert sql here")`
- Train the model on question-sql pairs: `vn.train(question="insert question here", sql="insert sql here")`

There is one important thing to keep in mind.  Depending on the sensitivity of the data in your database, you may want to consider the options when you are building the application.  This particular example uses a hosted LLM solution so data will be sent to the LLM.  You have the option to use Vanna with your own custom LLM, vector database,  and RAG process and host the application on your own server.  Vanna AI provides documentation on how to set this up.  More details about Vanna's data security policy can be found [here.](https://vanna.ai/data-security-faq.html)