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
