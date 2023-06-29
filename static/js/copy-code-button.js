/* global clipboard */
/* eslint-disable no-console */

function addCopyButtons(clipboard) {
  const button = getElementById('copy-code-button');

  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    // add the copy button to the code block
    console.log('codeBlock', codeBlock);

    button.addEventListener('click', function () {
      clipboard.writeText(codeBlock.textContent).then(
        function () {
          button.blur();

          button.innerText = 'Copied!';

          button.classList.add('active');
          setTimeout(function () {
            button.innerText = 'Copy';
            button.classList.remove('active');
          }, 2000);
        },
        function (error) {
          button.innerText = 'Error';
          console.error(error);
        }
      );
    });

    var pre = codeBlock.parentNode;
    if (pre.parentNode.classList.contains('highlight')) {
      var highlight = pre.parentNode;
      highlight.parentNode.insertBefore(button, highlight);
    } else {
      pre.parentNode.insertBefore(button, pre);
    }
  });
}

if (navigator && navigator.clipboard) {
  addCopyButtons(navigator.clipboard);
} else {
  var script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js';
  script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=';
  script.crossOrigin = 'anonymous';

  script.onload = function () {
    addCopyButtons(clipboard);
  };

  document.body.appendChild(script);
}
