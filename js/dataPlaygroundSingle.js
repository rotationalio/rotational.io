// open tooltip on mouseover
const tooltip = document.getElementById('tooltip');
const tooltipText = document.getElementById('tooltip-text');

tooltip?.addEventListener('mouseover', () => {
  tooltipText.style.display = 'block';
});

tooltip?.addEventListener('mouseout', () => {
  tooltipText.style.display = 'none';
});

function toggleActive(element, condition) {
  if (condition) {
    element.classList.add('active');
  } else {
    element.classList.remove('active');
  }
}

function switchTab(groupId, name) {
  const tabItems = document.querySelectorAll(
    `.tab-item[data-tab-group=${groupId}]`
  );
  const tabButtons = document.querySelectorAll(
    `.tab-button[data-tab-group=${groupId}]`
  );
  [...tabItems, ...tabButtons].forEach((item) =>
    toggleActive(item, item.dataset.tabItem === name)
  );
}