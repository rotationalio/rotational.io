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
  
  // Add on change event listener to the license type dropdown.
  licenseType.addEventListener('change', (e) => {
    licenseTypeValue = e.target.value;

  // Display the div for the selected license type and hide the others.
  switch (licenseTypeValue) {
    case 'Free': {
    free.style.display = 'grid';
    all.style.display = 'none';
    nonCommercial.style.display = 'none';
    commercial.style.display = 'none';
  }
  break;

  case 'Free for non-commercial use': {
    nonCommercial.style.display = 'grid';
    free.style.display = 'none';
    all.style.display = 'none';
    commercial.style.display = 'none';
  }
  break;

  case 'Commercial': {
    commercial.style.display = 'grid';
    all.style.display = 'none';
    free.style.display = 'none';
    nonCommercial.style.display = 'none';
  }
  break;

  default: {
    all.style.display = 'grid';
    free.style.display = 'none';
    nonCommercial.style.display = 'none';
    commercial.style.display = 'none';
  }
  break;
}
});
};

// Fetch the index.json file from the static folder. This contains all the data we need to search through.
let pagesIndex, searchIndex;
async function initSearchIndex() {
  try {
    const res = await fetch("/index.json");
    pagesIndex = await res.json();
    searchIndex = lunr(function () {
      this.field("content");
      this.field("tag");
      this.ref("uri");
      pagesIndex.forEach((page) => this.add(page));
    });
  } catch (e) {
    console.log(e);
  }
}

initSearchIndex();

// Add an event listener to the search form to get the search after the 
// user clicks the search button.
const searchForm = document.getElementById('search-form');
const term = searchForm.addEventListener('submit', (e) => {
  handleSearchQuery(e);
});

function handleSearchQuery(e) {
  e.preventDefault();
  const query = document.getElementById('source-search').value.trim();
  console.log(query)
  if(!query) {
    // Add div below the search box to display a message to the user.
    console.log('Please enter a search term.');
    return;
  }

  const results = searchSite(query);
  if(!results.length) {
    // Add div below the search box to display a message to the user.
    console.log('No results found.');
    return;
  }
}

function searchSite(query) {
  const ogQuery = query;
  query = getLunarSearchQuery(query);
  let results = searchIndex.search(query);
  console.log(results)
  return results.length ? results : query !== ogQuery ? getSearchResults(ogQuery) : [];
}

function getSearchResults(query) {
  return searchIndex.search(query).map((hit) => {
    if (hit.ref == "undefined") return [];
    let pageMatch = pagesIndex.filter((page) => page.href === hit.ref)[0];
    pageMatch.score = hit.score;
    return [pageMatch];
  });
}

function getLunarSearchQuery(query) {
  const searchTerms = query.split(' ');
  if(searchTerms.length === 1) {
    return query;
  }
  query = ""  
  for (const term of searchTerms) {
    query += `+${term} `;
  }
  return query.trim();
}
