// Submit Endeavor form
const endeavorForm = document.getElementById('endeavorForm');
const formID = document.getElementById('formID');

endeavorForm?.addEventListener('submit', (event) => {
  event.preventDefault();
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

  fetch(`https://api.rotationallabs.com/v1/contact/form/${formID?.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.status === 204) {
        const endeavorConfirmation = document.getElementById('endeavorConfirmation');
        endeavorForm.reset();
        endeavorConfirmation.classList.remove('hidden');

        setTimeout(() => {
          endeavorConfirmation.classList.add('hidden');
        }, 5000);
      } else {
        const endeavorError = document.getElementById('endeavorError');
        endeavorForm.reset();
        endeavorError.classList.remove('hidden');

        setTimeout(() => {
          endeavorError.classList.add('hidden');
        }, 10000);
      }
    })
    .then((data) => {
      console.log('successfully submitted endeavor form:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});