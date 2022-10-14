// public
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
    console.log(data);
    const formattedData = {
      ...data,
      subscribe: data?.subscribe === 'on' ? true : false,
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
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if (data.success) {
          document.getElementById('contact-alert').style.display = 'block';

        } else {
          console.log('fail:', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  );
  
