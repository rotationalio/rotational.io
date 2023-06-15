---
title: "Dc Metro"
slug: "dc-metro"
subtitle: "Stock Market Data" 
draft: false
image: img/data-playground/finnhub.png
summary: Connect to stock market data and start experimenting with financial models and apps.
github_link: "github.com"
description: FinnHub provides real-time stock market data. Note that the stock market is closed during certain times of days and days of the week.
producer_name: FinnHub
producer_link: https://finnhub.io/
data: Stock prices, company profiles, company & market news
is_account_required: false
license: Free
license_warning: Please review terms and conditions Access to data sources can change.
is_api_key_required: false
api_type: REST, Websocket
sdks: Go
limits: N/A
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
