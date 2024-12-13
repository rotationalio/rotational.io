// import { fetchAssessment } from "./recaptchaAssessment.js";

// Contact Form submission
const form = document.getElementById('contactForm');
const formID = document.getElementById('formID');
const errorEl = 'contact-error';

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  // TODO: Implement recaptcha assessment after determining how to get the sitekey value.
  
  // Get reCAPTCHA token and obtain assessment score.
  /* const contactBttn = document.getElementById('contact-bttn');
  const siteKey = contactBttn.dataset.sitekey;
  const action = contactBttn.dataset.action;
  
  const assessment = fetchAssessment(siteKey, action);

  if (!assessment) {
    console.error('Unable to submit form');
    setError(form, errorEl);
    return;
  } */

  // If the risk analysis score is less than 0.5, do not submit the form.
  // There is a high probability that the request is spam.
/*   if (assessment?.riskAnalysis?.score < 0.5) {
    console.error('Unable to submit form');
    setError(form, errorEl);
    return;
  } */

  // If the assessment score is greater than 0.5, submit the form.
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

        // Hide contact form submission confirmation message after 5 seconds.
        setTimeout(() => {
          const contactAlert = document.getElementById('contact-alert');
          contactAlert.style.display = 'none';
        }, 5000);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Success:', data);
    })

    .catch((error) => {
      console.error('Error:', error);
      setError(form, errorEl)
    });
});

// Display error message if form submission fails.
function setError(formName, errorEl) {
  document.getElementById(errorEl).style.display = 'block';
  formName?.reset();

  // Hide error message after 5 seconds.
  setTimeout(() => {
    const errorAlert = document.getElementById(errorEl);
    errorAlert.style.display = 'none';
  }, 5000);

  return;
}