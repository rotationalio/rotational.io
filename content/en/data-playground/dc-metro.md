---
title: "DC Metro"
slug: "dc-metro"
subtitle: "Public Transport Data" 
draft: false
image: img/data-playground/dc-metro.png
summary: Connect to DC Metro public transport data and start experimenting with scheduling models and apps.
github_link: https://github.com/rotationalio/data-playground/tree/main/wmata
description: DC WMATA provides public transportation data such as real-time bus and rail predictions. 
producer_name: DC WMATA
producer_link: https://developer.wmata.com/docs/services/gtfs/operations/bus-gtfs-static
data: Bus & train trip updates, alerts, and vehicle positions.
is_account_required: false
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
is_api_key_required: true
api_type: GTFS protocol buffers
sdks: N/A
limits: None
weight: 5
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
