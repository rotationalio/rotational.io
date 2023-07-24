---
date: 2023-02-09T10:21:41-06:00
headertext: Ingest. Train. Deploy.
headertextmore: Repeat.
headeractions:
- action: Create an Account
  link: "https://rotational.app/register"
- action: Learn more
  link: "/ensign/"
---

<!-- Home Intro is the first section on the webpage -->
{{< home-intro image="img/global_data_blue_flow_clip.png" >}}
**Disconnected Data Sources? Meet Real-time Insights**

Ensign is a cloud native, cloud agnostic, real-time data streaming platform that seamlessly integrates your disconnected data.

- Faster analytics that don't wait for data to accumulate
- Build rapid prototypes in days rather than months
- No cluster management or YAML editing required
- Leverage the skills and infrastructure you *already have*

Get started in minutes with an API key and developer-friendly SDKs. Made to fit any
tech stack.
{{< /home-intro >}}

<!-- Edit and add clients in data/en/clients.yml -->
{{< clients >}}

<!-- Ensign for Data Teams and Enterprise Section -->
<!-- container double makes this a two column section with the specified bg color -->
{{< container color="#E3E3E1" >}}
{{< double >}}

<!-- Ensign for Data Teams -->
{{% vtriple %}}
### Data Science 2.0

{{< figure src="/img/three_otters_new.png" alt="Sea Otter Engineers" >}}

Open-source tools to rapidly prototype new data pipelines, integrate realtime analytics, and get your data science predicting beyond the batch.

{{< button href="/ensign/" text="Learn More">}}

{{% /vtriple %}}

<!-- Ensign for Enterprise -->
{{% vtriple %}}
### Ensign for Enterprise

{{< figure src="/img/globe.png" alt="Globe" >}}

Cooperation-as-a-service. Break down data silos and build low-maintenance topologies tailored to your business. Cloud, on prem, edge or hybrid.
{{< button href="/ensign-enterprise/" text="Learn More">}}

{{% /vtriple %}}
{{< /double >}}
{{< /container >}}

<!-- Get Started section has custom CSS so needs to be in its own shortcode -->
{{< get-started >}}

### Get Started

{{< widefigure src="/img/get_started.png" alt="Getting Started Steps">}}

[Curious? Check out the GitHub Repo.](https://github.com/rotationalio/ensign)

{{< /get-started >}}

<!-- On the Cloud section -->
{{< container color="#ECF6FF" >}}

{{< button href="https://rotational.app/register" text="Create Account">}}

<!-- Data for cloud partners can be found at data/en/cloud.yml -->
{{< clouds >}}

{{< /container >}}



<!-- NOTE: Recent Rotations is part of the template and is added after the content -->