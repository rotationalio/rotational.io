import { getRecaptchaToken } from "./reCAPTCHA";

// Contact Form submission
const form = document.getElementById('contactForm');
const formID = document.getElementById('formID');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get reCAPTCHA token and verify the assessment score.
  const contactBttn = document.getElementById('contact-bttn');
  const siteKey = contactBttn.dataset.sitekey;
  const action = contactBttn.dataset.action;

  const assessment = fetchAssessment(siteKey, action);

  if (!assessment) {
    console.error('Unable to submit form');
    return;
  }

  if (assessment?.riskAnalysis?.score < 0.5) {
    console.error('Unable to submit form');
    return;
  }

  const formData = new FormData(form);
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

  fetch(`https://api.rotationallabs.com/v1/contact/form/${formID?.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 204) {
        document.getElementById('contact-alert').style.display = 'block';
        form.reset();

        // Hide contact form submission confirmation message after 10 seconds.
        setTimeout(() => {
          const contactAlert = document.getElementById('contact-alert');
          contactAlert.style.display = 'none';
        }, 10000);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Success:', data);
    })

    .catch((error) => {
      console.error('Error:', error);
    });
});


function fetchAssessment(sitekey, action) {
  const token = getRecaptchaToken(sitekey, action);

  if (!token) {
    console.error('invalid recaptcha token');
    return;
  }

  const req = {}
  req.token = token;
  req.action = action;

  fetch(`https://api.rotationallabs.com/v1/recaptcha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}