// Filter case studies by industry and service
document.addEventListener('DOMContentLoaded', () => {
  const industrySel = document.getElementById('industry-sel');
  const serviceSel = document.getElementById('service-sel');
  const studiesContainer = document.getElementById('case-studies');
  const studies = Array.from(studiesContainer.querySelectorAll('.case-study'));

  function filterCases() {
    const industry = industrySel.value;
    const service = serviceSel.value;
  
    // Remove all case studies from the container so that we can add ones that match the user's selection to the container. 
    while (studiesContainer.firstChild) {
      studiesContainer.removeChild(studiesContainer.firstChild);
    }

    // Add case studies that match the user's selection to the container. All will be displayed by default.
    studies.forEach((study) => {
      let selectedService = study.dataset.service.split(' ').slice(0,2).join('-').toLowerCase();
      const industryMatch = (study.dataset.industry).toLowerCase() === (industry).toLowerCase();
      const serviceMatch = selectedService === service;
      if (industryMatch || serviceMatch) {
        studiesContainer.appendChild(study);
      } else if (industry === 'all' && service === 'all') {
        studiesContainer.appendChild(study);
      }
    });
  };

  industrySel?.addEventListener('change', filterCases);
  serviceSel?.addEventListener('change', filterCases);
});