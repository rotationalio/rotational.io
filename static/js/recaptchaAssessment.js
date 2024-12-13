// Get reCAPTCHA token after form submission and return an assessment score
// to help determine if request is spam or not.
export function fetchAssessment(siteKey, action) {
  const token = fetchRecaptchaToken(siteKey, action);

  if (!token) {
    console.error('invalid recaptcha token');
    return;
  }

  const req = {}
  req.token = token;
  req.action = action;

  fetch(`https://api.rotationallabs.com/v1/recaptcha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('Success:', data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

// Get the recaptcha token from the reCAPTCHA Enterprise API.
function fetchRecaptchaToken(key, action) {
  grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute(key, { action: action });
    return token;
  });
};