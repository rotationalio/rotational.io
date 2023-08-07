---
title: "Opensky"
slug: "opensky"
subtitle: "Flight Data"
draft: false
image: img/data-playground/opensky.png
github_link: https://github.com/rotationalio/data-playground/tree/main/opensky
description: OpenSky provides flight data by aircraft along with arrivals and departures by airport.
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

Sample data returned by `Subscriber`:
```bash
Received flight vector: {'icao24': 'a11d08', 'callsign': 'N171BL  ', 'origin_country': 'United States', 'time_position': 1687890269, 'last_contact': 1687890269, 'longitude': -77.8813, 'latitude': 35.8695, 'geo_altitude': 68.58, 'on_ground': False, 'velocity': 44.38, 'true_track': 214.61, 'vertical_rate': -3.9, 'sensors': None, 'barometric_altitude': 160.02, 'transponder_code': None, 'special_purpose_indicator': False, 'position_source': 0, 'category': 0}

Received flight vector: {'icao24': '4b1902', 'callsign': 'SWR86   ', 'origin_country': 'Switzerland', 'time_position': 1687890269, 'last_contact': 1687890269, 'longitude': -62.009, 'latitude': 48.1098, 'geo_altitude': 11468.1, 'on_ground': False, 'velocity': 224.51, 'true_track': 251.98, 'vertical_rate': 0.0, 'sensors': None, 'barometric_altitude': 10972.8, 'transponder_code': None, 'special_purpose_indicator': False, 'position_source': 0, 'category': 1}

Received flight vector: {'icao24': 'e94c88', 'callsign': 'BOV709  ', 'origin_country': 'Bolivia', 'time_position': 1687890270, 'last_contact': 1687890270, 'longitude': -58.5902, 'latitude': -34.7019, 'geo_altitude': 5905.5, 'on_ground': False, 'velocity': 175.39, 'true_track': 337.95, 'vertical_rate': 12.03, 'sensors': None, 'barometric_altitude': 5775.96, 'transponder_code': '0330', 'special_purpose_indicator': False, 'position_source': 0, 'category': 0}
```

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{% coming-soon %}}

Coming soon!

{{% /coming-soon %}}

