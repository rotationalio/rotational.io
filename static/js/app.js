// static
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

// share on twitter

function shareOnTwitter() {
  const twitterWindow = window.open(
    'https://twitter.com/share?url=' + document.URL,
    'twitter-popup',
    'height=350,width=600'
  );
  if (twitterWindow.focus) {
    twitterWindow.focus();
  }
  return false;
}

// share on tiwtter with title , url
function shareOnTwitterWithTitle() {
  const title = document.querySelector('[data-blog-title]').innerText;
  const twitterWindow = window.open(
    'https://twitter.com/intent/tweet?text=' +
      title +
      '&url=' +
      document.URL +
      '&via=rotationalio',
    'twitter-popup',
    'height=350,width=600'
  );
  if (twitterWindow.focus) {
    twitterWindow.focus();
  }
  return false;
}

//share on linkedin
function shareOnLinkedIn() {
  const linkedinWindow = window.open(
    'https://www.linkedin.com/shareArticle?mini=true&url=' + document.URL,
    'linkedin-popup',
    'height=350,width=600'
  );
  if (linkedinWindow.focus) {
    linkedinWindow.focus();
  }
  return false;
}

// share by email
function shareByEmail() {
  const emailWindow = window.open(
    'mailto:?subject=Check out this article&body=' + document.URL,
    'email-popup',
    'height=350,width=600'
  );
  if (emailWindow.focus) {
    emailWindow.focus();
  }
  return false;
}

//  newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('newsletter form submitted');
  const formData = new FormData(newsletterForm);
  const data = Object.fromEntries(formData);

  const formattedData = {
    ...data,
    lists: [
      '4ada7d4b-e0a7-4017-8b9d-4db172b5be64',
      '54b7fc6a-db4b-491b-b6ff-4348c15072bc',
    ],
  };
  fetch('https://api.rotationallabs.com/v1/notifications/signup', {
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

// open tooltip on mouseover
const tooltip = document.getElementById('tooltip');
const tooltipText = document.getElementById('tooltip-text');

tooltip?.addEventListener('mouseover', () => {
  tooltipText.style.display = 'block';
});

tooltip?.addEventListener('mouseout', () => {
  tooltipText.style.display = 'none';
});

function toggleActive(element, condition) {
  if (condition) {
    element.classList.add('active');
  } else {
    element.classList.remove('active');
  }
}
function switchTab(groupId, name) {
  const tabItems = document.querySelectorAll(
    `.tab-item[data-tab-group=${groupId}]`
  );
  const tabButtons = document.querySelectorAll(
    `.tab-button[data-tab-group=${groupId}]`
  );
  [...tabItems, ...tabButtons].forEach((item) =>
    toggleActive(item, item.dataset.tabItem === name)
  );
}

// getSelectedLicense gets the value of a data source license type from the select dropdown menu
// and displays the div for the selected license type and hides the others.
function getSelectedLicense() {
  // Get value of the license type selected from the dropdown menu
  const licenseType = document.getElementById('source-license');
  let licenseTypeValue = licenseType.value;

  // Get the div elements for each license type.
  all = document.getElementById('all-license');
  free = document.getElementById('free-license');
  nonCommercial = document.getElementById('non-commercial-license');
  commercial = document.getElementById('commercial-license');
  noLicenseResults = document.getElementById('no-license-results');

  // Add on change event listener to the license type dropdown.
  licenseType.addEventListener('change', (e) => {
    licenseTypeValue = e.target.value;
    
  // Add "+" before non-commercial to make the term required when searching lunr.
  if (licenseTypeValue === 'Free for non-commercial use') {
    licenseTypeValue = 'Free for +non-commercial use';
  }

  let results = searchIndex.search(licenseTypeValue);

  if (results.length === 0 && licenseTypeValue !== 'All') {
    
    noLicenseResults.style.display = 'block';
    all.style.display = 'none';
    free.style.display = 'none';
    commercial.style.display = 'none';
    nonCommercial.style.display = 'none';
  }

  // 'All' is not listed as license type in the data source pages so lunr
  // 0 results when it is selected by users.
  if (results.length === 0 && licenseTypeValue === 'All') {
    all.style.display = 'grid';
    free.style.display = 'none';
    nonCommercial.style.display = 'none';
    commercial.style.display = 'none';
    noLicenseResults.style.display = 'none';
  }

    // Display the div for the selected license type and hide the others.
    switch (licenseTypeValue) {
      case 'Free':
        {
          free.style.display = 'grid';
          all.style.display = 'none';
          nonCommercial.style.display = 'none';
          commercial.style.display = 'none';
          noLicenseResults.style.display = 'none';
        }
        break;

      case 'Free for non-commercial use':
        {
          nonCommercial.style.display = 'grid';
          free.style.display = 'none';
          all.style.display = 'none';
          commercial.style.display = 'none';
          noLicenseResults.style.display = 'none';
        }
        break;

      case 'Commercial':
        {
          commercial.style.display = 'grid';
          all.style.display = 'none';
          free.style.display = 'none';
          nonCommercial.style.display = 'none';
          noLicenseResults.style.display = 'none';
        }
        break;
    }
  });
}

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

// Hide contact form submission or error message after 10 seconds.
// TODO: Use this function for all contact form submission messages.
function setMessageTimeOut(element, timeLimit) {
  setTimeout(() => {
    element.classList.add('hidden');
  }, timeLimit || 10000);
}

// Display download playbook dropdown menu.
// TODO: Remove toggle dropdown code if Flowbite styling will be used.
/* const downloadPlaybookBttn = document.getElementById('download-playbook');
const downloadDropdown = document.getElementById('download-dropdown-menu');

downloadPlaybookBttn?.addEventListener('click', () => {
  downloadDropdown.classList.toggle('hidden');

  // Hide dropdown menu if the user clicks outside of it.
  document.addEventListener('click', (e) => {
    if (!downloadPlaybookBttn.contains(e.target)) {
      downloadDropdown.classList.add('hidden');
    }
  });

  // Hide dropdown menu if the user scrolls the page.
  window.addEventListener('scroll', () => {
    downloadDropdown.classList.add('hidden');
  });
}) */

// Initialize Embla carousel
const emblaRoot = document.querySelector('.embla');
const emblaViewport = emblaRoot?.querySelector('.embla__viewport');
const prevBtn = emblaRoot?.querySelector('.embla__prev');
const nextBtn = emblaRoot?.querySelector('.embla__next');
const options = { loop: true };

if (emblaRoot) {
  const carousel = EmblaCarousel(emblaViewport, options);
  prevBtn.addEventListener('click', carousel.scrollPrev, false);
  nextBtn.addEventListener('click', carousel.scrollNext, false);
}
