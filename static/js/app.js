// static
function openMobNav() {
  var x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

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

// submit ensign form

const ensignForm = document.getElementById('ensignForm');

ensignForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(ensignForm);
  const data = Object.fromEntries(formData);
  const ensignHomeEl = document.getElementById('ensign-home');
  const ensignAlertEl = document.getElementById('ensign-alert');
  const ensignConfirmationEl = document.getElementById('ensign-confirmation');
  const { notify_me, ...rest } = data;

  const formattedData = {
    notifications: !!(notify_me === 'on'),
    ...rest,
    lists: ['d99ae1c6-1c25-4904-a56c-21e82a0fce52'],
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
        ensignForm.reset();
        ensignHomeEl.style.display = 'none';
        ensignConfirmationEl.style.display = 'block';
      }
      // return response avoid error in console
      return await response.text();
    })
    .then((data) => {
      console.log('successfully submitted ensign form:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      ensignAlertEl.style.display = 'block';
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

/* // getSelectedLicense gets the value of a data source license type from the select dropdown menu
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

  // Add on change event listener to the license type dropdown.
  licenseType.addEventListener('change', (e) => {
    licenseTypeValue = e.target.value;

    // Display the div for the selected license type and hide the others.
    switch (licenseTypeValue) {
      case 'Free':
        {
          free.style.display = 'grid';
          all.style.display = 'none';
          nonCommercial.style.display = 'none';
          commercial.style.display = 'none';
        }
        break;

      case 'Free for non-commercial use':
        {
          nonCommercial.style.display = 'grid';
          free.style.display = 'none';
          all.style.display = 'none';
          commercial.style.display = 'none';
        }
        break;

      case 'Commercial':
        {
          commercial.style.display = 'grid';
          all.style.display = 'none';
          free.style.display = 'none';
          nonCommercial.style.display = 'none';
        }
        break;

      default:
        {
          all.style.display = 'grid';
          free.style.display = 'none';
          nonCommercial.style.display = 'none';
          commercial.style.display = 'none';
        }
        break;
    }
  });
} */

function filterByLicense() {
  const licenseType = document.getElementById('source-license');
  let licenseTypeValue = licenseType.value;

  // Get the div elements for each license type.
  all = document.getElementById('all-license');
  nonCommercial = document.getElementById('non-commercial-license');
  filteredPlayground = document.getElementById('filtered-playground');

licenseType.addEventListener('change', (e) => {
  licenseTypeValue = e.target.value;
  console.log('licenseTypeValue', licenseTypeValue);

  // Add "+" before non-commercial to inform lunr that it is a required term
  // to obtain an exact match.
  if (licenseTypeValue === 'Free for non-commercial use') {
    licenseTypeValue = 'Free for +non-commercial use';
  }

  let results = searchIndex.search(licenseTypeValue);

  if (results.length === 0 && licenseTypeValue !== 'All') {

    // Remove "+" before non-commercial to display text as it appears in the dropdown menu.
    if (licenseTypeValue === 'Free for +non-commercial use') {
      licenseTypeValue = 'Free for non-commercial use';
    }

    text = document.getElementById('test');
    text.innerText = `There are no ${licenseTypeValue} data sources available.`
    nonCommercial.style.display = 'block';
    all.style.display = 'none';
    filteredPlayground.style.display = 'none';
  }

  // Lunr returns 0 results for 'All' so we need to handle that case separately.
  if (results.length === 0 && licenseTypeValue === 'All') {
    all.style.display = 'grid';
    nonCommercial.style.display = 'none';
    filteredPlayground.style.innerHTML = '';
  }

  // Display results for the selected license type and hide the others.
  if (results.length > 0) {
    results.forEach((result) => {
      pagesIndex.map((page) => {
        data = splitContent(page.content);
        if(result.ref === page.uri) {
          sourceCard = document.getElementById('source-card-test');
          imgSrc = data.image.replace('imgdata-playground', '').trim();
          lowerCaseLicenseTypeValue = licenseTypeValue.toLowerCase();
          
          sourceCard.insertAdjacentHTML('beforeend', `
          <li class="source-card-${lowerCaseLicenseTypeValue}>
          <div my-6 border border-solid border-[#000000] rounded-[9px] bg-[#ECF6FF]">
          <img src="img/data-playground/${imgSrc}" alt="" class="m-0 rounded-t-lg h-60 w-full" />
          <div class="py-4 bg-[#E66809] text-xl text-white text-center">${data.subtitle}</div>
          <div class="mt-6 ml-4">
              <div>
              <span class="font-bold">Producer:</span> 
              <span class="source-producer-name">${data.producer_name}</span> 
              </div>
              <div>
              <span class="font-bold">License:</span> 
              <span class="source-license">${data.license}</span>
              </div>
              <p class="mt-4 w-11/12">${data.summary}</p>
          </div>
          <div class="pb-6 mt-8">
              <button class="bg-[#192E5B] block mx-auto w-1/2 rounded-xl py-4 hover:bg-[#1D65A6]">
                  <a id="link" href="/data-playground/${page.uri}" class="text-white no-underline block">
                    Learn More
                  </a>
              </button>
          </div>
          </div>
          </li>
          `);


          freeCard = document.getElementsByClassName('source-card-free');
          nonCommercialCard = document.getElementsByClassName('source-card-non-commercial');
          commercialCard = document.getElementsByClassName('source-card-commercial');

          if (licenseTypeValue === 'Commercial') {
            commercialCard.style.display = 'grid';
            nonCommercial.style.display = 'none';
            // Loop through all cards with class name source-card-free and hide them.
            for (let i = 0; i < free.length; i++) {
              freeCard[i].remove();
            }
          }

          if (licenseTypeValue === 'Free') {
            // Loop through all cards with class name source-card-free and hide them.
            for (let i = 0; i < commercial.length; i++) {
              commercialCard[i].style.display = 'none';
            }
          }

        }
      });
    });
  }
});
}