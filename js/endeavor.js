import { fetchAssessment, passAssessment, setError } from "./recaptchaAssessment.js";
import { getHubspotCookie } from "./utils.js";

// Google Ads
const googleAdsID = 'AW-374501142/08GeCK2ppYAbEJbeybIB';

// Submit Endeavor form
const endeavorForm = document.getElementById('endeavorForm');
const formID = document.getElementById('formID');
const errorEl = 'endeavorError'

endeavorForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

const submitBttn = document.getElementById('submit-bttn');
  const siteKey = submitBttn.dataset.sitekey;
  const action = submitBttn.dataset.action;

  // Create an assessment and return an error if the form submission appears to be
  // spam or if some other error occurs while fetching the data.
  try {
    const assessment = await fetchAssessment(siteKey, action);

    if (!assessment) {
      setError(endeavorForm, errorEl)
      return
    }

    if (!passAssessment(assessment)) {
      setError(endeavorForm, errorEl)
      return
    }
  } catch (error) {
    setError(endeavorForm, errorEl)
    return
  }

  const formData = new FormData(endeavorForm);
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

  // Get HubSpot tracking cookie.
  const hutk = getHubspotCookie();

  if (hutk) {
    data.hutk = hutk;
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
        const endeavorConfirmation = document.getElementById('endeavorConfirmation');
        endeavorForm.reset();
        endeavorConfirmation.classList.remove('hidden');

        setTimeout(() => {
          endeavorConfirmation.classList.add('hidden');
        }, 5000);
      }
    })
    .then((data) => {
      // Report conversion event to GoogleAds
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': googleAdsID,
          'value': 2.8,
          'currency': 'USD',
          'event_callback': () => {
            console.debug('Google Ads conversion event reported');
          }
        });
      };

      console.log('successfully submitted endeavor form:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      setError(endeavorForm, errorEl)
    });
});