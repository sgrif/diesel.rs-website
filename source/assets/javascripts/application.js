//= require_tree .

var onReady = function() {
  var logo = document.querySelector(".logo")
  logo.addEventListener("mouseover", function(e) {
    logo.classList.add("animate");
  });

  logo.querySelector("#drop").addEventListener("animationend", function(e) {
    logo.classList.remove("animate");
  });
};

document.addEventListener("DOMContentLoaded", onReady, false);
