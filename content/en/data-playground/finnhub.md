---
title: "Finnhub"
slug: "finnhub"
subtitle: "Stock Market Data"
draft: false
image: img/data-playground/finnhub.png
github_link: https://github.com/rotationalio/data-playground/tree/main/finnhub
description: You'd be hard-pressed to find a real-world machine learning problem that isn't related (however distantly) to the stock market. Public Policy, Politics, Scientific Research, Manufacturing, Media, and Fashion are all domains that are influenced by economic forces. If you've always wondered if you or your organization could (or should) be doing more to quantify that influence, look no further! FinnHub provides free real-time stock market data. Use Ensign with this data source to generate a time-series dataset that you could add as a feature for machine learning models, financial planning, and strategy. (Note that the stock market is closed during certain times of days and days of the week.)
summary: Finnhub provides real-time RESTful APIs and WebSocket for stocks, currencies, and crypto.
license: Free, Commercial
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: FinnHub
producer_link: https://finnhub.io/
is_api_key_required: true
api_type: REST, WebSocket
sdks: Python, Go
limits: "60 API calls/minute for the free tier. Other pricing plans available."
data: Stock prices, company profiles, company & market news
is_account_required: true
diagram_image: /img/data-playground/finnhub_flowchart.png
diagram_alt: Finnhub integration with Ensign.
weight: 1
---

{{% data-playground-wrapper %}}
<a href="https://github.com/rotationalio/data-playground/tree/main/finnhub" class="text-[#1D65A6] font-bold underline">Click here</a> for the code to get data such as:
```json
{"symbol": "AMZN", "time": "12:18:03", "price": "127.88", "price_pred": "183.5796"}

{"symbol": "AAPL", "time": "12:18:03", "price": "189.36", "price_pred": "181.8145"}

{"symbol": "MSFT", "time": "12:18:03", "price": "334.71", "price_pred": "180.2801"}
```

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{< data-playground-showcase >}}