// Opens an architecture figure in a popup when its thumbnail is clicked.
// Each thumbnail is a plain link to the full image, so without JavaScript, or with
// ctrl/cmd-click, the figure simply opens in a new tab.
(function () {
  "use strict";

  var triggers = document.querySelectorAll("a.paper-fig");
  if (!triggers.length || typeof HTMLDialogElement !== "function") return;

  var box = document.createElement("dialog");
  box.className = "figbox";
  box.setAttribute("aria-labelledby", "figbox-title");
  box.setAttribute("aria-describedby", "figbox-caption");
  box.innerHTML =
    '<div class="figbox-panel">' +
      '<div class="figbox-head">' +
        '<div>' +
          '<p class="figbox-label"></p>' +
          '<p class="figbox-title" id="figbox-title"></p>' +
        '</div>' +
        '<button type="button" class="figbox-close" aria-label="Close figure">' +
          '<i class="fas fa-times" aria-hidden="true"></i>' +
        '</button>' +
      '</div>' +
      '<div class="figbox-stage"><img alt="" /></div>' +
      '<div class="figbox-foot">' +
        '<p class="figbox-caption" id="figbox-caption"></p>' +
        '<p class="figbox-links">' +
          '<a class="figbox-paper" target="_blank" rel="noopener">Read the paper</a>' +
          '<a class="figbox-full" target="_blank" rel="noopener">Open full size</a>' +
        '</p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(box);

  var label = box.querySelector(".figbox-label");
  var title = box.querySelector(".figbox-title");
  var image = box.querySelector(".figbox-stage img");
  var caption = box.querySelector(".figbox-caption");
  var paperLink = box.querySelector(".figbox-paper");
  var fullLink = box.querySelector(".figbox-full");
  var latestRequest = 0;

  function show(trigger) {
    var thumb = trigger.querySelector("img");
    var full = trigger.getAttribute("href");

    label.textContent = trigger.getAttribute("data-fig-label");
    title.textContent = trigger.getAttribute("data-fig-title");
    caption.textContent = trigger.getAttribute("data-fig-caption");
    paperLink.href = trigger.getAttribute("data-fig-paper");
    fullLink.href = full;
    image.alt = thumb.alt;

    // Show the loaded thumbnail straight away, then swap in the sharp image. Both have
    // the same proportions, so the popup does not change size when the swap happens.
    image.src = thumb.currentSrc || thumb.src;
    var request = ++latestRequest;
    var sharp = new Image();
    sharp.onload = function () {
      if (request === latestRequest) image.src = full;
    };
    sharp.src = full;

    document.documentElement.classList.add("figbox-lock");
    box.showModal();
  }

  Array.prototype.forEach.call(triggers, function (trigger) {
    trigger.addEventListener("click", function (event) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      show(trigger);
    });
  });

  box.querySelector(".figbox-close").addEventListener("click", function () {
    box.close();
  });
  box.addEventListener("click", function (event) {
    if (event.target === box) box.close();
  });
  box.addEventListener("close", function () {
    document.documentElement.classList.remove("figbox-lock");
  });
})();
