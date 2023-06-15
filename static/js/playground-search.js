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
      console.log("pagesIndex", pagesIndex);
    });
  } catch (e) {
    console.log(e);
  }
}

initSearchIndex();

// Add an event listener to the search form to get the search after the user clicks the search button.
const searchForm = document.getElementById('playground-search-form');
searchForm.addEventListener('input', (e) => {
  handleSearchQuery(e);
});

// Prevent the form from submitting when the user presses the enter key or clicks the submit button.
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

// handleSearchQuery gets the value of the search query input by the user and calls the searchSite function.
function handleSearchQuery(e) {
  e.preventDefault();
  const query = document.getElementById('playground-search-term').value.trim();
  
  const noResults = document.getElementById('no-results');
  const searchResults = document.getElementById('search-results');
  const header = document.getElementById('search-results-header');

  if(!query) {
    noResults.innerText = ''
    return;
  }
  const results = searchSite(query);
  
  if(!results.length) {
    noResults.innerText = 'No search results found.'
    noResults.style.display = 'block'
    searchResults.style.display = 'none'
    searchResults.innerHTML = ''
    header.style.display = 'none';
  }else {
    noResults.style.display = 'none'
    searchResults.style.display = 'block'
    header.style.display = 'block';
  }
}

// searchSite takes the search query and returns the results.
function searchSite(query) {
  query = getLunarSearchQuery(query);
  let results = searchIndex.search(query);
  displaySearchResult(results);
  return results ? results : [];
}

// getLunarSearchQuery takes the search query and returns a query that can be used by lunr.
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

function displaySearchResult(results) {
  const searchResults = document.getElementById('search-results');
  results.forEach((result) => {
    pagesIndex.forEach((page) => {
      data = splitContent(page.content);
      if(result.ref === page.uri) {
        // Create a li element for each search result and display the title and description.
        header = document.getElementById('search-results-header');
        header.style.display = 'block';
        searchResults.insertAdjacentHTML('beforeend', 
        `<li class="search-result-item">
            <a href="/data-playground/${page.uri}">
              <span>${data.title}</span>
              <p>${data.description}</p>
            </a>
          </li>`
        );
      }
    });
  }
  )
}

// Split the content by the newline character and store the content in an object 
// to make displaying the search results easier.
function splitContent(content) {
  // Remove forward slashes and double quotes from the content.
  const data = content.replace(/\/|"/g, '').split('\n');
  const dataObj = {};
  for (const item of data) {
    const fieldSplit = item.split(':');
    dataObj[fieldSplit[0]] = fieldSplit[1];
  }
  return dataObj;
}