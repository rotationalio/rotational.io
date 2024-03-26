---
title: "Natural Disasters"
slug: "us-geological"
subtitle: "Earthquake Alerts"
draft: false
image: img/data-playground/us-geological.png
github_link: "https://github.com/rotationalio/data-playground/tree/main/earthquakes"
description: Natural disasters are the biggest threat for most industries -- from shipping disruptions that impact the supply chain, to data center losses that cause catastrophic data loss. And unfortunately, due to climate change, natural disasters are on the rise. The U.S. Geological Survey provides the latest alerts as well as detailed information about earthquakes and their impacts. Use Ensign with this data source to generate a time-series dataset that you could use to build ecological impact models or for strategic and/or disaster planning in your industry.
summary: Connect to earthquake data and start experimenting with geological models and apps.
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: The U.S. Geological Survey
producer_link: "https://earthquake.usgs.gov/fdsnws/event/1/"
is_api_key_required: false
api_type: REST
sdks: N/A
limits: None
data: Earthquake data, with magnitudes, locations, and more
is_account_required: false
diagram_image: /img/data-playground/earthquakes-eda.png
diagram_alt: Event-Driven Data Science Use Case with Ensign and USGS
weight: 3
---

{{% data-playground-wrapper %}}

<a href="https://github.com/rotationalio/data-playground/tree/main/earthquakes" class="text-[#1D65A6] font-bold underline">Click here</a> for the code to get data such as:

{{< data-playground-code-fence >}}
```bash
New earthquake report received: {'magnitude': 1.8, 'place': '83 km NW of Karluk, Alaska', 'time': 1688153699651, 'updated': 1688153851807, 'article_link': 'https://earthquake.usgs.gov/earthquakes/eventpage/ak0238bnsgtv', 'type': 'earthquake', 'rms': 0.49, 'gap': None}

New earthquake report received: {'magnitude': 1.09, 'place': '4km ENE of Home Gardens, CA', 'time': 1688153196420, 'updated': 1688153416447, 'article_link': 'https://earthquake.usgs.gov/earthquakes/eventpage/ci40500808', 'type': 'earthquake', 'rms': 0.3, 'gap': 74}

New earthquake report received: {'magnitude': 1.21, 'place': '6 km ENE of Drumright, Oklahoma', 'time': 1688152513740, 'updated': 1688152999250, 'article_link': 'https://earthquake.usgs.gov/earthquakes/eventpage/ok2023msir', 'type': 'quarry blast', 'rms': 0.35, 'gap': 132}

New earthquake report received: {'magnitude': 2.47, 'place': '3 km WSW of La Parguera, Puerto Rico', 'time': 1688151658770, 'updated': 1688152327360, 'article_link': 'https://earthquake.usgs.gov/earthquakes/eventpage/pr71415303', 'type': 'earthquake', 'rms': 0.09, 'gap': 237}
```
{{< /data-playground-code-fence >}}

{{% /data-playground-wrapper %}}

{{< data-playground-content >}}

{{% coming-soon %}}

Coming soon!

{{% /coming-soon %}}
