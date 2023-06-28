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

// Add an event listener to the search form to get the search after the user clicks the search button.
const searchForm = document.getElementById('playground-search-form');
searchForm.addEventListener('input', (e) => {
  handleSearchQuery(e);
  searchResults = document.getElementById('search-results');
  searchResults.innerHTML = '';
});

// handleSearchQuery gets the value of the search query input by the user and calls the searchSite function.
function handleSearchQuery(e) {
  e.preventDefault();
  const query = document.getElementById('playground-search-term').value.trim();
  
  const noResults = document.getElementById('no-results');
  const searchResults = document.getElementById('search-results');
  const header = document.getElementById('search-results-header');
  const searchSuggestions = document.getElementById('search-suggestions');
  const searchSuggestionList = document.getElementById('search-suggestion-item');

  if(!query) {
    noResults.innerText = ''
    searchResults.innerHTML = '';
    header.style.display = 'none';
    searchSuggestions.innerHTML = '';
    return;
  }

  const results = searchSite(query);
  
  if(!results.length) {
    noResults.style.display = 'block'
    header.style.display = 'none';
  }
}

// searchSite takes the search query and returns the results.
function searchSite(query) {
  query = getLunarSearchQuery(query);
  searchSuggestions(query);
  let results = searchIndex.search(query);
  return results ? results : [];
}

// This gets the correct search term. Need to display the results after user clicks the search button.
searchButton = document.getElementById('search-submit');
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const term = document.getElementById('playground-search-term').value.trim();
  let results = searchIndex.search(term);
  displaySearchResult(results);
});

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
  // Remove forward slashes, double quotes, commas and periods from the content.
  const data = content.replace(/\/|\"|\,|\./g, '').split('\n');
  const dataObj = {};
  for (const item of data) {
    const fieldSplit = item.split(':');
    dataObj[fieldSplit[0]] = fieldSplit[1];
  }
  return dataObj;
}


// Get the search term provided by a user on input. Check the description and title of each data source
// and return a list of words that match the pattern of the query. If the user has typed a word
// that is not in the description or title, do not return a list of words. If the user selects a word
// from the list, the search term will be replaced with the word the user has selected.
function searchSuggestions(query) {
    const searchInput = document.getElementById('playground-search-term');
    const searchSuggestions = document.getElementById('search-suggestions');
    pagesIndex.forEach((page) => {
      const data = splitContent(page.content);
      const description = data.description.toLowerCase();
      const queryLower = query.toLowerCase();

      if(description.includes(queryLower)) {
        const words = description.split(' ');
        // Remove any duplicate words.
        const uniqueWords = [...new Set(words)];
        const wordList = [];
        for (const word of uniqueWords) {
          if(word.includes(queryLower)) {
            wordList.push(word);
          }
        }

        // Remove words we don't want to display to the user.
        const stopWords = ['their', 'with', 'start', 'this', 'about', 'such', 'that', 'from', 'they', 'which', 'have', 'been', 'also', 'these', 'will', 'your', 'when', 'where', 'what', 'into', 'use', 'used', 'and'];
        const filteredWordList = wordList.filter((word) => word.length > 3 && !stopWords.includes(word));

        // Display the list of words to the user.
        searchSuggestions.innerHTML = '';
        filteredWordList.forEach((word) => {
          searchSuggestions.insertAdjacentHTML('beforeend', `<li class="search-suggestion-item">${word}</li>`);
        }
        );
        
        // If the user clicks on a word, replace the query with the word the user has selected.
        const searchSuggestionItems = document.querySelectorAll('.search-suggestion-item');
        searchSuggestionItems.forEach((item) => {
          item.addEventListener('click', (e) => {
            searchInput.value = e.target.innerText;
            searchSuggestions.innerHTML = '';
          });
        }
        );
      }
    });
  }