// static 
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
}
const form = document.getElementById('contactForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const { subscribe, ...rest } = data;

  const formattedData = {
      
    subscribe: subscribe === 'on' ? true : false,
    ...rest,
    lists: [
      "4ada7d4b-e0a7-4017-8b9d-4db172b5be64",
      "54b7fc6a-db4b-491b-b6ff-4348c15072bc"
    ]
  }
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
      }
      return response.json()

    })
    .then((data) => {
      console.log('Success:', data);
    })
     
    .catch((error) => {
      console.error('Error:', error);
    });
}
);

// check newsletter form subn=mission 
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(newsletterForm);
  const data = Object.fromEntries(formData);


  const formattedData = {
      
    ...data,
    lists: [
      "4ada7d4b-e0a7-4017-8b9d-4db172b5be64",
      "54b7fc6a-db4b-491b-b6ff-4348c15072bc"
    ]
  }
  fetch('https://api.rotationallabs.com/v1/notifications/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  })
     .then((response) => {
      if (response.status === 204) {
        document.getElementById('notification-alert').style.display = 'block';
        form.reset();
      }
      return response.json()

    })
    .then((data) => {
      console.log('Success:', data);
    })
     
    .catch((error) => {
      console.error('Error:', error);
    });
});