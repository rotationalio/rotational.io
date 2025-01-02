//  newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
const formID = document.getElementById('newsletterFormID');

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


  fetch(`https://api.rotationallabs.com/v1/contact/form${formID?.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
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
      return response.json();
    })
    .then((data) => {
      console.log('Success:', data);
    })

    .catch((error) => {
      console.error('Error:', error);
    });
});