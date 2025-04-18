import { setError } from "./recaptchaAssessment.js";
import { getHubspotCookie } from "./utils.js";

//  newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
const formID = document.getElementById('newsletterFormID');
const errorEl = 'newsletter-error';

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(newsletterForm);
  const data = Object.fromEntries(formData);

  // Convert consent value to a bool.
  if (data.consent === 'on') {
    data.consent = true;
  } else {
    data.consent = false;
  }

  // Add consent text to the data object.
  const consentText = document.getElementById('consentText');
  data.consent_text = consentText?.innerText;

  // Get the tracking cookie.
  const hutk = getHubspotCookie();
  
  // Verify the cookie exists before adding it to the data object. If it exists, send the conversion page details. 
  // HubSpot will return a 400 if the hutk isn't included with the page URI and page name.
  if (hutk) {
    data.hutk = hutk;
    data.page_uri = window.location.href;
    data.page_name = document.title;
  }

  fetch(`https://api.rotationallabs.com/v1/contact/form/${formID?.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 204) {
        document.getElementById('newsletter-alert').style.display = 'block';
        newsletterForm.reset();

        // Hide newsletter submission message after 5 seconds.
        setTimeout(() => {
          const newsletterAlert = document.getElementById('newsletter-alert');
          newsletterAlert.style.display = 'none';
        }, 5000);
      }
    })
    .then((data) => {
      console.log('Success:', data);
    })

    .catch((error) => {
      console.error('Error:', error);
      setError(newsletterForm, errorEl)
    });
});

