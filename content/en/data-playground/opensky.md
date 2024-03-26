---
title: "Opensky"
slug: "opensky"
subtitle: "Flight Data"
draft: false
image: img/data-playground/opensky.png
github_link: https://github.com/rotationalio/data-playground/tree/main/opensky
description: During the initial novel Coronavirus lockdowns that cities imposed, flight activity decreased by 96%. Several years later, it is still in the process of recovering. Will the travel industry recover from the pandemic? And if so, when? Can flight patterns today be used to predict travel behavior for next year? If you work in Tourism or an adjacent industry, and you aren't already paying attention to patterns in flight activity, you might be interested in this dataset! OpenSky provides flight data by aircraft along with arrivals and departures by airport. Use Ensign with this data source to generate a time-series dataset that you could add as a feature for machine learning models, financial planning, and strategy.
summary: Connect to flight data and start experimenting with aviation models and apps.
license: Free
producer_name: OpenSky
producer_link: https://openskynetwork.github.io/opensky-api/
is_api_key_required: false
api_type: REST
sdks: Python API, Java API
limits: 400 API credits per day and 4,000 API credits per day for OpenSky users
data: Flight data, arrivals, departures, aircraft trajectory
is_account_required: false
diagram_image: /img/data-playground/opensky-eda.png
diagram_alt: Event-Driven Data Science Use Case with Ensign and OpenSky
weight: 6
---

{{% data-playground-wrapper %}}

<a href="https://github.com/rotationalio/data-playground/tree/main/opensky" class="text-[#1D65A6] font-bold underline">Click here</a> for the code to get data such as:

{{< data-playground-code-fence >}}
```bash
Received flight vector: {'icao24': 'a11d08', 'callsign': 'N171BL  ', 'origin_country': 'United States', 'time_position': 1687890269, 'last_contact': 1687890269, 'longitude': -77.8813, 'latitude': 35.8695, 'geo_altitude': 68.58, 'on_ground': False, 'velocity': 44.38, 'true_track': 214.61, 'vertical_rate': -3.9, 'sensors': None, 'barometric_altitude': 160.02, 'transponder_code': None, 'special_purpose_indicator': False, 'position_source': 0, 'category': 0}

Received flight vector: {'icao24': '4b1902', 'callsign': 'SWR86   ', 'origin_country': 'Switzerland', 'time_position': 1687890269, 'last_contact': 1687890269, 'longitude': -62.009, 'latitude': 48.1098, 'geo_altitude': 11468.1, 'on_ground': False, 'velocity': 224.51, 'true_track': 251.98, 'vertical_rate': 0.0, 'sensors': None, 'barometric_altitude': 10972.8, 'transponder_code': None, 'special_purpose_indicator': False, 'position_source': 0, 'category': 1}

Received flight vector: {'icao24': 'e94c88', 'callsign': 'BOV709  ', 'origin_country': 'Bolivia', 'time_position': 1687890270, 'last_contact': 1687890270, 'longitude': -58.5902, 'latitude': -34.7019, 'geo_altitude': 5905.5, 'on_ground': False, 'velocity': 175.39, 'true_track': 337.95, 'vertical_rate': 12.03, 'sensors': None, 'barometric_altitude': 5775.96, 'transponder_code': '0330', 'special_purpose_indicator': False, 'position_source': 0, 'category': 0}
```
{{< /data-playground-code-fence >}}

{{% /data-playground-wrapper %}}

{{< data-playground-content >}}

<section class="ml-10">
    <table class="table-auto border border-collapse border-slate-600 text-md mt-2 overflow-auto">
        <thead class="bg-[#1D65A6] text-white text-left">
            <tr>
                <th class="finnhub-showcase">Creator</th>
                <th class="finnhub-showcase">Description</th>
                <th class="finnhub-showcase">Event Data</th>
                <th class="finnhub-showcase">URL</th>
                <th class="finnhub-showcase">GitHub</th>
                <th class="finnhub-showcase">Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="finnhub-showcase">Benjamin Bengfort</td>
                <td class="finnhub-showcase">Sentiment Analysis on US Flight Reviews</td>
                <td class="finnhub-showcase">Reviews and Sentiment</td>
                <td class="finnhub-showcase">Coming Soon!</td>
                <td class="finnhub-showcase underline">
                    <a href="https://github.com/bbengfort/sentiment-reviews" target="_blank">https://github.com/bbengfort/sentiment-reviews</a></td>
                <td class="finnhub-showcase">2023-09-12</td>
            </tr>
        </tbody>
    </table>
</section>

