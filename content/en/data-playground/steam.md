---
title: "Steam"
slug: "steam"
subtitle: "Stock Market Data" 
draft: false
image: img/data-playground/finnhub.png
link: "github.com"
description: FinnHub provides real-time stock market data. Note that the stock market is closed during certain times of days and days of the week.
summary: Connect to stock market data and start experimenting with financial models and apps.
license: Free
producer_name: FinnHub
producer_link: https://finnhub.io/
api_key: Yes
api_type: REST, Websocket
sdks: Go
limits: N/A
data: Stock prices, company profiles, company & market news
account_required: Yes
weight: 3
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
