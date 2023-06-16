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
producer_link: https://api.weather.gov
is_api_key_required: false
api_type: REST, JSON-LD, GeoJSON, OXML
sdks: N/A
limits: The rate limit is not public information, but allows a generous amount for typical use. If the rate limit is exceeded, the request will return with an error, and may be retried after the limit clears (typically within 5 seconds). Proxies are more likely to reach the limit, whereas requests directly from clients are not likely.
data: Weather forecasts, alerts, and observations
is_account_required: false
weight: 2
---

{{% data-playground-wrapper %}}

{{% data-playground-code-tabs %}}


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


