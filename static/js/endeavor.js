// Submit Endeavor form
const endeavorForm = document.getElementById('endeavorForm');

endeavorForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(endeavorForm);
  const data = Object.fromEntries(formData);

  const formattedData = {
    ...data,
    lists: ['4ada7d4b-e0a7-4017-8b9d-4db172b5be64'],
  };

  fetch('https://api.rotationallabs.com/v1/notifications/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
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