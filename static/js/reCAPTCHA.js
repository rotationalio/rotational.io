export function getRecaptchaToken(key, action) {
  grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute(key, { action: action });
    return token;
  })
}
