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

var toggleOff = function() {
  if (!event.target.matches('.dropdown-btn')) {
    var dropdowns = document.getElementsByClassName("dropdown-links");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.addEventListener("click", toggleOff);

function toggleDropdown() {
  document.getElementById("guides-dropdown").classList.toggle("show");
}
