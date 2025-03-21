// Get the HubSpot tracking cookie from the browser to be included in the form submission data.
export function getHubspotCookie() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}