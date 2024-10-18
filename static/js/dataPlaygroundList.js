// Fetch the index.json file from the static folder and create a lunr index.
let pagesIndex, searchIndex;
async function initSearchIndex() {
  try {
    const res = await fetch("/index.json");
    pagesIndex = await res.json();
    searchIndex = lunr(function () {
      this.field("content");
      this.field("tags");
      this.ref("uri");
      pagesIndex.forEach((page) => this.add(page));
    });
  } catch (e) {
    console.error(e);
  }
}

initSearchIndex();

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