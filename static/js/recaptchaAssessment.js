// Get reCAPTCHA token after form submission and return an assessment score
// to help determine if request is spam or not.
export async function fetchAssessment(siteKey, action) {
  const token = await fetchRecaptchaToken(siteKey, action);

  if (!token) {
    console.error('invalid recaptcha token');
    return;
  }

  const req = {}
  req.token = token;
  req.action = action;

  try {
    const response = await fetch(`https://api.rotationallabs.com/v1/recaptcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
};

// Get the recaptcha token from the reCAPTCHA Enterprise API.
function fetchRecaptchaToken(key, action) {
  return new Promise((resolve) => {
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(key, { action: action });
      resolve(token);
    });
  });
};

// Check if the assessment score is greater than 0.5.  There is a high probability that the request is spam if it is not.
export function passAssessment(assessment) {
  if (!assessment) {
    return false;
  };

  return assessment?.risk_analysis?.score > 0.5;
};

// Display error message if form submission fails.
export function setError(formName, errorEl) {
  const errorAlert = document.getElementById(errorEl)
  errorAlert.style.display = 'block';
  formName?.reset();

  // Hide error message after 5 seconds.
  setTimeout(() => {
    errorAlert.style.display = 'none';
  }, 5000);

  return;
}