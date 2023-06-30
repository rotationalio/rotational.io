---
title: "{{ replaceRE "^[-0-9]{10}-" "" .Name | replaceRE "-" " " | title }}"
slug: "{{ replaceRE "^[-0-9]{10}-" "" .Name }}"
subtitle: "Add Data Type Here" 
draft: true
image: img/data-playground/data-source-img.png
summary: "Add Summary To Display On List Page Here"
github_link: "https://github.com/rotationalio/[insert-link-here]"
description: "Add About This Data Source Description Here"
producer_name: "Add Producer Name Here"
producer_link: "https://finnhub.io"
data: "Add Details About the Data Provided Here"
is_account_required: false
license: "Add Data Source License Type Here (Ex. Free, Commercial)"
license_warning: "Add License description if applicable"
is_api_key_required: false
api_type: "Add API Type(s) Provided Here and Separate Multiple Types With A Comma"
sdks: "Add Available SDKs Here and Separate Multiple SDKs With A Comma"
limits: "Add API Limit Information Here, If Available"

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
