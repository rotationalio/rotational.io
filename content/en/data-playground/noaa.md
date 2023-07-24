---
title: "NOAA"
slug: "noaa"
subtitle: "Weather Data"
draft: false
image: img/data-playground/noaa.png
github_link: https://github.com/rotationalio/data-playground/tree/main/weather
description: The National Oceanic and Atmospheric Administration's (NOAA's) National Weather Service offers critical real-time data. Get forecasts, alerts, observations, and other weather data.
summary: The National Weather Service (NWS) API allows access to critical forecasts, alerts, observations, and other weather data.
license: Free
license_warning: Please review terms and conditions. Access to data sources can change.
producer_name: NOAA
producer_link: https://www.weather.gov/documentation/services-web-api
is_api_key_required: false
api_type: REST, JSON-LD, GeoJSON, OXML
sdks: N/A
limits: The rate limit is not public information, but allows a generous amount for typical use. If the rate limit is exceeded, the request will return with an error, and may be retried after the limit clears (typically within 5 seconds). Proxies are more likely to reach the limit, whereas requests directly from clients are not likely.
data: Weather forecasts, alerts, and observations
is_account_required: false
diagram_image:
diagram_alt:
weight: 2
---

{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}

{{% data-playground-code-tab tabIndex="python" name="Python"  %}}

```python
import json
import asyncio
import warnings
from datetime import datetime

import requests
from pyensign.events import Event
from pyensign.ensign import Ensign

# TODO Python>3.10 needs to ignore DeprecationWarning: There is no current event loop
warnings.filterwarnings("ignore")

# TODO: replace with YOU - your email and app details :)
ME = "(https://rotational.io/data-playground/noaa/, weather@rotational.io)"

# TODO: these are memorable for ME. Replace with the locations of interest to YOU
LOCS = {
    "north_pole": {
        "lat": "64.7511",
        "long": "-147.3494"
    },
    "cafe_du_monde": {
        "lat": "29.957684",
        "long": "-90.061892"
    },
}

class WeatherPublisher:
    """
    WeatherPublisher queries an API for weather updates and publishes events to Ensign.
    """
    def __init__(self, topic="noaa-reports-json", interval=60, locations=LOCS, user=ME):
        """
        Initialize a WeatherPublisher by specifying a topic, locations, and other user-
        defined parameters.

        Parameters
        ----------
        topic : string, default: "noaa-reports-json"
            The name of the topic you wish to publish to. If the topic doesn't yet
            exist, Ensign will create it for you. Tips on topic naming conventions can
            be found at https://ensign.rotational.dev/getting-started/topics/

        interval : int, default: 60
            The number of seconds to wait between API calls so that you do not anger
            the weather API gods

        locations : dict
            A dictionary expressing the locations to retrieve weather details for.
            Note that these should all be in the USA since NOAA is located in the US :)

        user : str
            When querying the NOAA API, as a courtesy, they like you to identify your
            app and contact info (aka User Agent details)
        """
        self.topic = topic
        self.interval = interval
        self.locations = locations
        self.url = "https://api.weather.gov/points/"
        self.user = {"User-Agent": user}
        self.datatype = "application/json"

        # NOTE: If you need a client_id and client_secret, register for a free account
        # at: https://rotational.app/register

        # Start a connection to the Ensign server. If you do not supply connection
        # details, PyEnsign will read them from your environment variables.
        self.ensign = Ensign()

        # Alternatively you can supply `client_id` & `client_secret` as string args, eg
        # self.ensign = Ensign(client_id="your_client_id", client_secret="your_secret")

    async def print_ack(self, ack):
        """
        Enable the Ensign server to notify the Publisher the event has been acknowledged

        This is optional for you, but can be very helpful for communication in
        asynchronous contexts!
        """
        ts = datetime.fromtimestamp(
            ack.committed.seconds + ack.committed.nanos / 1e9)
        print(f"Event committed at {ts}")

    async def print_nack(self, nack):
        """
        Enable the Ensign server to notify the Publisher the event has NOT been
        acknowledged

        This is optional for you, but can be very helpful for communication in
        asynchronous contexts!
        """
        print(f"Event was not committed with error {nack.code}: {nack.error}")

    def compose_query(self, location):
        """
        Combine the base URI with the lat/long query params

        Parameters
        ----------
        location : dict
            A dictionary expressing a location to retrieve weather details for.
            Note that it should all be in the USA since NOAA is located in the US :)
            For example: {"lat": "64.7511", "long": "-147.3494"}
        """
        lat = location.get("lat", None)
        long = location.get("long", None)
        if lat is None or long is None:
            raise Exception("unable to parse latitude/longitude from location")

        return self.url + lat + "," + long

    def run(self):
        """
        Run the publisher forever.
        """
        asyncio.get_event_loop().run_until_complete(self.recv_and_publish())

    async def recv_and_publish(self):
        """
        At some interval (`self.interval`), ping the api.weather.com to get
        weather reports for the `self.locations`.

        NOTE: this requires 2 calls to the NOAA API, per location:
            - the first request provides a lat/long and retrieves forecast URL
            - the second request provides the forecast URL and gets forecast details

        Publish report data to the `self.topic`
        """
        await self.ensign.ensure_topic_exists(self.topic)

        while True:
            for location in self.locations.values():
                # Note that we're making a different API call for each location
                # TODO: can these be bundled so that we can make fewer calls?
                query = self.compose_query(location)

                # If successful, the initial response returns a link you can use to
                # retrieve the full hourly forecast
                response = requests.get(query).json()
                forecast_url = self.parse_forecast_link(response)
                forecast = requests.get(forecast_url).json()

                # After we retrieve and unpack the full hourly forecast, we can publish
                # each period of the forecast as a new event
                events = self.unpack_noaa_response(forecast)
                for event in events:
                    await self.ensign.publish(
                        self.topic,
                        event,
                        on_ack=self.print_ack,
                        on_nack=self.print_nack,
                    )
            await asyncio.sleep(self.interval)

    def parse_forecast_link(self, message):
        """
        Parse a preliminary forecast response from the NOAA API to get a forecast URL

        Parameters
        ----------
        message : dict
            JSON formatted response from the NOAA API containing a forecast URL

        Returns
        -------
        forecast_link : string
            Specific API-generated URL with the link to get the detailed forecast for
            the requested location
        """
        properties = message.get("properties", None)
        if properties is None:
            raise Exception("unexpected response from api call, no properties")

        forecast_link = properties.get("forecast", None)
        if forecast_link is None:
            raise Exception("unexpected response from api call, no forecast")

        return forecast_link

    def unpack_noaa_response(self, message):
        """
        Convert a message from the NOAA API to potentially multiple Ensign events,
        and yield each.

        Parameters
        ----------
        message : dict
            JSON formatted response from the NOAA API containing forecast details
        """
        properties = message.get("properties", None)
        if properties is None:
            raise Exception("unexpected response from forecast request, no properties")

        periods = properties.get("periods", None)
        if periods is None:
            raise Exception("unexpected response from forecast request, no periods")

        for period in periods:
            # There's a lot available! For this example, we'll just parse out a few
            # fields from the NOAA API response:
            data = {
                "name": period.get("name", None),
                "summary": period.get("shortForecast", None),
                "temperature": period.get("temperature", None),
                "units": period.get("temperatureUnit", None),
                "daytime": period.get("isDaytime", None),
                "start": period.get("startTime", None),
                "end": period.get("endTime", None),
            }

            yield Event(json.dumps(data).encode("utf-8"), mimetype=self.datatype)


if __name__ == "__main__":
    publisher = WeatherPublisher()
    publisher.run()
```

{{% /data-playground-code-tab %}}
{{% data-playground-code-tab tabIndex="go" name="Go"  %}}

```go
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"time"

	"github.com/rs/zerolog/log"
)

// NOTE: A User Agent is required to identify your application.
// This string can be anything, and should be unique to your application
// Include contact information (website or email) so NOAA can contact you
// if your string is associated to a security event.
const (
	UserAgent      = "(myweatherapp.com, contact@myweatherapp.com)"
	BaseWeatherURL = "https://api.weather.gov"
)

type Weather struct {
	client  *http.Client
	baseURL *url.URL
}

func NewWeatherAPI() (api *Weather, err error) {
	api = &Weather{
		client: &http.Client{
			Transport:     nil,
			CheckRedirect: nil,
			Timeout:       30 * time.Second,
		},
	}

	if api.client.Jar, err = cookiejar.New(nil); err != nil {
		return nil, fmt.Errorf("could not create cookiejar: %w", err)
	}

	if api.baseURL, err = url.Parse(BaseWeatherURL); err != nil {
		return nil, err
	}

	return api, nil
}

func (s *Weather) Alerts(ctx context.Context) (_ []interface{}, err error) {
	var req *http.Request
	if req, err = s.NewRequest(ctx, http.MethodGet, "/alerts/active", nil, nil); err != nil {
		return nil, err
	}

	var rep *http.Response
	alerts := make(map[string]interface{})
	if rep, err = s.Do(req, &alerts, true); err != nil {
		logctx := log.With().Err(err).Logger()
		if rep != nil {
			// Get the NOAA request headers to log the error
			correlationID := rep.Header.Get("X-Correlation-Id")
			requestID := rep.Header.Get("X-Request-Id")
			serverID := rep.Header.Get("X-Server-Id")

			logctx = logctx.With().
				Str("correlation_id", correlationID).
				Str("request_id", requestID).
				Str("server_id", serverID).
				Logger()
		}
		logctx.Error().Msg("could not fetch active alerts")
		return nil, err
	}

	if features, ok := alerts["features"]; ok {
		return features.([]interface{}), nil
	}
	return nil, fmt.Errorf("no alerts returned")
}

const (
	accept      = "application/geo+json"
	acceptLang  = "en-US,en"
	contentType = "application/json; charset=utf-8"
)

func (s *Weather) NewRequest(ctx context.Context, method, path string, data interface{}, params *url.Values) (req *http.Request, err error) {
	// Resolve the URL reference from the path
	url := s.baseURL.ResolveReference(&url.URL{Path: path})
	if params != nil && len(*params) > 0 {
		url.RawQuery = params.Encode()
	}

	var body io.ReadWriter
	switch {
	case data == nil:
		body = nil
	default:
		body = &bytes.Buffer{}
		if err = json.NewEncoder(body).Encode(data); err != nil {
			return nil, fmt.Errorf("could not serialize request data as json: %s", err)
		}
	}

	// Create the http request
	if req, err = http.NewRequestWithContext(ctx, method, url.String(), body); err != nil {
		return nil, fmt.Errorf("could not create request: %s", err)
	}

	// Set the headers on the request
	req.Header.Add("User-Agent", UserAgent)
	req.Header.Add("Accept", accept)
	req.Header.Add("Accept-Language", acceptLang)

	if body != nil {
		req.Header.Add("Content-Type", contentType)
	}

	// Add CSRF protection if its available
	if s.client.Jar != nil {
		cookies := s.client.Jar.Cookies(url)
		for _, cookie := range cookies {
			if cookie.Name == "csrf_token" {
				req.Header.Add("X-CSRF-TOKEN", cookie.Value)
			}
		}
	}

	return req, nil
}

// Do executes an http request against the server, performs error checking, and
// deserializes the response data into the specified struct.
func (s *Weather) Do(req *http.Request, data interface{}, checkStatus bool) (rep *http.Response, err error) {
	if rep, err = s.client.Do(req); err != nil {
		return rep, fmt.Errorf("could not execute request: %s", err)
	}
	defer rep.Body.Close()

	// Detect http status errors if they've occurred
	if checkStatus {
		if rep.StatusCode < 200 || rep.StatusCode >= 300 {
			return rep, fmt.Errorf("[%d] %s", rep.StatusCode, rep.Status)
		}
	}

	// Deserialize the JSON data from the body
	if data != nil && rep.StatusCode >= 200 && rep.StatusCode < 300 && rep.StatusCode != http.StatusNoContent {
		// Check the content type to ensure data deserialization is possible
		if ct := rep.Header.Get("Content-Type"); ct != accept {
			return rep, fmt.Errorf("unexpected content type: %q", ct)
		}

		if err = json.NewDecoder(rep.Body).Decode(data); err != nil {
			return nil, fmt.Errorf("could not deserialize response data: %s", err)
		}
	}

	return rep, nil
}

func (s *Weather) SetBaseURL(u *url.URL) {
	s.baseURL = u
}
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

