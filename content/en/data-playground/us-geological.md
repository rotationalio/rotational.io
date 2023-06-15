---
title: "US Geological"
slug: "us-geological"
subtitle: "Earthquake Data" 
draft: false
image: img/data-playground/us-geological.png
github_link: "https://github.com/rotationalio/data-playground/tree/main/usgs"
description: US Geological provides reports on earthquakes and their impact.
summary: Connect to earthquake data and start experimenting with geological models and apps.
license: Free
license_warning: Please review terms and conditions Access to data sources can change.
producer_name: US Geological
producer_link: "https://earthquake.usgs.gov/fdsnws/event/1/"
is_api_key_required: true
api_type: REST
sdks: N/A
limits: N/A
data: Earthquake data
account_required: false
weight: 4
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
