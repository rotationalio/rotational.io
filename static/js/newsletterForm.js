import { fetchAssessment, passAssessment, setError } from "./recaptchaAssessment.js";
import { getHubspotCookie } from "./utils.js";

//  newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
const formID = document.getElementById('newsletterFormID');
const errorEl = 'newsletter-error';

newsletterForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get reCAPTCHA token and form action.
  const newsletterBttn = document.getElementById('newsletter-bttn');
  const siteKey = newsletterBttn.dataset.sitekey;
  const action = newsletterBttn.dataset.action;

  // Create an assessment and return an error if the form submission appears to be spam or if some other error
  // occurs while fetching the data.
  try {
    const assessment = await fetchAssessment(siteKey, action);

    if (!assessment) {
      setError(newsletterForm, errorEl);
      return;
    }

    // If the risk analysis score is less than 0.5, do not send the form and display an error.
    if (!passAssessment(assessment)) {
      setError(newsletterForm, errorEl)
      return
    }
  } catch (error) {
    setError(newsletterForm, errorEl)
    return
  }

  // If the assessment returns a passing score, send the form data.
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

