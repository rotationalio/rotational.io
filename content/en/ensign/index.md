---
date: 2022-12-15T10:09:42Z
title: "Ensign Use Cases"
headertext: "Ensign Use Cases"
noicon: true
type: "ensign"
switch:
    link: /ensign-enterprise/
    text: "Learn about Ensign for Enterprise"
---

{{< usecase-double color="#ECF6FF" >}}

{{% usecase %}}

{{% usecase-header %}}
## Turn Your Model into an API

{{% /usecase-header %}}

Data science teams are realizing that they must be in charge of deploying and managing their models. Sound controversial? Check out [this article](https://venturebeat.com/ai/why-do-87-of-data-science-projects-never-make-it-into-production/) about why 87% of data science projects never make it to production.

Using [Ensign](https://rotational.app/) to turn your model into an API is the easiest way for a data science team to get a trained model into production. Ensign can be used to register requests for predictions from multiple applications, to route those inputs to the trained model, and to return model predictions back to the user.

To learn more about this use case, check out [MLOps 201: Asynchronous Inference](https://youtu.be/w69glRpOBD4?si=PWUwRpXrnYGhwntb) for details and code in Python.

{{% /usecase %}}

{{< usecase-image src="/img/ensign/model_api_use_case.png" alt="A high-level illustation that shows how Ensign can be used to register requests for predictions from multiple applications, to route inputs to the model, and to route model predictions back to the user." >}}

{{< /usecase-double >}}

{{< usecase-double color="#ECF6FF" >}}

{{% usecase %}}

{{% usecase-header %}}
## Bootstrap an LLM with Transfer Learning

{{% /usecase-header %}}

Large language models (LLMs) are powerful but tricky. What if blackbox models like ChatGPT don't work for your use case? What if you don't have enough data to train a model from scratch?

Using [Ensign](https://rotational.app/) and HuggingFace, you can start incrementally delivering insights to your organization **now**. Ensign can be used to ingest training data for transfer learning and to route that training data either to a Hugging Face model trainer or the bootstrapped Hugging Face model (or to both).

To learn more about this use case, check out this guide to [Streaming NLP Analytics Made Easy](https://rotational.io/blog/streaming-nlp-with-llms-and-ensign/) for more details and code in Python.

{{% /usecase %}}

{{< usecase-image src="/img/ensign/llm_use_case.png" alt="A high-level illustration of how to use Ensign to ingest training data for transfer learning and to route that training data either to a Hugging Face model trainer or the bootstrapped Hugging Face model, or both." >}}

{{< /usecase-double >}}


{{< usecase-double color="#ECF6FF" >}}
{{% usecase %}}

{{% usecase-header %}}
## Transform Static Data into Change Flows

{{% /usecase-header %}}

RESTful data APIs are a great way to source data, but most give only a snapshot of the current state of the data.  Most applications require more information; such as longitudinal or seasonal patterns, updates on what new instances have been introduced to the dataset since the last pull, or flags for things that have been removed.

Using [Ensign](https://rotational.app/), you can transform a static data source (like an external data API) into a time-series dataset to be used for machine learning and real-time analytics.

Check out more examples of open data sources that can be transformed into real-time sources on [The Data Playground](https://rotational.io/data-playground).

{{% /usecase %}}

{{< usecase-image src="/img/ensign/cdc_use_case.png" alt="A high-level illustration of how to transform a static data source into a time-series dataset to be used for machine learning and real-time analytics." >}}

{{< /usecase-double >}}

## The Ensign Difference

How does Ensign stack up to other, similar tools and products?

<!-- Edit the competitive landscape table at data/en/ensign.yml -->
{{< competitive-landscape >}}

<!-- ## Built for the Modern Data Team

Whether you wear one hat or all the hats, the right tool can make a world of difference. -->

<!-- Different Hats Section with 3 Cards -->
<!-- {{< triple >}}
{{% vtriple color="#E3E3E1" %}}
### Developers

{{< usecase-image src="/img/ensign/otter_developer.png" alt="Otter software developer face wearing glasses and a beret" >}}

Quickly build event-driven APIs to leverage the publish-subscribe model for scalable and reliable microservices.

{{< button href="https://ensign.rotational.dev/" text="Learn More">}}

{{% /vtriple %}}

{{% vtriple color="#E3E3E1" %}}
### Data Scientists

{{< figure src="/img/ensign/otter_data_scientist.png" alt="Otter data scientist face with a goatee" >}}

Self-serve data and move from batch processing to real-time machine learning. Bonus:
skip over all those MLOps headaches.

{{< button href="https://ensign.rotational.dev/examples/data_scientists/" text="Learn More">}}

{{% /vtriple %}}

{{% vtriple color="#E3E3E1" %}}
### DBAs/Data Engineers

{{< figure src="/img/ensign/otter_data_engineer.png" alt="Otter data engineer face with earings, a pony tail, and a pencil behind the ear" >}}

Let downstream consumers define their own data schemas rather than struggling to find a schema everyone can agree on.

{{< button href="https://ensign.rotational.dev/examples/data_engineers/" text="Learn More">}}

{{% /vtriple %}}
{{< /triple >}}

## Join our Growing Community!

{{% uneven %}}
{{% skinnyright %}}
### Get Started

- [Create an account](https://rotational.app/register)
- Invite teammates
- Generate API keys
- Setup topics
- Use our [developer-friendly SDKs](https://ensign.rotational.dev/sdk/)

### Resources

- [Documentation](https://ensign.rotational.dev)
- [SDKs](https://ensign.rotational.dev/sdk/)
- [GitHub Repo](https://github.com/rotationalio/ensign)
- [Youtube Channel](https://www.youtube.com/@rotationalio)
- [Data Playground](https://rotational.io/data-playground/)
- [Learn EnSQL](https://ensign.rotational.dev/ensql/)
{{% /skinnyright %}}

{{< comic >}}
{{% /uneven %}} -->

{{< ensigncoa btnhref="https://rotational.app/register" btntext="Create Account" >}}
Create your no-cost starter account today!
{{< /ensigncoa >}}

<!-- NOTE: Switch link at bottom of page is defined by frontmatter on the page. -->