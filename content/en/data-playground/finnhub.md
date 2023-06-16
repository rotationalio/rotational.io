---
title: "Finnhub"
slug: "finnhub"
subtitle: "Stock Market Data"
draft: false
image: img/data-playground/finnhub.png
github_link: "github.com"
description: FinnHub provides real-time stock market data. Note that the stock market is closed during certain times of days and days of the week.
summary: Connect to stock market data and start experimenting with financial models and apps.
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: FinnHub
producer_link: https://finnhub.io/
is_api_key_required: true
api_type: REST, WebSocket
sdks: Go
limits: N/A
data: Stock prices, company profiles, company & market news
is_account_required: true
weight: 1
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

import (
  "fmt"
)

type Vehicle struct {
  Wheels int64
  IsElectric bool
  EngineType string
}

type Car struct {
  *Vehicle
  Price float64
}

func (v *Vehicle) CreateVehicle() {
  v.Wheels = 4
  v.IsElectric = false
  v.EngineType = "V4"
}

// Go supports composition, which is the act of including one structure into another.
// In some languages, this is called a trait or a mixin.
// Languages that don’t have an explicit composition mechanism can always do it the long way.
func main() {
  v := new (Vehicle)
  v.CreateVehicle()

  c := new (Car)
  c.Price = 239.49
  c.Vehicle = v

  // Important : use this c.Vehicle.EngineType OR c.EngineType
  fmt.Println("The vehicle has " + c.Vehicle.EngineType + " engine")
  fmt.Println("The price of the car is " + fmt.Sprintf("%.2f", c.Price))

}
```

{{% /data-playground-code-tab %}}
{{% /data-playground-code-tabs %}}

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}
