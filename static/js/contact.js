// Contact Form submission
const form = document.getElementById('contactForm');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const { subscribe, ...rest } = data;

  const formattedData = {
    subscribe: subscribe === 'on' ? true : false,
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
