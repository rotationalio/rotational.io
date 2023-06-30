---
title: "Steam"
slug: "steam"
subtitle: "Game Reviews"
draft: false
image: img/data-playground/steam.png
github_link: "https://github.com/rotationalio/data-playground/tree/main/steam"
description: The Steam API allows users to fetch statistics for individual games, data about users, or news feeds for game updates. All of this can be brought to bear to create powerful analytics on top of video game data made seamless using Ensign.
summary: Connect to game review data and start experimenting with game review models and apps.
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: Steam
producer_link: https://steam.io/
is_api_key_required: true
api_type: REST
sdks: N/A
limits: 100,000 API calls per day
data: Game data and player stats
is_account_required: false
weight: 3
---

{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}


{{% data-playground-code-tab tabIndex="go" name="Go"  %}}

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type SteamApps struct {
	AppList struct {
		Apps []SteamApp
	}
}

type SteamApp struct {
	AppId uint64
	Name  string
}

type AppReviews struct {
	Success      int
	QuerySummary QuerySummary
	Reviews      []Review
}

type QuerySummary struct {
	NumberReviews          int
	ReviewScore            int
	ReviewScoreDescription string
	TotalPositive          int
	TotalNegative          int
	TotalReviews           int
}

type Review struct {
	ID                string
	Author            Author
	Language          string
	Review            string
	TimeCreated       int64
	TimeUpdated       int64
	VotedUp           bool
	VotesUp           int
	VotesDown         int
	VotesFunny        int
	WeightedVoteScore string
	CommentCount      json.RawMessage
	SteamPurchase     bool
	ReceivedForFree   bool
	EarlyAccess       bool
}

type Author struct {
	UserID               string
	NumberGamesOwned     int
	NumberReviews        int
	PlayTimeForever      int
	PlaytimeLastTwoWeeks int
	LastPlayed           int64
}

func main() {
	var err error
	var response *http.Response
	if response, err = http.Get("https://api.steampowered.com/ISteamApps/GetAppList/v2/"); err != nil {
		fmt.Println(err)
		return
	}
	defer response.Body.Close()

	var apps SteamApps
	if response.StatusCode != 200 {
		fmt.Println("status code", response.StatusCode)
		return
	}
	json.NewDecoder(response.Body).Decode(&apps)

	var reviews AppReviews
	url := "https://store.steampowered.com/appreviews/413150?json=1'"
	if response, err = http.Get(url); err != nil {
		fmt.Println(err)
		return
	}
	json.NewDecoder(response.Body).Decode(&reviews)

	fmt.Println(len(reviews.Reviews))
	fmt.Println(reviews.Reviews[0].Review)
}

```

{{% /data-playground-code-tab %}}
{{% data-playground-code-tab tabIndex="python" name="Python"  %}}

```python
def example():
      print("Code snippet coming soon!")
```

{{% /data-playground-code-tab %}}
{{% /data-playground-code-tabs %}}

{{% /data-playground-wrapper %}}

{{% data-playground-content %}}

<!-- Add content for data playground here, including a table for data products if available -->

{{% /data-playground-content %}}

{{% coming-soon %}}

Coming soon!

{{% /coming-soon %}}
