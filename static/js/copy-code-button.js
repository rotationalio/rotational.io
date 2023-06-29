function addCopyButtons(clipboard) {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    var button = document.createElement('button');
    button.className =
      'copy-code-button absolute text-white text-xs right-[3.5rem] bg-red-500 p-1 hover:text-red-700 [&.active]:bg-green-600 mt-[0.75rem] mr-[0.75rem]';
    button.type = 'button';
    button.innerText = 'Copy';

    button.addEventListener('click', function () {
      clipboard.writeText(codeBlock.innerText).then(
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
