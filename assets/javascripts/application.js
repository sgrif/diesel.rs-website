//= require_tree .

var onReady = function () {
  var logo = document.querySelector(".logo");
  logo.addEventListener("mouseover", function (e) {
    logo.classList.add("animate");
  });

  logo.querySelector("#drop").addEventListener("animationend", function (e) {
    logo.classList.remove("animate");
  });
};

document.addEventListener("DOMContentLoaded", onReady, false);

// this code is ripped off from the home page's tab selector code
function change_db_type(evt, db_type) {
  // Declare all variables
  var i, examples_content, db_type_buttons;

  // Get all elements with class="postgres-example" and hide them
  examples_content = document.getElementsByClassName("postgres-example");
  for (i = 0; i < examples_content.length; i++) {
    examples_content[i].style.display = "none";
  }

  // Get all elements with class="sqlite-example" and hide them
  examples_content = document.getElementsByClassName("sqlite-example");
  for (i = 0; i < examples_content.length; i++) {
    examples_content[i].style.display = "none";
  }

  // Get all elements with class="mysql-example" and hide them
  examples_content = document.getElementsByClassName("mysql-example");
  for (i = 0; i < examples_content.length; i++) {
    examples_content[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "btn-primary"
  db_type_buttons = document.getElementsByClassName("db-type-button");
  for (i = 0; i < db_type_buttons.length; i++) {
    db_type_buttons[i].className = db_type_buttons[i].className.replace(
      " btn-primary",
      "",
    );
  }

  // Get all elements with the now-selected class name and show them
  examples_content = document.getElementsByClassName(db_type + "-example");
  console.log(examples_content);
  for (i = 0; i < examples_content.length; i++) {
    examples_content[i].style.display = "block";
  }
  // set the link that was clicked to be active
  evt.currentTarget.className += " btn-primary";
}
