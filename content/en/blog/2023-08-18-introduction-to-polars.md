---
title: "Intro to Polars: A Pandas Alternative for Efficiently Working with Large Datasets"
slug: "introduction-to-polars"
date: "2023-08-18T16:49:32-04:00"
draft: false
image: img/blog/2023-08-18-introduction-to-polars/polar-bears-unsplash.jpg
photo_credit: Photo by Hans-Jurgen Mager on Unsplash
author: Prema Roman
profile: img/team/prema-roman.png
category: Python, Data
description: "An overview of Polars - the high performance Python data processing library"
---


Python is the most popular programming language to do any kind of work in data, whether it is data analysis, data engineering, or machine learning.  It is a very accssible language for people who are new to programming.  It is no wonder that Pandas, a library written in Python, became the most popular library for data processing.   It has a very easy to use API with a robust set of features.

<!--more-->

Pandas, when it first came out, was a great alternative to those whose workflow consisted of writing SQL queries and then dumping the results into Excel for analysis.  Pandas offered a one-stop shop solution that allows you to work with tabular data and write SQL like functions.  In fact, it also has very easy to use functions to read from and write to databases.  I was recently reminded of how good the library is in doing all the work for you when I struggled using Redshift’s `COPY` function to do the same.  For those who have had to do this, you are most likely well aware that if you are not precise in defining your parameters and column names, you are in for a lot of headache.  Imagine if you have to write to a table with a long list of columns.  Good luck with that!

Unfortunately, Pandas was born in an era when datasets were not as big as they are now.  Therefore, anyone who has worked with large datasets inevitably runs into performance issues.  There are other libraries out there, such as Spark, that solve this problem.   I have used Spark and it does a really good job with big data, but it has a steep learning curve because you not only do you have to learn a new API, you have to learn the mechanics of distributed computing.  The biggest gotchas that come with spark is lazy loading.  You think everything is going great until you call `collect()` and then…everything comes down to a grinding crawl.  By this point, you have written several transformations on the data and you have to figure out where you messed up.   The cause of the bottleneck can be any number of reasons such as a huge number of nulls in one column in one table causing a problem in a join statement, to a compuation that’s happening on the driver node that is too small to handle the large volume of data.  

Recently, when I ran into performance problems, I decided to try out Polars because I had heard that it has an API that is just as accesible as Pandas, but more efficient.  It has built in optimizations such that it makes use of all the available CPUs on your behalf.  It uses Apache Arrow under the hood thereby taking advantage of columnar formats, which makes aggregations and analytics much faster than Pandas and it has a smaller memory footprint.

I was impressed by how easy it was to use the library.   The creators put in a lot of work to keep the API as similar to Pandas where possible.  Some of the other syntax that I came across with was also familiar to me because it is similar to Spark.  So it seems that Polars is inspired by both Pandas and Spark.

Here are some ways it is similar to Pandas.  Note that the syntax, options, and parameters and options may be slightly different.

```python
# Pandas                                    # Polars
import pandas as pd                         import polars as pl

# read csv file
df = pd.read_csv("file.csv")                df = pl.read_csv("file.csv")

# get the shape of a dataframe
df.shape                                    df.shape

# drop columns
df.drop(columns=["col1", "col2"])           df.drop(columns=["col1", "col2"])


# write to a csv file
df.to_csv("file.csv")                       df.write_csv("file.csv")

```

Here are ways in which the API is different from Pandas.  For those who have used Spark, some of these examples will look familiar.

```python
# Pandas                                    # Polars

# add a new column with a constant value
df["new_col"] = "pandas"                     df.with_column(pl.lit("polars")
                                               .alias("new_col"))

# filtering rows
df.loc[df.flower.isin(["rose", "tulip"])]   df.filter(pl.col("flower")
                                              .is_in(["rose", "tulip"]))

# select subset of columns
df[["first_name", "last_name"]]             df.select(["first_name", "last_name"])

# conditional filtering     
df["adult"] = df["age"].apply(lambda x:     df.with_columns(
     False if x < 18 else True)                 pl.when(pl.col("age") < 18)
                                                  .then(pl.lit(False))
                                                  .otherwise(pl.lit(True))
                                                  .alias("adult"))
```

There are some things to watch out for as you work with Polars.  Unlike Pandas, Polars is strict with data types - it does not allow for mixed data types in a single column.  For example, you have a column called `numbers` with the following values: `1, 2, 1A` and you attempt to cast these to int values by doing the following: `df.with_columns(pl.col("numbers").cast(pl.Int8), strict=True))`, it will throw an error.  However, if you set `strict` to `False`, it will drop the record with value `1A`.  Another difference is how Polars handles null values.  Pandas treats `None` and `NaN` the same, while Polars considers `None` as a null value but does not consider `NaN` as a null value.  Technically speaking, `NaN` (not a number) is used to represent missing values of float data type while `None` represents missing values of any data type.  A much more detailed explanation of this behavior is provided [here](https://stuffbyyuki.com/handling-missing-values-in-polars/).

Polars also offers a spark like `Lazy API` for even better performance.  Here is an example from the docs:

```python
q = (
    pl.scan_csv("iris.csv")
    .filter(pl.col("sepal_length") > 5)
    .groupby("species")
    .agg(pl.all().sum())
)

df = q.collect()
```

The `scan_csv` command unlike the `read_csv` command lazily loads the file instead of reading the entire file into memory at once.  In the above example, Polars applies predicate pushdown by filtering down to only the records where the `sepal_length` is greater than 5.  It applies projection pushdown by only selecting the columns that are needed.  As a result, only a subset of the data is loaded into memory.

For those who prefer running SQL queries for complex operations, Polars has a `SQLContext`.  The following example shows how to load a lazy dataframe and run queries against it:

```python
lf = pl.LazyFrame({"a": [1, 2, 3], "b": ["x", None, "z"]})
res = pl.SQLContext(frame=lf).execute(
    "SELECT b, a*2 AS two_a FROM frame WHERE b IS NOT NULL"
)
```

It is easy to switch back and forth between Polars and Pandas.  For example, you can convert a Pandas dataframe as follows: `df_pl = pl.from_pandas(df_pd)`.  Similarly, you can convert a Polars dataframe into a Pandas dataframe: `df_pd = pl.to_pandas()`.  This faciliates refactoring existing code and for more flexibility by allowing users to continue to use other third party libraries that only support Pandas.

As you can see, Polars is a very easy to use library that offers a lot of powerful features.  Check out the [docs](https://pola-rs.github.io/polars-book/user-guide/) for more features that are not covered here.
***
Photo by [Hans-Jurgen Mager](https://unsplash.com/@hansjurgen007) on [Unsplash](https://unsplash.com/photos/NL1vH0hnIbQ)