---
title: "NOAA"
slug: "noaa"
subtitle: "Weather Data"
draft: false
image: img/data-playground/noaa.png
github_link: https://github.com/rotationalio/data-playground/tree/main/weather
description: At the risk of pointing out something that you, Dear Reader, may find rather obvious, weather is influential. Like the stock market, there are very few problems that aren't in some way influenced by the weather. And while the weather does not tend to be especially predictable on a day-to-day basis, it is a good predictor of season patterns for a great many things. Is your industry or organization impacted by the weather in ways you could better prepare for? The National Oceanic and Atmospheric Administration's (NOAA's) National Weather Service offers critical real-time data including forecasts, alerts, observations, and other weather data. Use Ensign with this data source to generate a time-series dataset that you could add as a feature for machine learning models, financial planning, and strategy.
summary: The National Weather Service (NWS) API allows access to critical forecasts, alerts, observations, and other weather data.
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: NOAA
producer_link: https://www.weather.gov/documentation/services-web-api
is_api_key_required: false
api_type: REST, JSON-LD, GeoJSON, OXML
sdks: N/A
limits: The rate limit is not public information, but allows a generous amount for typical use. If the rate limit is exceeded, the request will return with an error, and may be retried after the limit clears (typically within 5 seconds). Proxies are more likely to reach the limit, whereas requests directly from clients are not likely.
data: Weather forecasts, alerts, and observations
is_account_required: false
diagram_image:
diagram_alt:
weight: 2
---

{{% data-playground-wrapper %}}

<a href="https://github.com/rotationalio/data-playground/tree/main/weather" class="text-[#1D65A6] font-bold underline">Click here</a> for the code to get data such as:
```bash
New weather report received: {'name': 'This Afternoon', 'summary': 'Mostly Cloudy', 'temperature': 71, 'units': 'F', 'daytime': True, 'start': '2023-06-26T14:00:00-08:00', 'end': '2023-06-26T18:00:00-08:00'}

New weather report received: {'name': 'Tonight', 'summary': 'Mostly Cloudy then Isolated Rain Showers', 'temperature': 51, 'units': 'F', 'daytime': False, 'start': '2023-06-26T18:00:00-08:00', 'end': '2023-06-27T06:00:00-08:00'}

New weather report received: {'name': 'Tuesday', 'summary': 'Isolated Rain Showers', 'temperature': 73, 'units': 'F', 'daytime': True, 'start': '2023-06-27T06:00:00-08:00', 'end': '2023-06-27T18:00:00-08:00'}

New weather report received: {'name': 'Tuesday Night', 'summary': 'Mostly Cloudy', 'temperature': 52, 'units': 'F', 'daytime': False, 'start': '2023-06-27T18:00:00-08:00', 'end': '2023-06-28T06:00:00-08:00'}
```

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{% coming-soon %}}

Coming soon!

{{% /coming-soon %}}

