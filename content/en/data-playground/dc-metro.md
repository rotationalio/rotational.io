---
title: "DC Metro"
slug: "dc-metro"
subtitle: "Public Transport Data"
draft: false
image: img/data-playground/dc-metro.png
summary: Connect to DC Metro public transport data and start experimenting with scheduling models and apps.
github_link: https://github.com/rotationalio/data-playground/tree/main/wmata
description: DC WMATA provides public transportation data such as real-time bus and rail predictions.
producer_name: Washington Metro Area Transit Authority (WMATA)
producer_link: https://developer.wmata.com/
data: Bus & train trip updates, alerts, and vehicle positions.
is_account_required: true
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
is_api_key_required: true
api_type: JSON, GTFS protocol buffers
sdks: N/A
limits: The default tier (free) is rate-limited to 10 calls/second and 50,000 calls per day.
diagram_image: /img/data-playground/wmata-eda.png
diagram_alt: Event-Driven Data Science Use Case with Ensign and WMATA
weight: 5
---
{{% data-playground-wrapper %}}

Sample data returned by `Subscriber`:
```bash
New metro report received: {'incident_id': '001E815C-4A62-47EE-843D-5F0B788C799C', 'incident_type': 'Alert', 'routes_affected': ['P12'], 'description': 'Due to an accident at Addison Rd Station, buses may experience delays.', 'date_updated': '2023-07-03T13:43:14'}

New metro report received: {'incident_id': '38102CBA-04FA-4D88-B9B8-41E9D2549C73', 'incident_type': 'Alert', 'routes_affected': ['32'], 'description': 'Due to an accident on Pennsylvania Ave SE at 6th St, buses may experience delays.', 'date_updated': '2023-07-03T13:20:19'}

New metro report received: {'incident_id': '03EF58CA-4C96-477B-B0F8-E0B5EA2179D5', 'incident_type': 'Alert', 'routes_affected': ['32', '33', '36'], 'description': 'Buses are detouring, due to the DC 4th of July Celebration. More info at \nhttps://buseta.wmata.com', 'date_updated': '2023-07-03T06:15:34'}

New metro report received: {'incident_id': 'C83592B3-8399-4426-8568-FFCA1E5B3D9D', 'incident_type': 'Alert', 'routes_affected': ['W4'], 'description': 'Due to a mechanical issue at Anacostia Station on the W4 route, buses may experience delays.', 'date_updated': '2023-07-03T13:07:18'}

New metro report received: {'incident_id': '7B640278-9219-430F-A59C-81C5F7BDE5EA', 'incident_type': 'Alert', 'routes_affected': ['F4'], 'description': 'Due to a mechanical issue on Riggs Rd at East West Hwy on the F4 Route, buses are experiencing delays.', 'date_updated': '2023-07-03T12:18:34'}
```

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{% coming-soon %}}

Coming soon!

{{% /coming-soon %}}