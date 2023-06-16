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
weight: 6
---

{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}
{{% data-playground-code-tab tabIndex="python" name="Python"  %}}

```python
def example(name):
      print(f"example, {name}!")
```

{{% /data-playground-code-tab %}}

{{% data-playground-code-tab tabIndex="go" name="Go"  %}}

```go {linenos=table,hl_lines=[1,"3-4"]}
package main
import "fmt"
func main() {
    fmt.Println("hello world")
}
```

{{% /data-playground-code-tab %}}
{{% /data-playground-code-tabs %}}

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

