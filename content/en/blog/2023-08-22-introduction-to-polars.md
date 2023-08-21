---
title: "Intro to Polars: A Pandas Alternative for Efficiently Working with Large Datasets"
slug: "introduction-to-polars"
date: "2023-08-22T14:13:11-04:00"
draft: false
image: img/blog/2023-08-18-introduction-to-polars/polar-bears-unsplash.jpg
photo_credit: Photo by Hans-Jurgen Mager on Unsplash
author: Prema Roman
profile: img/team/prema-roman.png
category: Python, Data
description: "Love Pandas? Check out this overview of Polars - the new high-performance Python data processing library."
---


Dataframes are a powerful data structure for data processing, analytics, and ML. For many years, Pandas has been my go-to. But it can really slow you down when you're working with big or high-dimensional data. Enter Polars!

<!--more-->

## Pandas Was a Game-Changer
To those of us whose early data science workflows consisted of writing SQL queries and then dumping the results into Excel for analysis, Pandas was a game-changer.

Pandas offered a one-stop shop solution that allowed us to work with tabular data and write SQL-like functions. Still need to work with databases? Pandas also has very easy-to-use functions to read from and write to databases. I was recently reminded of how good the library is in doing all the work for you when I struggled using Redshift’s `COPY` function to do the same. For those who have had to do this, you know that if you are not sufficiently precise in defining your parameters and column names, you are in for a lot of headaches. Imagine you had to write to a table with a very long list of columns. Good luck with that!

## Searching for a Drop-In Replacement for Pandas

But Pandas and other libraries like scikit-learn were born in an era when datasets were much smaller than they are now. Anyone who uses these tools with large datasets inevitably runs into performance issues. But before you ask your devOps team for more compute resources, there may be some things you can do to help solve the performance bottleneck.

An early example was Spark; I have used Spark and it does a really good job with big data, but it has a steep learning curve because not only do you have to learn a new API, you have to learn the mechanics of distributed computing. The biggest gotcha that comes with Spark is lazy loading. You think everything is going great until you call `collect()` and then... everything slows to a crawl. By this point, you've probably written several transformations on the data and you have to figure out where you messed up.  The cause of the bottleneck can be any number of reasons, from a huge number of nulls in one column in one table causing a problem in a join statement, to a computation that’s happening on a driver node that's too small to handle the large volume of data.

There have been many alternatives introduced over the years, from [koalas](https://github.com/databricks/koalas) to [Dask dataframes](https://docs.dask.org/en/stable/dataframe.html), but none ever quite clicked for my workflow. Luckily, there are new tools coming out all the time!

## Testing Out Polars for the First Time

Recently, when I ran into the familiar Pandas performance problems, I decided to try out [Polars](https://www.pola.rs/). I had heard that Polars had an API that is just as accessible as Pandas, but more efficient. I was not disappointed!

Polars uses Apache Arrow under the hood, taking advantage of columnar schema, which makes aggregations and analytics **much faster** than Pandas with a **much smaller** memory footprint. It also has built-in optimizations that allow it to make use of all the available CPUs on your behalf.

I was very impressed by the developer experience of using Polars. The creators put in a lot of work to keep the API as similar to Pandas as possible. Some of the other syntax that I came across with was also familiar to me because it is similar to Spark. So it seems that Polars is inspired by both Pandas and Spark.

Here are some ways Polars is similar to Pandas. *Note that the syntax, options, and parameters may be slightly different depending on your version.*

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

To be sure, there are ways in which the API is different from Pandas. For those who have used Spark, some of these examples will look familiar:

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

## Key API Differences between Pandas and Polars

There are a couple things to watch out for as you work with Polars.

### No Mixed Types

Unlike Pandas, Polars is strict with data types &mdash; it does not allow for mixed data types in a single column.

Imagine you have a column called `numbers` with the following values: `["1", "2", "1A"]`

Polars will throw an error if you attempt to cast these to int values by doing something like this:

`df.with_columns(pl.col("numbers").cast(pl.Int8), strict=True))`

If you set `strict` to `False`, Polars will drop the record with value `1A`.

### `None` != `NaN`

Another difference is how Polars handles null values.

Pandas treats `None` and `NaN` the same, while Polars considers `None` as a null value but does not consider `NaN` as a null value. Technically speaking, `NaN` (not a number) is used to represent missing values of float data type, while `None` represents missing values of any data type. If you want to read a much more detailed explanation of this behavior, I strongly recommend [this excellent post](https://stuffbyyuki.com/handling-missing-values-in-polars/) by Yuki Kakegawa.

### Lazy Loading that's Easier to Reason About

Polars also offers a Spark-like `Lazy API` for even better performance.  Here is an example from the docs. The `scan_csv` command unlike the `read_csv` command lazily loads the file instead of reading the entire file into memory at once:

```python
q = (
    pl.scan_csv("iris.csv")
    .filter(pl.col("sepal_length") > 5)
    .groupby("species")
    .agg(pl.all().sum())
)

df = q.collect()
```

In the above example, Polars applies predicate pushdown by filtering down to only the records where the `sepal_length` is greater than 5. It applies projection pushdown by only selecting the columns that are needed. As a result, only a subset of the data is loaded into memory.

### Complex SQL Queries

As most ML engineers know, converting queries into pure SQL is one of the best way to speak up a slow data science product.

Polars has a `SQLContext` for those who prefer running SQL queries for complex operations. The following example shows how to load a lazy dataframe and run queries against it:

```python
lf = pl.LazyFrame({"a": [1, 2, 3], "b": ["x", None, "z"]})
res = pl.SQLContext(frame=lf).execute(
    "SELECT b, a*2 AS two_a FROM frame WHERE b IS NOT NULL"
)
```

## Conclusion: Use Pandas and Polars Together!

It's usually not necessary to complete remove Pandas in order to make your data processing and modeling pipelines work. You can can just swap out the parts that are slow and leave the rest of the code in Pandas. It is easy to switch back and forth between Polars and Pandas. You can convert a Pandas dataframe as follows: `df_pl = pl.from_pandas(df_pd)`.  Similarly, you can convert a Polars dataframe into a Pandas dataframe: `df_pd = pl.to_pandas()`.  This faciliates refactoring existing code and for more flexibility by allowing users to continue to use other third party libraries that only support Pandas.

As you can see, Polars is a very easy-to-use library that offers a lot of powerful features. If you are someone who "thinks in dataframes", Polars is a great resource to help you build more efficient data science and machine learning models. Check out the [docs](https://pola-rs.github.io/polars-book/user-guide/) for more details, features, and code snippets!


***
Photo by [Hans-Jurgen Mager](https://unsplash.com/@hansjurgen007) on [Unsplash](https://unsplash.com/photos/NL1vH0hnIbQ)