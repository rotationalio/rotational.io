import { fetchAssessment, passAssessment, setError } from "./recaptchaAssessment.js";

// Contact Form submission
const form = document.getElementById('contactForm');
const formID = document.getElementById('formID');
const errorEl = 'contact-error';

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Get reCAPTCHA token and form action.
  const contactBttn = document.getElementById('contact-bttn');
  const siteKey = contactBttn.dataset.sitekey;
  const action = contactBttn.dataset.action;

  // Create an assessment and return an error if the form submission appears to be spam or if some other error
  // occurs while fetching the data.
  try {
    const assessment = await fetchAssessment(siteKey, action);

    if (!assessment) {
      setError(form, errorEl);
      return;
    }
  
    // If the risk analysis score is less than 0.5, do not send the form and display an error.
    if (!passAssessment(assessment)) {
      setError(form, errorEl)
      return
    } 
  } catch (error) {
    setError(form, errorEl)
    return
  }

  // If the assessment returns a passing score, send the form data.
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

