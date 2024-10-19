// Display the Ensign pricing page modal when a user clicks the contact button.
const openModalButton = document.querySelectorAll('#price-contact-bttn');
const closeModalButton = document.getElementById('close-modal-bttn');
const modalOverlay = document.getElementById('price-modal-overlay');
const priceContactForm = document.getElementById('price-contact-form');

// There are multiple contact buttons on the page so we need to add an event listener to each one.
openModalButton.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.getElementById('price-contact-modal');
    const modalOverlay = document.getElementById('price-modal-overlay');
    modal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');

    // Prevent user from scrolling the page while the modal is open.
    document.body.style.overflow = 'hidden';
  });
});

// Close the Ensign pricing page modal when a user clicks the "X" button in the modal.
closeModalButton?.addEventListener('click', () => {
  const modal = document.getElementById('price-contact-modal');
  const modalOverlay = document.getElementById('price-modal-overlay');
  modal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
  priceContactForm.reset();
  // Allow the user to scroll the page again after closing the modal.
  document.body.style.overflow = '';
});


// Submit the Ensign pricing page contact form.
priceContactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO: Create function to handle formatting form data.
  const formData = new FormData(priceContactForm);
  const data = Object.fromEntries(formData);
  const { subscribe, ...rest } = data;

  const formattedData = {
    subscribe: true,
    ...rest,
    lists: [
      '4ada7d4b-e0a7-4017-8b9d-4db172b5be64',
      '54b7fc6a-db4b-491b-b6ff-4348c15072bc',
    ],
  };
  fetch('https://api.rotationallabs.com/v1/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  })
    .then((response) => {
      const priceContactConfirmation = document.getElementById('price-contact-confirmation');
      if (response.status === 204) {
        priceContactConfirmation.classList.remove('hidden');
        priceContactForm.reset();

        // Hide the price contact form submission confirmation message after 10 seconds.
        setMessageTimeOut(priceContactConfirmation);
      }else {
        const priceContactError = document.getElementById('price-contact-error');
        priceContactError.classList.add('hidden');
        priceContactForm.reset();

        // Hide the price contact form error message after 10 seconds.
        setMessageTimeOut(priceContactError, 10000);
      }
      return response.json();
    })
});

// Hide pricing contact form submission or error message after 10 seconds.
function setMessageTimeOut(element, timeLimit) {
  setTimeout(() => {
    element.classList.add('hidden');
  }, timeLimit || 10000);
}
